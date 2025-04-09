import { Project } from '@/types/types';
import axios, { AxiosInstance } from 'axios';


const api: AxiosInstance = axios.create({
    baseURL: `${process.env.NEXT_PUBLIC_API_URL}/api`,
    timeout: 10000, // Timeout after 10 seconds
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);


//auth routes
export const signup = async (email: string, password: string, name: string, role: string) => {
    return api.post('/auth/signup', { email, password, name, role });
};

export const verifyEmail = async (code: string) => {
    return api.post('/auth/verify-email', { code });
}
export const login = async (email: string, password: string) => {
    return api.post('/auth/login', { email, password });
};

export const logout = async () => {
    return api.post('/auth/logout');
};

export const forgotPassword = async (email: string) => {
    return api.post('/auth/forgot-password', { email });
};

export const resetPassword = async (token: string, password: string) => {
    return api.post(`/auth/reset-password/${token}`, { password });
};

export const checkAuth = async () => {
    return api.get('/auth/check-auth');
}

export const getUsers = async () => {
    return api.get('/auth/get-users');

}


//projects
export const getProjects = async () => {
    return api.get('/projects/');
}

export const createProject = async (title: string, description: string, deadline: string, userId: string) => {
    return api.post('/projects/', { title, description, deadline, userId });
};

export const deleteProject = async (projectId: string) => {
    return api.delete(`/projects/${projectId}`);
}

export const getTasks = async (projectId: string) => {
    return api.get(`/tasks/project/${projectId}`);
}

export const getAllTasks = async () => {
    const projectsData = await getProjects();
    const projectIds = projectsData.data.map((p: Project) => p._id);

    const taskPromises = projectIds.map((id: string) => getTasks(id));
    const tasksData = await Promise.all(taskPromises);

    return tasksData.flatMap((res) => res.data);
};


//get Tasks
export const deleteTask = async (taskId: string) => {
    return api.delete(`/tasks/${taskId}`);
}

export const createTask = async (title: string, description: string, status: string, assignee: string, project: string) => {
    return api.post('/tasks/', { title, description, status, assignee, project });
};

export default api;
