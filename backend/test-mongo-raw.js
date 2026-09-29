const { MongoClient } = require('mongodb');
const dns = require('dns');

dns.setServers(['8.8.8.8', '8.8.4.4']);

const uri = "mongodb+srv://samcodes:samcodes@cluster0.cwciirf.mongodb.net/visitor-db?appName=Cluster0";
const client = new MongoClient(uri, { serverSelectionTimeoutMS: 5000 });

async function run() {
  try {
    await client.connect();
    console.log("Connected successfully to server");
    process.exit(0);
  } catch (err) {
    console.error("Connection failed:", err.message);
    process.exit(1);
  } finally {
    await client.close();
  }
}

run();
