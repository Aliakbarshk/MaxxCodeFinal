require('dotenv').config();
const mongoose = require('mongoose');

const uri = process.env.MONGODB_URI;

console.log('====================================================');
console.log('🔍 Testing MongoDB Atlas Connection');
console.log('====================================================');

if (!uri || uri.includes('<password>') || uri.includes('<username>')) {
  console.log('❌ No valid URI found in .env (placeholder detected).');
  console.log('👉 Please update MONGODB_URI in .env with your real password.');
  process.exit(1);
}

// Mask password for display
const maskedUri = uri.replace(/:([^:@]+)@/, ':****@');
console.log(`Connecting to: ${maskedUri}`);

mongoose
  .connect(uri, { serverSelectionTimeoutMS: 5000 })
  .then(() => {
    console.log('\n🎉 SUCCESS: Connected to MongoDB Atlas Cloud!');
    console.log('✅ Database is ready to receive users and sync data.');
    process.exit(0);
  })
  .catch((err) => {
    console.log('\n❌ FAILED to connect to MongoDB Atlas.');
    console.log(`Error: ${err.message}`);
    if (err.message.includes('bad auth')) {
      console.log('💡 TIP: Check your database user password in MongoDB Atlas -> Database Access.');
    } else if (err.message.includes('whitelist') || err.message.includes('timeout')) {
      console.log('💡 TIP: Check MongoDB Atlas -> Network Access -> Add 0.0.0.0/0 (Allow from anywhere).');
    }
    process.exit(1);
  });
