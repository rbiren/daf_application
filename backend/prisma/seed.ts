import { PrismaClient, UserRole, UnitStatus, ItemStatus, PdiStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Clean existing data
  await prisma.$transaction([
    prisma.acceptancePhoto.deleteMany(),
    prisma.acceptanceItem.deleteMany(),
    prisma.acceptanceRecord.deleteMany(),
    prisma.pdiPhoto.deleteMany(),
    prisma.pdiItem.deleteMany(),
    prisma.pdiRecord.deleteMany(),
    prisma.unitEvent.deleteMany(),
    prisma.unitOption.deleteMany(),
    prisma.unit.deleteMany(),
    prisma.checklistItem.deleteMany(),
    prisma.checklistCategory.deleteMany(),
    prisma.checklistTemplate.deleteMany(),
    prisma.auditLog.deleteMany(),
    prisma.syncQueue.deleteMany(),
    prisma.user.deleteMany(),
    prisma.dealer.deleteMany(),
    prisma.option.deleteMany(),
    prisma.model.deleteMany(),
  ]);

  // Create Models
  const models = await Promise.all([
    prisma.model.create({
      data: { name: 'Aria 3200', code: 'ARIA-3200', category: 'Class A' },
    }),
    prisma.model.create({
      data: { name: 'Vegas 2400', code: 'VEGAS-2400', category: 'Class A' },
    }),
    prisma.model.create({
      data: { name: 'Venetian XL', code: 'VENETIAN-XL', category: 'Class A' },
    }),
    prisma.model.create({
      data: { name: 'Palazzo 35.5', code: 'PALAZZO-355', category: 'Class A' },
    }),
  ]);

  console.log(`Created ${models.length} models`);

  // Create Options
  const options = await Promise.all([
    prisma.option.create({ data: { name: 'Hydraulic Leveling', code: 'HYD-LVL', category: 'Chassis' } }),
    prisma.option.create({ data: { name: 'Residential Refrigerator', code: 'RES-FRIDGE', category: 'Appliances' } }),
    prisma.option.create({ data: { name: 'Washer/Dryer Combo', code: 'WASH-DRY', category: 'Appliances' } }),
    prisma.option.create({ data: { name: 'Solar Panel Package', code: 'SOLAR-PKG', category: 'Electrical' } }),
    prisma.option.create({ data: { name: 'Outdoor Kitchen', code: 'OUTDOOR-KIT', category: 'Exterior' } }),
    prisma.option.create({ data: { name: 'King Bed', code: 'KING-BED', category: 'Interior' } }),
    prisma.option.create({ data: { name: 'Theater Seating', code: 'THEATER', category: 'Interior' } }),
    prisma.option.create({ data: { name: 'Fireplace', code: 'FIREPLACE', category: 'Interior' } }),
  ]);

  console.log(`Created ${options.length} options`);

  // Create Dealers
  const dealers = await Promise.all([
    prisma.dealer.create({
      data: {
        name: 'ABC RV Dealership',
        code: 'ABC001',
        address: {
          street: '123 RV Lane',
          city: 'Chicago',
          state: 'IL',
          zip: '60601',
        },
        phone: '+1-555-123-4567',
        email: 'contact@abcrv.com',
      },
    }),
    prisma.dealer.create({
      data: {
        name: 'Sunshine RV Center',
        code: 'SUN002',
        address: {
          street: '456 Sunny Blvd',
          city: 'Tampa',
          state: 'FL',
          zip: '33601',
        },
        phone: '+1-555-987-6543',
        email: 'info@sunshinervs.com',
      },
    }),
  ]);

  console.log(`Created ${dealers.length} dealers`);

  // Create Users
  const passwordHash = await bcrypt.hash('password123', 10);

  const users = await Promise.all([
    // System Admin
    prisma.user.create({
      data: {
        email: 'admin@example.com',
        name: 'System Admin',
        role: UserRole.SYSTEM_ADMIN,
        passwordHash,
      },
    }),
    // Manufacturer QA
    prisma.user.create({
      data: {
        email: 'qa@manufacturer.com',
        name: 'Mike Rodriguez',
        role: UserRole.MFG_QA,
        passwordHash,
      },
    }),
    // Dealer Admin
    prisma.user.create({
      data: {
        email: 'admin@abcrv.com',
        name: 'Bob Manager',
        role: UserRole.DEALER_ADMIN,
        dealerId: dealers[0].id,
        passwordHash,
      },
    }),
    // Dealer Tech
    prisma.user.create({
      data: {
        email: 'dealer@example.com',
        name: 'John Smith',
        role: UserRole.DEALER_TECH,
        dealerId: dealers[0].id,
        passwordHash,
      },
    }),
    // Another Dealer Tech
    prisma.user.create({
      data: {
        email: 'mary@abcrv.com',
        name: 'Mary Jones',
        role: UserRole.DEALER_TECH,
        dealerId: dealers[0].id,
        passwordHash,
      },
    }),
  ]);

  console.log(`Created ${users.length} users`);

  // Create Checklist Template
  const checklistTemplate = await prisma.checklistTemplate.create({
    data: {
      name: 'Standard RV Acceptance Checklist',
      description: 'Complete acceptance checklist for Class A motorhomes',
      version: 1,
      categories: {
        create: [
          {
            name: 'Exterior Inspection',
            code: 'EXT',
            orderNum: 1,
            items: {
              create: [
                { code: '1.1.1', description: 'Front cap condition (no cracks/damage)', orderNum: 1 },
                { code: '1.1.2', description: 'Headlights operational', orderNum: 2 },
                { code: '1.1.3', description: 'Turn signals operational', orderNum: 3 },
                { code: '1.1.4', description: 'Clearance lights operational', orderNum: 4 },
                { code: '1.1.5', description: 'Graphics/decals intact', orderNum: 5 },
                { code: '1.2.1', description: 'Entry door operation', orderNum: 6 },
                { code: '1.2.2', description: 'Entry door seal condition', orderNum: 7 },
                { code: '1.2.3', description: 'Entry steps extend/retract', orderNum: 8 },
                { code: '1.2.4', description: 'Sidewall condition (driver side)', orderNum: 9 },
                { code: '1.2.5', description: 'Windows condition & seals', orderNum: 10 },
              ],
            },
          },
          {
            name: 'Interior Inspection',
            code: 'INT',
            orderNum: 2,
            items: {
              create: [
                { code: '2.1.1', description: 'Dashboard condition', orderNum: 1 },
                { code: '2.1.2', description: 'Instrument cluster functional', orderNum: 2 },
                { code: '2.1.3', description: 'HVAC controls functional', orderNum: 3 },
                { code: '2.2.1', description: 'Flooring condition', orderNum: 4 },
                { code: '2.2.2', description: 'Cabinet doors aligned', orderNum: 5 },
                { code: '2.2.3', description: 'Drawers operate smoothly', orderNum: 6 },
                { code: '2.3.1', description: 'Dinette condition', orderNum: 7 },
                { code: '2.3.2', description: 'Sofa/seating condition', orderNum: 8 },
              ],
            },
          },
          {
            name: 'Electrical Systems',
            code: 'ELEC',
            orderNum: 3,
            items: {
              create: [
                { code: '3.1.1', description: '12V system operational', orderNum: 1 },
                { code: '3.1.2', description: 'All interior lights work', orderNum: 2 },
                { code: '3.1.3', description: 'USB ports functional', orderNum: 3 },
                { code: '3.2.1', description: '120V shore power connection', orderNum: 4 },
                { code: '3.2.2', description: 'All outlets functional', orderNum: 5 },
                { code: '3.2.3', description: 'GFCI outlets test/reset', orderNum: 6 },
              ],
            },
          },
          {
            name: 'Plumbing Systems',
            code: 'PLUMB',
            orderNum: 4,
            items: {
              create: [
                { code: '4.1.1', description: 'Fresh water tank fill', orderNum: 1 },
                { code: '4.1.2', description: 'Water pump operational', orderNum: 2 },
                { code: '4.1.3', description: 'All faucets function', orderNum: 3 },
                { code: '4.2.1', description: 'Toilet flushes properly', orderNum: 4 },
                { code: '4.2.2', description: 'Dump valves operate', orderNum: 5 },
                { code: '4.3.1', description: 'Water heater operates', orderNum: 6 },
              ],
            },
          },
          {
            name: 'Appliances',
            code: 'APPL',
            orderNum: 5,
            items: {
              create: [
                { code: '5.1.1', description: 'Refrigerator cools on all modes', orderNum: 1 },
                { code: '5.1.2', description: 'Freezer operates', orderNum: 2 },
                { code: '5.2.1', description: 'Cooktop ignites (all burners)', orderNum: 3 },
                { code: '5.2.2', description: 'Oven operates', orderNum: 4 },
                { code: '5.3.1', description: 'Microwave functions', orderNum: 5 },
                { code: '5.4.1', description: 'Air conditioner cools', orderNum: 6 },
                { code: '5.4.2', description: 'Furnace heats', orderNum: 7 },
              ],
            },
          },
          {
            name: 'Safety & Documentation',
            code: 'SAFE',
            orderNum: 6,
            items: {
              create: [
                { code: '6.1.1', description: 'Smoke detector functional', orderNum: 1 },
                { code: '6.1.2', description: 'CO detector functional', orderNum: 2 },
                { code: '6.1.3', description: 'LP detector functional', orderNum: 3 },
                { code: '6.1.4', description: 'Fire extinguisher present', orderNum: 4 },
                { code: '6.2.1', description: 'Owner\'s manual present', orderNum: 5 },
                { code: '6.2.2', description: 'Warranty documents present', orderNum: 6 },
                { code: '6.2.3', description: 'Appliance manuals present', orderNum: 7 },
              ],
            },
          },
        ],
      },
    },
    include: {
      categories: {
        include: {
          items: true,
        },
      },
    },
  });

  console.log(`Created checklist template with ${checklistTemplate.categories.length} categories`);

  // Create Units
  const units = await Promise.all([
    // Unit ready for acceptance
    prisma.unit.create({
      data: {
        vin: '1THO123456ABC78901',
        stockNumber: 'STK-2024-001',
        dealerId: dealers[0].id,
        modelId: models[0].id,
        modelYear: 2024,
        exteriorColor: 'Champagne Metallic',
        interiorColor: 'Saddle Leather',
        chassisType: 'Ford F-53',
        engineType: '7.3L V8',
        gvwr: 22000,
        shipDate: new Date('2024-01-03'),
        receiveDate: new Date('2024-01-05'),
        status: UnitStatus.RECEIVED,
      },
    }),
    // Unit with PDI issues
    prisma.unit.create({
      data: {
        vin: '1THO234567DEF89012',
        stockNumber: 'STK-2024-002',
        dealerId: dealers[0].id,
        modelId: models[1].id,
        modelYear: 2024,
        exteriorColor: 'Arctic White',
        interiorColor: 'Graphite',
        chassisType: 'Ford F-53',
        engineType: '7.3L V8',
        gvwr: 18000,
        shipDate: new Date('2024-01-04'),
        receiveDate: new Date('2024-01-06'),
        status: UnitStatus.PDI_COMPLETE,
      },
    }),
    // Unit in acceptance
    prisma.unit.create({
      data: {
        vin: '1THO345678GHI90123',
        stockNumber: 'STK-2024-003',
        dealerId: dealers[0].id,
        modelId: models[2].id,
        modelYear: 2024,
        exteriorColor: 'Midnight Blue',
        interiorColor: 'Cream',
        chassisType: 'Freightliner',
        engineType: 'Cummins 6.7L',
        gvwr: 26000,
        receiveDate: new Date('2024-01-04'),
        status: UnitStatus.IN_ACCEPTANCE,
      },
    }),
    // Accepted unit
    prisma.unit.create({
      data: {
        vin: '1THO456789JKL01234',
        stockNumber: 'STK-2024-004',
        dealerId: dealers[0].id,
        modelId: models[3].id,
        modelYear: 2024,
        exteriorColor: 'Sedona Brown',
        interiorColor: 'Mocha',
        chassisType: 'Freightliner',
        engineType: 'Cummins 6.7L',
        gvwr: 28000,
        receiveDate: new Date('2024-01-02'),
        status: UnitStatus.ACCEPTED,
      },
    }),
    // Unit pending PDI
    prisma.unit.create({
      data: {
        vin: '1THO567890KLM12345',
        stockNumber: 'STK-2024-005',
        dealerId: dealers[0].id,
        modelId: models[0].id,
        modelYear: 2024,
        exteriorColor: 'Glacier White',
        interiorColor: 'Slate',
        chassisType: 'Ford F-53',
        engineType: '7.3L V8',
        gvwr: 22000,
        status: UnitStatus.PENDING_PDI,
      },
    }),
  ]);

  console.log(`Created ${units.length} units`);

  // Create PDI Record for first unit
  const pdiRecord = await prisma.pdiRecord.create({
    data: {
      unitId: units[0].id,
      inspectorId: 'INS-001',
      inspectorName: 'Mike Rodriguez',
      completedAt: new Date('2024-01-04T14:30:00Z'),
      status: PdiStatus.COMPLETE,
      totalItems: 142,
      passedItems: 139,
      failedItems: 3,
      notes: 'Unit inspected thoroughly. All systems functional. Three minor issues found and corrected during PDI. Recommend dealer verify slide operation.',
      pdiItems: {
        create: [
          {
            itemCode: '2.3.1',
            itemDescription: 'Dinette table stability',
            status: ItemStatus.ISSUE,
            notes: 'Dinette table wobble, mounting loose',
            resolved: true,
            resolvedBy: 'T. Martinez',
            resolvedAt: new Date('2024-01-04T15:15:00Z'),
            resolutionNotes: 'Re-torqued mounting bolts to spec',
          },
          {
            itemCode: '2.2.2',
            itemDescription: 'Wardrobe door alignment',
            status: ItemStatus.ISSUE,
            notes: 'Wardrobe door misaligned',
            resolved: true,
            resolvedBy: 'T. Martinez',
            resolvedAt: new Date('2024-01-04T15:45:00Z'),
            resolutionNotes: 'Adjusted hinges, door now closes properly',
          },
          {
            itemCode: '4.1.3',
            itemDescription: 'Kitchen faucet connection',
            status: ItemStatus.ISSUE,
            notes: 'Minor drip at kitchen faucet connection',
            resolved: true,
            resolvedBy: 'J. Wilson',
            resolvedAt: new Date('2024-01-04T16:00:00Z'),
            resolutionNotes: 'Replaced supply line, tested no leak',
          },
        ],
      },
    },
  });

  console.log('Created PDI record with 3 resolved issues');

  // Create PDI Record for second unit with unresolved issue
  await prisma.pdiRecord.create({
    data: {
      unitId: units[1].id,
      inspectorId: 'INS-001',
      inspectorName: 'Mike Rodriguez',
      completedAt: new Date('2024-01-05T10:00:00Z'),
      status: PdiStatus.COMPLETE,
      totalItems: 142,
      passedItems: 142,
      failedItems: 0,
      notes: 'Unit passed all inspections. Ready for delivery.',
    },
  });

  // Create unit events
  await prisma.unitEvent.createMany({
    data: [
      {
        unitId: units[0].id,
        eventType: 'MANUFACTURED',
        eventDate: new Date('2024-01-01'),
        description: 'Unit manufactured',
        source: 'erp-system',
      },
      {
        unitId: units[0].id,
        eventType: 'PDI_COMPLETED',
        eventDate: new Date('2024-01-04'),
        description: 'PDI completed - 3 issues found and resolved',
        source: 'pdi-system',
      },
      {
        unitId: units[0].id,
        eventType: 'SHIPPED',
        eventDate: new Date('2024-01-03'),
        description: 'Unit shipped to dealer',
        source: 'erp-system',
      },
      {
        unitId: units[0].id,
        eventType: 'RECEIVED',
        eventDate: new Date('2024-01-05'),
        description: 'Unit received at dealership',
        source: 'system',
        userId: users[3].id,
      },
    ],
  });

  console.log('Created unit events');

  // Update unit statuses
  await prisma.unit.update({
    where: { id: units[0].id },
    data: { status: UnitStatus.RECEIVED },
  });

  console.log('Database seeded successfully!');
  console.log('\nTest Credentials:');
  console.log('  Admin: admin@example.com / password123');
  console.log('  QA: qa@manufacturer.com / password123');
  console.log('  Dealer Admin: admin@abcrv.com / password123');
  console.log('  Dealer Tech: dealer@example.com / password123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
