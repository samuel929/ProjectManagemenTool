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

export interface Store {
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


export type UserLocalStorage = {
    _id: string;
    email: string;
    name: string;
    isVerified: boolean;
    role: string;
    lastLogin: string;
    __v: number;
    createdAt: string;
    updatedAt: string;
};

export type AppState = {
    state: {
        user: UserLocalStorage;
    };
    version: number;
};

