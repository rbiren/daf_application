import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { ItemNotesService } from './item-notes.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { UserRole, NoteAuthorRole } from '../common/enums';
import {
  CreateItemNoteDto,
  UpdateItemNoteDto,
  SubmitNoteDto,
} from './dto/create-item-note.dto';

@ApiTags('item-notes')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('item-notes')
export class ItemNotesController {
  constructor(private readonly notesService: ItemNotesService) {}

  // ============================================================================
  // CREATE NOTES
  // ============================================================================

  @Post()
  @ApiOperation({ summary: 'Create a new item note' })
  @ApiResponse({ status: 201, description: 'Note created' })
  async createNote(
    @Body() dto: CreateItemNoteDto,
    @CurrentUser('id') userId: string,
    @CurrentUser('role') role: UserRole,
  ) {
    const authorRole = this.mapUserRoleToNoteRole(role);
    return this.notesService.createNote(dto, userId, authorRole);
  }

  // ============================================================================
  // GET NOTES
  // ============================================================================

  @Get('manufacturer-item/:itemId')
  @ApiOperation({ summary: 'Get notes for a manufacturer inspection item' })
  @ApiResponse({ status: 200, description: 'Returns notes for item' })
  async getNotesForManufacturerItem(
    @Param('itemId') itemId: string,
    @CurrentUser('role') role: UserRole,
  ) {
    const viewerRole = this.mapUserRoleToNoteRole(role);
    return this.notesService.getNotesForManufacturerItem(itemId, viewerRole);
  }

  @Get('acceptance-item/:itemId')
  @ApiOperation({ summary: 'Get notes for a dealer acceptance item' })
  @ApiResponse({ status: 200, description: 'Returns notes for item' })
  async getNotesForAcceptanceItem(
    @Param('itemId') itemId: string,
    @CurrentUser('role') role: UserRole,
  ) {
    const viewerRole = this.mapUserRoleToNoteRole(role);
    return this.notesService.getNotesForAcceptanceItem(itemId, viewerRole);
  }

  @Get('unit/:unitId')
  @ApiOperation({ summary: 'Get all notes for a unit (report view)' })
  @ApiResponse({ status: 200, description: 'Returns all notes for unit' })
  async getNotesForUnit(
    @Param('unitId') unitId: string,
    @CurrentUser('role') role: UserRole,
  ) {
    const viewerRole = this.mapUserRoleToNoteRole(role);
    return this.notesService.getNotesForUnit(unitId, viewerRole);
  }

  // ============================================================================
  // UPDATE & SUBMIT NOTES
  // ============================================================================

  @Patch(':id')
  @ApiOperation({ summary: 'Update a note (author only, before submit)' })
  @ApiResponse({ status: 200, description: 'Note updated' })
  async updateNote(
    @Param('id') noteId: string,
    @Body() dto: UpdateItemNoteDto,
    @CurrentUser('id') userId: string,
  ) {
    return this.notesService.updateNote(noteId, dto, userId);
  }

  @Post(':id/submit')
  @ApiOperation({ summary: 'Submit a note (makes it official/shared)' })
  @ApiResponse({ status: 200, description: 'Note submitted' })
  async submitNote(
    @Param('id') noteId: string,
    @Body() dto: SubmitNoteDto,
    @CurrentUser('id') userId: string,
  ) {
    return this.notesService.submitNote(noteId, dto, userId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a note (author only, before submit)' })
  @ApiResponse({ status: 200, description: 'Note deleted' })
  async deleteNote(
    @Param('id') noteId: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.notesService.deleteNote(noteId, userId);
  }

  // ============================================================================
  // HELPERS
  // ============================================================================

  private mapUserRoleToNoteRole(role: UserRole): NoteAuthorRole {
    switch (role) {
      case UserRole.MFG_QA:
      case UserRole.MFG_ADMIN:
      case UserRole.SYSTEM_ADMIN:
        return NoteAuthorRole.MANUFACTURER;
      case UserRole.DEALER_TECH:
      case UserRole.DEALER_ADMIN:
      default:
        return NoteAuthorRole.DEALER;
    }
  }
}
