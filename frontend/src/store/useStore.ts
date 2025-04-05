import { create } from 'zustand';

// Define types for user, project, and task
export interface User {
    id: string;
    name: string;
    email: string;
}

export interface Project {
    _id: string;
    title: string;
    description: string;
    deadline: string;
}

export interface Task {
    _id: string;
    title: string;
    description: string;
    status: 'To Do' | 'In Progress' | 'Done';
    assignee: string;
}

// Define the Zustand store type
interface Store {
    user: User | null;
    projects: Project[];
    tasks: Task[];

    // Actions to update state
    setUser: (user: User | null) => void;
    setProjects: (projects: Project[]) => void;
    setTasks: (tasks: Task[]) => void;
}

// Create the store with types
const useStore = create<Store>((set) => ({
    user: null,
    projects: [],
    tasks: [],

    setUser: (user) => set({ user }),
    setProjects: (projects) => set({ projects }),
    setTasks: (tasks) => set({ tasks }),
}));

export default useStore;
