import express from 'express';
import cors from 'cors';
import apiRoutes from '../routes/apiRoutes.js';
import { seedDatabase } from '../seed.js';
import sequelize from '../config/db.js';
import http from 'http';

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api', apiRoutes);

const testApiLogins = async () => {
  await sequelize.sync();
  await seedDatabase();

  const server = app.listen(0, async () => {
    const port = server.address().port;
    console.log(`Test server running on port ${port}`);

    const targetUsers = [
      { username: 'admin', password: 'admin123', email: 'ramesh.s@granitex.com', phone: '+91 98400 12345', role: 'Plant Administrator' },
      { username: 'priya', password: 'admin123', email: 'priya.n@granitex.com', phone: '+91 98400 54321', role: 'Sales Executive' },
      { username: 'karthik', password: 'admin123', email: 'karthik.s@granitex.com', phone: '+91 98400 99887', role: 'Production Supervisor' },
      { username: 'kavitha', password: 'admin123', email: 'kavitha.r@granitex.com', phone: '+91 98400 33445', role: 'Inventory Clerk' },
      { username: 'suresh', password: 'admin123', email: 'suresh.b@granitex.com', phone: '+91 98400 77665', role: 'Quality Inspector' },
      { username: 'divya', password: 'admin123', email: 'divya.c@granitex.com', phone: '+91 98400 11223', role: 'Accounts Officer' }
    ];

    let apiPassed = 0;

    for (let i = 0; i < targetUsers.length; i++) {
      const u = targetUsers[i];

      // Test HTTP POST /api/auth/login with Username
      const postData = JSON.stringify({ username: u.username, password: u.password, method: 'username' });

      const options = {
        hostname: '127.0.0.1',
        port: port,
        path: '/api/auth/login',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(postData)
        }
      };

      const result = await new Promise((resolve) => {
        const req = http.request(options, (res) => {
          let data = '';
          res.on('data', chunk => data += chunk);
          res.on('end', () => {
            try {
              resolve(JSON.parse(data));
            } catch (e) {
              resolve({ success: false, message: data });
            }
          });
        });
        req.on('error', (err) => resolve({ success: false, message: err.message }));
        req.write(postData);
        req.end();
      });

      if (result.success && result.token && result.user) {
        console.log(`✅ [HTTP POST /api/auth/login PASS] User #${i+1}: ${result.user.username} (${result.user.role}) - Token Received: ${result.token.substring(0, 20)}...`);
        apiPassed++;
      } else {
        console.error(`❌ [HTTP POST /api/auth/login FAIL] User #${i+1}: ${u.username}`, result);
      }
    }

    console.log(`\n==================================================`);
    console.log(`HTTP API LOGIN RESULT: ${apiPassed}/${targetUsers.length} endpoints verified successfully!`);
    console.log(`==================================================`);

    server.close();
    process.exit(0);
  });
};

testApiLogins().catch(err => {
  console.error('API Test error:', err);
  process.exit(1);
});
