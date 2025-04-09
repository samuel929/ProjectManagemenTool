import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Store } from '../types/types';


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



