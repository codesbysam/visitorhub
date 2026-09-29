const mongoose = require('mongoose');
const dns = require('dns');

// Force Node.js to use Google's Public DNS (8.8.8.8) to resolve the SRV record
dns.setServers(['8.8.8.8', '8.8.4.4']);

const uri = "mongodb+srv://samcodes:samcodes@cluster0.cwciirf.mongodb.net/visitor-db?appName=Cluster0";

async function testConnection() {
  console.log(`Testing SRV URI with Google DNS...`);
  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
    console.log(`SUCCESS! Node is connected to Atlas.`);
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error(`FAILED:`, error.message);
    process.exit(1);
  }
}

testConnection();
