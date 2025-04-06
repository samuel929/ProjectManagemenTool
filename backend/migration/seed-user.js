import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { User } from '../models/user.model.js';



// Sample user data with hashed passwords
const users = [
  {
    email: 'alice.johnson@example.com',
    password: bcrypt.hashSync('AlicePassword123!', 10),
    name: 'Alice Johnson',
    role: 'admin',
    isVerified: true
  },
  {
    email: 'bob.smith@example.com',
    password: bcrypt.hashSync('BobPassword123!', 10),
    name: 'Bob Smith',
    role: 'project-manager',
    isVerified: true
  },
  {
    email: 'charlie.brown@example.com',
    password: bcrypt.hashSync('CharliePassword123!', 10),
    name: 'Charlie Brown',
    role: 'developer'
  },
  {
    email: 'diana.prince@example.com',
    password: bcrypt.hashSync('DianaPassword123!', 10),
    name: 'Diana Prince',
    role: 'developer',
    isVerified: true
  },
  {
    email: 'evan.nguyen@example.com',
    password: bcrypt.hashSync('EvanPassword123!', 10),
    name: 'Evan Nguyen',
    role: 'project-manager'
  },
  {
    email: 'fiona.garcia@example.com',
    password: bcrypt.hashSync('FionaPassword123!', 10),
    name: 'Fiona Garcia',
    role: 'developer'
  },
  {
    email: 'george.martin@example.com',
    password: bcrypt.hashSync('GeorgePassword123!', 10),
    name: 'George Martin',
    role: 'admin',
    isVerified: true
  },
  {
    email: 'hannah.wilson@example.com',
    password: bcrypt.hashSync('HannahPassword123!', 10),
    name: 'Hannah Wilson',
    role: 'developer'
  },
  {
    email: 'ian.chen@example.com',
    password: bcrypt.hashSync('IanPassword123!', 10),
    name: 'Ian Chen',
    role: 'project-manager',
    isVerified: true
  },
  {
    email: 'julia.roberts@example.com',
    password: bcrypt.hashSync('JuliaPassword123!', 10),
    name: 'Julia Roberts',
    role: 'developer'
  }
];

// Database connection and seeding function
async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB');

    // Insert new users
    const createdUsers = await User.insertMany(users);
    console.log(`Successfully seeded ${createdUsers.length} users`);

    // Display inserted users
    console.log('Inserted users:');
    createdUsers.forEach(user => {
      console.log(`- ${user.name} (${user.email})`);
    });
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run the seeding function
seedDatabase();