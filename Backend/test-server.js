const http = require('http');

// Test if server is running
const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/health',
  method: 'GET'
};

const req = http.request(options, (res) => {
  console.log(`✅ Server is running! Status: ${res.statusCode}`);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('📊 Response:', data);
  });
});

req.on('error', (error) => {
  console.error('❌ Server is not running:', error.message);
  console.log('💡 Make sure to start the server with: node server.js');
});

req.end();
