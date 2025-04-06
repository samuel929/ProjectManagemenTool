import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
    _id: string;
    name: string;
    email: string;
    password?: string;
    lastLogin?: string;
    isVerified: boolean;
    role: 'developer' | 'project-manager' | 'admin';
    resetPasswordToken?: string;
    resetPasswordExpiresAt?: string;
    verificationToken?: string;
    verificationTokenExpiresAt?: string;
    createdAt?: string;
    updatedAt?: string;
    __v?: number;
}

export interface Project {
    _id: string;
    title: string;
    description: string;
    deadline: string;
    createdBy: User;
    createdAt?: string;
    updatedAt?: string;
    __v?: number;
}

export interface Task {
    _id: string;
    title: string;
    description: string;
    status: 'To Do' | 'In Progress' | 'Done';
    assignee: User;
    project: Project;
    createdAt?: string;
    updatedAt?: string;
    __v?: number;
}

interface Store {
    user: User | null;
    projects: Project[];
    tasks: Task[];

    setUser: (user: User | null) => void;
    setProjects: (projects: Project[]) => void;
    setTasks: (tasks: Task[]) => void;
    addProject: (project: Project) => void;
    addTask: (task: Task) => void;
    updateTaskStatus: (taskId: string, status: 'To Do' | 'In Progress' | 'Done') => void;
}

const useStore = create<Store>()(
    persist(
        (set) => ({
            user: null,
            projects: [],
            tasks: [],

            setUser: (user) => set({ user }),
            setProjects: (projects) => set({ projects }),
            setTasks: (tasks) => set({ tasks }),

            addProject: (project) => set((state) => ({
                projects: [...state.projects, project]
            })),

            addTask: (task) => set((state) => ({
                tasks: [...state.tasks, task]
            })),

            updateTaskStatus: (taskId, status) =>
                set((state) => ({
                    tasks: state.tasks.map(task =>
                        task._id === taskId ? { ...task, status } : task
                    )
                })),
        }),
        {
            name: 'user-storage',
            partialize: (state) => ({
                user: state.user,
            }),
        }
    )
);

export default useStore;



