import mongoose from 'mongoose';
import { Task } from '../models/task.model.js';
import { Project } from '../models/projects.model.js';
import { User } from '../models/user.model.js';

// Sample tasks data
const tasks = [
  // E-Commerce Platform Redesign (projectId: 67f2836d9df786b112dc9c23)
  {
    title: "Design new product page layout",
    description: "Create wireframes and mockups for the redesigned product page",
    status: "In Progress",
    assignee: new mongoose.Types.ObjectId("67f28105d9865d7cb79f2206"), // Diana Prince
    project: new mongoose.Types.ObjectId("67f2836d9df786b112dc9c23")
  },
  {
    title: "Implement shopping cart improvements",
    description: "Add persistent cart functionality and guest checkout options",
    status: "To Do",
    assignee: new mongoose.Types.ObjectId("67f28105d9865d7cb79f2205"), // Charlie Brown
    project: new mongoose.Types.ObjectId("67f2836d9df786b112dc9c23")
  },
  {
    title: "Optimize mobile checkout flow",
    description: "Reduce steps in mobile checkout process and improve form fields",
    status: "To Do",
    assignee: new mongoose.Types.ObjectId("67f28105d9865d7cb79f2208"), // Fiona Garcia
    project: new mongoose.Types.ObjectId("67f2836d9df786b112dc9c23")
  },

  // Mobile App Development (projectId: 67f2836d9df786b112dc9c24)
  {
    title: "Set up React Native project",
    description: "Initialize the React Native project with required dependencies",
    status: "Done",
    assignee: new mongoose.Types.ObjectId("67f28105d9865d7cb79f2205"), // Charlie Brown
    project: new mongoose.Types.ObjectId("67f2836d9df786b112dc9c24")
  },
  {
    title: "Design app icon and splash screen",
    description: "Create visually appealing app icon and loading screen",
    status: "In Progress",
    assignee: new mongoose.Types.ObjectId("67f28105d9865d7cb79f2206"), // Diana Prince
    project: new mongoose.Types.ObjectId("67f2836d9df786b112dc9c24")
  },
  {
    title: "Implement user authentication",
    description: "Add login/signup functionality with JWT tokens",
    status: "To Do",
    assignee: new mongoose.Types.ObjectId("67f28105d9865d7cb79f220c"), // Julia Roberts
    project: new mongoose.Types.ObjectId("67f2836d9df786b112dc9c24")
  },

  // API Microservices Migration (projectId: 67f2836d9df786b112dc9c25)
  {
    title: "Identify monolithic endpoints",
    description: "Document all existing API endpoints for migration planning",
    status: "In Progress",
    assignee: new mongoose.Types.ObjectId("67f28105d9865d7cb79f220a"), // Hannah Wilson
    project: new mongoose.Types.ObjectId("67f2836d9df786b112dc9c25")
  },
  {
    title: "Set up Kubernetes cluster",
    description: "Configure Kubernetes for microservices deployment",
    status: "To Do",
    assignee: new mongoose.Types.ObjectId("67f28105d9865d7cb79f2207"), // Evan Nguyen
    project: new mongoose.Types.ObjectId("67f2836d9df786b112dc9c25")
  },
  {
    title: "Create user service",
    description: "Extract user management into separate microservice",
    status: "To Do",
    assignee: new mongoose.Types.ObjectId("67f28105d9865d7cb79f220c"), // Julia Roberts
    project: new mongoose.Types.ObjectId("67f2836d9df786b112dc9c25")
  },

  // Dashboard Analytics Feature (projectId: 67f2836d9df786b112dc9c26)
  {
    title: "Design analytics dashboard UI",
    description: "Create mockups for the new analytics dashboard",
    status: "Done",
    assignee: new mongoose.Types.ObjectId("67f28105d9865d7cb79f2206"), // Diana Prince
    project: new mongoose.Types.ObjectId("67f2836d9df786b112dc9c26")
  },
  {
    title: "Implement data aggregation API",
    description: "Create backend endpoints for analytics data",
    status: "In Progress",
    assignee: new mongoose.Types.ObjectId("67f28105d9865d7cb79f2205"), // Charlie Brown
    project: new mongoose.Types.ObjectId("67f2836d9df786b112dc9c26")
  },
  {
    title: "Add chart visualization library",
    description: "Integrate Chart.js for data visualization",
    status: "To Do",
    assignee: new mongoose.Types.ObjectId("67f28105d9865d7cb79f2208"), // Fiona Garcia
    project: new mongoose.Types.ObjectId("67f2836d9df786b112dc9c26")
  },

  // Automated Testing Suite (projectId: 67f2836d9df786b112dc9c27)
  {
    title: "Write unit tests for auth module",
    description: "Create comprehensive tests for authentication functions",
    status: "In Progress",
    assignee: new mongoose.Types.ObjectId("67f28105d9865d7cb79f220a"), // Hannah Wilson
    project: new mongoose.Types.ObjectId("67f2836d9df786b112dc9c27")
  },
  {
    title: "Configure Jest testing environment",
    description: "Set up Jest with required plugins and configurations",
    status: "Done",
    assignee: new mongoose.Types.ObjectId("67f28105d9865d7cb79f220c"), // Julia Roberts
    project: new mongoose.Types.ObjectId("67f2836d9df786b112dc9c27")
  },
  {
    title: "Create integration test suite",
    description: "Develop end-to-end tests for core user flows",
    status: "To Do",
    assignee: new mongoose.Types.ObjectId("67f28105d9865d7cb79f2208"), // Fiona Garcia
    project: new mongoose.Types.ObjectId("67f2836d9df786b112dc9c27")
  }
];

// Database connection and seeding function
async function seedTasks() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB');

    // Insert new tasks
    const createdTasks = await Task.insertMany(tasks);
    console.log(`Successfully seeded ${createdTasks.length} tasks`);

    // Display inserted tasks with details
    console.log('\nTask assignments:');
    for (const task of createdTasks) {
      const assignee = await mongoose.model('User').findById(task.assignee);
      const project = await mongoose.model('Project').findById(task.project);
      console.log(`- "${task.title}" (Status: ${task.status})`);
      console.log(`  Project: ${project.title}`);
      console.log(`  Assignee: ${assignee.name} (${assignee.role})`);
      console.log(`  Description: ${task.description}\n`);
    }
  } catch (error) {
    console.error('Error seeding tasks:', error);
  } finally {
    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run the seeding function
seedTasks();