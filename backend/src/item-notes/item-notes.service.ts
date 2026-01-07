import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NoteAuthorRole, EventType } from '../common/enums';
import { CreateItemNoteDto, UpdateItemNoteDto, SubmitNoteDto } from './dto/create-item-note.dto';

@Injectable()
export class ItemNotesService {
  constructor(private prisma: PrismaService) {}

  /**
   * Create a new item note
   */
  async createNote(dto: CreateItemNoteDto, authorId: string, authorRole: NoteAuthorRole) {
    // Validate that at least one item ID is provided
    if (!dto.manufacturerItemId && !dto.acceptanceItemId) {
      throw new BadRequestException('Either manufacturerItemId or acceptanceItemId must be provided');
    }

    // Validate the item exists
    if (dto.manufacturerItemId) {
      const item = await this.prisma.manufacturerInspectionItem.findUnique({
        where: { id: dto.manufacturerItemId },
      });
      if (!item) {
        throw new NotFoundException('Manufacturer inspection item not found');
      }
    }

    if (dto.acceptanceItemId) {
      const item = await this.prisma.acceptanceItem.findUnique({
        where: { id: dto.acceptanceItemId },
      });
      if (!item) {
        throw new NotFoundException('Acceptance item not found');
      }
    }

    // Set default visibility based on author role
    const visibleToDealer = authorRole === NoteAuthorRole.DEALER
      ? true
      : (dto.visibleToDealer ?? false);

    const visibleToManufacturer = authorRole === NoteAuthorRole.MANUFACTURER
      ? true
      : (dto.visibleToManufacturer ?? true);

    return this.prisma.itemNote.create({
      data: {
        manufacturerItemId: dto.manufacturerItemId,
        acceptanceItemId: dto.acceptanceItemId,
        authorId,
        authorRole,
        content: dto.content,
        visibleToDealer,
        visibleToManufacturer,
      },
      include: {
        author: { select: { id: true, name: true, email: true } },
      },
    });
  }

  /**
   * Get notes for a manufacturer inspection item
   */
  async getNotesForManufacturerItem(itemId: string, viewerRole: NoteAuthorRole) {
    const where: any = { manufacturerItemId: itemId };

    // Filter by visibility based on viewer role
    if (viewerRole === NoteAuthorRole.DEALER) {
      where.visibleToDealer = true;
      where.submittedAt = { not: null }; // Only show submitted notes to dealer
    } else if (viewerRole === NoteAuthorRole.MANUFACTURER) {
      where.visibleToManufacturer = true;
    }

    return this.prisma.itemNote.findMany({
      where,
      include: {
        author: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  /**
   * Get notes for a dealer acceptance item
   */
  async getNotesForAcceptanceItem(itemId: string, viewerRole: NoteAuthorRole) {
    const where: any = { acceptanceItemId: itemId };

    // Filter by visibility based on viewer role
    if (viewerRole === NoteAuthorRole.DEALER) {
      where.visibleToDealer = true;
    } else if (viewerRole === NoteAuthorRole.MANUFACTURER) {
      where.visibleToManufacturer = true;
      where.submittedAt = { not: null }; // Only show submitted notes to manufacturer
    }

    return this.prisma.itemNote.findMany({
      where,
      include: {
        author: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  /**
   * Update a note (only author can update)
   */
  async updateNote(noteId: string, dto: UpdateItemNoteDto, userId: string) {
    const note = await this.prisma.itemNote.findUnique({
      where: { id: noteId },
    });

    if (!note) {
      throw new NotFoundException('Note not found');
    }

    if (note.authorId !== userId) {
      throw new ForbiddenException('You can only edit your own notes');
    }

    // Cannot edit submitted notes
    if (note.submittedAt) {
      throw new BadRequestException('Cannot edit a submitted note');
    }

    return this.prisma.itemNote.update({
      where: { id: noteId },
      data: {
        content: dto.content,
        visibleToDealer: dto.visibleToDealer,
        visibleToManufacturer: dto.visibleToManufacturer,
      },
      include: {
        author: { select: { id: true, name: true } },
      },
    });
  }

  /**
   * Submit a note (makes it visible/official)
   */
  async submitNote(noteId: string, dto: SubmitNoteDto, userId: string) {
    const note = await this.prisma.itemNote.findUnique({
      where: { id: noteId },
    });

    if (!note) {
      throw new NotFoundException('Note not found');
    }

    if (note.authorId !== userId) {
      throw new ForbiddenException('You can only submit your own notes');
    }

    if (note.submittedAt) {
      throw new BadRequestException('Note already submitted');
    }

    return this.prisma.itemNote.update({
      where: { id: noteId },
      data: {
        submittedAt: new Date(),
        visibleToDealer: dto.makeVisibleToDealer ?? note.visibleToDealer,
      },
      include: {
        author: { select: { id: true, name: true } },
      },
    });
  }

  /**
   * Delete a note (only author can delete, and only if not submitted)
   */
  async deleteNote(noteId: string, userId: string) {
    const note = await this.prisma.itemNote.findUnique({
      where: { id: noteId },
    });

    if (!note) {
      throw new NotFoundException('Note not found');
    }

    if (note.authorId !== userId) {
      throw new ForbiddenException('You can only delete your own notes');
    }

    if (note.submittedAt) {
      throw new BadRequestException('Cannot delete a submitted note');
    }

    await this.prisma.itemNote.delete({
      where: { id: noteId },
    });

    return { deleted: true };
  }

  /**
   * Get all notes for a unit (for report view)
   */
  async getNotesForUnit(unitId: string, viewerRole: NoteAuthorRole) {
    // Get all manufacturer inspection items for this unit
    const inspections = await this.prisma.manufacturerInspectionRecord.findMany({
      where: { unitId },
      select: {
        manufacturerInspectionItems: {
          select: { id: true },
        },
      },
    });

    const mfgItemIds = inspections.flatMap(i =>
      i.manufacturerInspectionItems.map(item => item.id)
    );

    // Get all acceptance items for this unit
    const acceptances = await this.prisma.acceptanceRecord.findMany({
      where: { unitId },
      select: {
        acceptanceItems: {
          select: { id: true },
        },
      },
    });

    const acceptanceItemIds = acceptances.flatMap(a =>
      a.acceptanceItems.map(item => item.id)
    );

    // Build where clause based on viewer role
    const baseWhere: any = {
      OR: [
        { manufacturerItemId: { in: mfgItemIds } },
        { acceptanceItemId: { in: acceptanceItemIds } },
      ],
    };

    if (viewerRole === NoteAuthorRole.DEALER) {
      baseWhere.visibleToDealer = true;
      baseWhere.submittedAt = { not: null };
    } else if (viewerRole === NoteAuthorRole.MANUFACTURER) {
      baseWhere.visibleToManufacturer = true;
    }

    return this.prisma.itemNote.findMany({
      where: baseWhere,
      include: {
        author: { select: { id: true, name: true } },
        manufacturerItem: {
          include: {
            checklistItem: { select: { code: true, description: true } },
          },
        },
        acceptanceItem: {
          include: {
            checklistItem: { select: { code: true, description: true } },
          },
        },
      },
      orderBy: { createdAt: 'asc' },
    });
  }
}
