import { User } from '../models/models.js';
import { seedDatabase } from '../seed.js';
import sequelize from '../config/db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'granite_tile_mms_super_secret_jwt_key_2026';

const testLogins = async () => {
  console.log('=== Step 1: Initializing Database & Running Seed ===');
  await sequelize.sync();
  await seedDatabase();

  console.log('\n=== Step 2: Fetching All Users From Database ===');
  const users = await User.findAll();
  console.log(`Total users in database: ${users.length}`);

  const targetUsers = [
    { username: 'admin', password: 'admin123', email: 'ramesh.s@granitex.com', phone: '+91 98400 12345' },
    { username: 'priya', password: 'admin123', email: 'priya.n@granitex.com', phone: '+91 98400 54321' },
    { username: 'karthik', password: 'admin123', email: 'karthik.s@granitex.com', phone: '+91 98400 99887' },
    { username: 'kavitha', password: 'admin123', email: 'kavitha.r@granitex.com', phone: '+91 98400 33445' },
    { username: 'suresh', password: 'admin123', email: 'suresh.b@granitex.com', phone: '+91 98400 77665' },
    { username: 'divya', password: 'admin123', email: 'divya.c@granitex.com', phone: '+91 98400 11223' }
  ];

  console.log('\n=== Step 3: Verifying User Logins (Username, Email, Phone) ===');
  let successCount = 0;

  for (let i = 0; i < targetUsers.length; i++) {
    const account = targetUsers[i];
    console.log(`\n--- User Login #${i + 1}: ${account.username} ---`);

    // Test Username Authentication
    const userByUsername = await User.findOne({ where: { username: account.username } });
    if (!userByUsername) {
      console.error(`❌ User record not found for username: ${account.username}`);
      continue;
    }

    const passMatch = await bcrypt.compare(account.password, userByUsername.password);
    if (!passMatch) {
      console.error(`❌ Password verification failed for username: ${account.username}`);
      continue;
    }

    // Test Email Authentication lookup
    const userByEmail = await User.findOne({ where: { email: account.email } });
    if (!userByEmail || userByEmail.id !== userByUsername.id) {
      console.error(`❌ Email lookup failed or mismatched for: ${account.email}`);
      continue;
    }

    // Test Phone Authentication lookup
    const userByPhone = await User.findOne({ where: { mobile: account.phone } });
    if (!userByPhone || userByPhone.id !== userByUsername.id) {
      console.error(`❌ Phone lookup failed or mismatched for: ${account.phone}`);
      continue;
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: userByUsername.id, username: userByUsername.username, role: userByUsername.role, department: userByUsername.department },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    const verifiedToken = jwt.verify(token, JWT_SECRET);

    console.log(`✅ [LOGIN CHECK OK] User #${i + 1}`);
    console.log(`   - Name: ${userByUsername.fullName}`);
    console.log(`   - Username: ${userByUsername.username}`);
    console.log(`   - Email: ${userByUsername.email}`);
    console.log(`   - Phone: ${userByUsername.mobile}`);
    console.log(`   - Role: ${userByUsername.role}`);
    console.log(`   - Department: ${userByUsername.department}`);
    console.log(`   - JWT Verification: Valid (ID: ${verifiedToken.id}, Role: ${verifiedToken.role})`);

    successCount++;
  }

  console.log(`\n==================================================`);
  console.log(`RESULT: ${successCount}/${targetUsers.length} user logins created & verified successfully!`);
  console.log(`==================================================`);

  process.exit(0);
};

testLogins().catch(err => {
  console.error('Test execution failed:', err);
  process.exit(1);
});
