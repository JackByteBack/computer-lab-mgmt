require('dotenv').config();
const mongoose = require('mongoose');
const Computer = require('./models/Computer');
const SoftwareLicense = require('./models/SoftwareLicense');
const Maintenance = require('./models/Maintenance');

const connectDB = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('✅ MongoDB connected');
};

const computers = Array.from({ length: 32 }, (_, i) => {
  const num = String(i + 1).padStart(2, '0');
  const statuses = ['free', 'free', 'in-use', 'free', 'maintenance', 'offline'];
  const status = i < 4 ? statuses[i % statuses.length] : (i % 7 === 0 ? 'maintenance' : i % 11 === 0 ? 'offline' : i % 3 === 0 ? 'in-use' : 'free');
  return {
    pcId: `PC-${num}`,
    hostname: `lab-c-${num}`,
    status,
    currentUser: status === 'in-use' ? ['Priya Sharma', 'Rahul Mehta', 'Anita Rao', 'Deepak Jain'][i % 4] : null,
    specs: {
      cpu: i % 5 === 0 ? 'Intel Core i7-13700' : 'Intel Core i5-12400',
      ram: i % 5 === 0 ? '16GB' : '8GB',
      storage: '512GB SSD',
      os: 'Windows 11 Pro'
    },
    location: { lab: 'Lab C', row: Math.floor(i / 8) + 1, seat: (i % 8) + 1 }
  };
});

const licenses = [
  { name: 'Microsoft Office 365', version: '2024', licenseType: 'Volume', totalSeats: 32, usedSeats: 28, vendor: 'Microsoft', expiryDate: new Date('2026-01-15'), cost: 45000 },
  { name: 'Adobe Creative Cloud', version: '2024', licenseType: 'Named', totalSeats: 10, usedSeats: 10, vendor: 'Adobe', expiryDate: new Date('2025-05-01'), cost: 78000 },
  { name: 'MATLAB R2024a', version: 'R2024a', licenseType: 'Concurrent', totalSeats: 5, usedSeats: 3, vendor: 'MathWorks', expiryDate: new Date('2025-05-17'), cost: 120000 },
  { name: 'AutoCAD 2025', version: '2025', licenseType: 'Volume', totalSeats: 32, usedSeats: 12, vendor: 'Autodesk', expiryDate: new Date('2025-07-20'), cost: 95000 },
  { name: 'Visual Studio 2022', version: '17.x', licenseType: 'Open Source', totalSeats: 999, usedSeats: 32, vendor: 'Microsoft', expiryDate: null, cost: 0 },
  { name: 'Tally Prime', version: '4.1', licenseType: 'Site', totalSeats: 32, usedSeats: 8, vendor: 'Tally Solutions', expiryDate: new Date('2025-12-01'), cost: 22000 },
  { name: 'VMware Workstation Pro', version: '17', licenseType: 'Academic', totalSeats: 15, usedSeats: 7, vendor: 'VMware', expiryDate: new Date('2025-10-10'), cost: 30000 },
];

const tickets = [
  { pcId: 'PC-03', issue: 'Monitor flickering on boot', priority: 'high', assignee: 'Suresh Tiwari', reportedBy: 'Lab Admin' },
  { pcId: 'PC-07', issue: 'System fails POST — RAM suspected', priority: 'high', assignee: 'Suresh Tiwari', status: 'in-progress', reportedBy: 'Lab Admin' },
  { pcId: 'PC-12', issue: 'Keyboard keys stuck (liquid damage)', priority: 'medium', assignee: 'Unassigned', reportedBy: 'Student' },
  { pcId: 'PC-18', issue: 'HDD bad sectors — replacement needed', priority: 'high', assignee: 'Ravi Kumar', status: 'in-progress', reportedBy: 'Lab Admin' },
  { pcId: 'PC-22', issue: 'OS corruption, requires reimaging', priority: 'medium', assignee: 'Ravi Kumar', reportedBy: 'Lab Admin' },
  { pcId: 'PC-29', issue: 'Overheating — fan needs replacement', priority: 'low', assignee: 'Unassigned', reportedBy: 'Student' },
];

const seed = async () => {
  await connectDB();
  try {
    await Computer.deleteMany();
    await SoftwareLicense.deleteMany();
    await Maintenance.deleteMany();
    console.log('🗑  Cleared existing data');

    await Computer.insertMany(computers);
    console.log(`✅ Seeded ${computers.length} computers`);

    for (const l of licenses) {
      await SoftwareLicense.create(l);
    }
    console.log(`✅ Seeded ${licenses.length} software licenses`);

    for (const t of tickets) {
      await Maintenance.create(t);
    }
    console.log(`✅ Seeded ${tickets.length} maintenance tickets`);

    console.log('\n🎉 Database seeded successfully!');
  } catch (err) {
    console.error('❌ Seeding error:', err.message);
  } finally {
    mongoose.disconnect();
  }
};

seed();
