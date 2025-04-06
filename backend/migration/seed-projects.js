import mongoose from 'mongoose';
import { Project } from '../models/projects.model.js';
import { User } from '../models/user.model.js';
// Sample projects data
const projects = [
  {
    title: "E-Commerce Platform Redesign",
    description: "Complete overhaul of the existing e-commerce platform with modern UI/UX and improved checkout flow",
    deadline: new Date('2025-06-15'),
    createdBy: new mongoose.Types.ObjectId("67f28105d9865d7cb79f2203") // Alice Johnson (admin)
  },
  {
    title: "Mobile App Development",
    description: "Build a cross-platform mobile application for both iOS and Android",
    deadline: new Date('2025-05-30'),
    createdBy: new mongoose.Types.ObjectId("67f28105d9865d7cb79f2204") // Bob Smith (project-manager)
  },
  {
    title: "API Microservices Migration",
    description: "Migrate monolithic backend to microservices architecture",
    deadline: new Date('2025-07-20'),
    createdBy: new mongoose.Types.ObjectId("67f28105d9865d7cb79f2209") // George Martin (admin)
  },
  {
    title: "Dashboard Analytics Feature",
    description: "Implement advanced analytics and reporting features for the admin dashboard",
    deadline: new Date('2025-05-10'),
    createdBy: new mongoose.Types.ObjectId("67f28105d9865d7cb79f220b") // Ian Chen (project-manager)
  },
  {
    title: "Automated Testing Suite",
    description: "Create comprehensive unit and integration tests for core modules",
    deadline: new Date('2025-06-01'),
    createdBy: new mongoose.Types.ObjectId("67f28105d9865d7cb79f2207") // Evan Nguyen (project-manager)
  },
  {
    title: "Customer Portal Upgrade",
    description: "Enhance customer self-service portal with new features",
    deadline: new Date('2025-08-15'),
    createdBy: new mongoose.Types.ObjectId("67f28105d9865d7cb79f2203") // Alice Johnson (admin)
  },
  {
    title: "DevOps Pipeline Optimization",
    description: "Improve CI/CD pipeline for faster deployments",
    deadline: new Date('2025-05-25'),
    createdBy: new mongoose.Types.ObjectId("67f28105d9865d7cb79f2204") // Bob Smith (project-manager)
  },
  {
    title: "Accessibility Compliance",
    description: "Bring all frontend components to WCAG 2.1 AA standards",
    deadline: new Date('2025-07-05'),
    createdBy: new mongoose.Types.ObjectId("67f28105d9865d7cb79f2209") // George Martin (admin)
  },
  {
    title: "Database Optimization",
    description: "Performance tuning and query optimization for production database",
    deadline: new Date('2025-06-30'),
    createdBy: new mongoose.Types.ObjectId("67f28105d9865d7cb79f220b") // Ian Chen (project-manager)
  },
  {
    title: "Documentation Overhaul",
    description: "Complete rewrite of all technical documentation and API references",
    deadline: new Date('2025-05-20'),
    createdBy: new mongoose.Types.ObjectId("67f28105d9865d7cb79f2207") // Evan Nguyen (project-manager)
  }
];

// Database connection and seeding function
async function seedProjects() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB');

    // Insert new projects
    const createdProjects = await Project.insertMany(projects);
    console.log(`Successfully seeded ${createdProjects.length} projects`);

    // Display inserted projects
    console.log('\nInserted projects:');
    for (const project of createdProjects) {
      const creator = await User.findById(project.createdBy);
      console.log(`- "${project.title}" (Deadline: ${project.deadline.toDateString()})`);
      console.log(`  Created by: ${creator.name} (${creator.role})`);
      console.log(`  Description: ${project.description}\n`);
    }
  } catch (error) {
    console.error('Error seeding projects:', error);
  } finally {
    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run the seeding function
seedProjects();