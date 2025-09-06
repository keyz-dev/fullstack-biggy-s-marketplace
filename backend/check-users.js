const mongoose = require('mongoose');
const User = require('./src/models/user');
require('dotenv').config();

async function checkUsers() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Check all users and their isActive status
    const users = await User.find({}, 'name email role isActive isVerified emailVerified').lean();
    
    console.log(`\nTotal users: ${users.length}`);
    console.log('\nUser Status Summary:');
    
    const activeUsers = users.filter(u => u.isActive === true);
    const inactiveUsers = users.filter(u => u.isActive === false);
    const verifiedUsers = users.filter(u => u.emailVerified === true);
    const unverifiedUsers = users.filter(u => u.emailVerified === false);
    
    console.log(`Active users: ${activeUsers.length}`);
    console.log(`Inactive users: ${inactiveUsers.length}`);
    console.log(`Email verified users: ${verifiedUsers.length}`);
    console.log(`Email unverified users: ${unverifiedUsers.length}`);
    
    if (inactiveUsers.length > 0) {
      console.log('\nInactive users:');
      inactiveUsers.forEach(user => {
        console.log(`- ${user.name} (${user.email}) - Role: ${user.role} - Verified: ${user.emailVerified}`);
      });
    }
    
    if (unverifiedUsers.length > 0) {
      console.log('\nUnverified users:');
      unverifiedUsers.forEach(user => {
        console.log(`- ${user.name} (${user.email}) - Role: ${user.role} - Active: ${user.isActive}`);
      });
    }
    
    // Check if there are any users with isActive: false that should be active
    console.log('\nChecking for users that might need to be activated...');
    
    const usersToActivate = users.filter(u => 
      u.isActive === false && 
      ['client', 'farmer', 'delivery_agent'].includes(u.role)
    );
    
    if (usersToActivate.length > 0) {
      console.log(`Found ${usersToActivate.length} users that should be active:`);
      usersToActivate.forEach(user => {
        console.log(`- ${user.name} (${user.email}) - Role: ${user.role}`);
      });
      
      console.log('\nTo fix this, run:');
      console.log('db.users.updateMany({role: {$in: ["client", "farmer", "delivery_agent"]}}, {$set: {isActive: true}})');
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB');
  }
}

checkUsers();

