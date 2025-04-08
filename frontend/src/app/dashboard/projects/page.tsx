/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Search, Trash2 } from "lucide-react";
import { deleteProject, createProject, getAllTasks } from "@/util/api";
import { getProjects } from "@/util/api";
import { toast } from "react-toastify";
import { AppState, Project, Task } from "@/types/types";

export default function ProjectsPage() {
  const [user, setUser] = useState<AppState>();
  const [mounted, setMounted] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [newProject, setNewProject] = useState({
    title: "",
    description: "",
    deadline: "",
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    const storedUser = localStorage.getItem("user-storage");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [projectsData, tasksData] = await Promise.all([
          getProjects(),
          getAllTasks(),
        ]);

        setProjects(projectsData.data);
        setTasks(tasksData);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast("Failed to load data. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (!mounted || !user) return null;

  if (isLoading) {
    return (
      <div className='flex justify-center items-center h-64'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mx-auto'></div>
          <p className='mt-2 text-sm text-muted-foreground'>
            Loading projects...
          </p>
        </div>
      </div>
    );
  }

  const filteredProjects = projects.filter((project) => {
    if (user.state.user.role.toLowerCase() === "admin") return true;
    return project.createdBy && project.createdBy?._id === user.state.user._id;
  });

  const activeProjects = filteredProjects.filter((project) => {
    const projectTasks = tasks.filter(
      (task) => task.project._id === project._id
    );
    return !projectTasks.every((task) => task.status === "Done");
  });

  const completedProjects = filteredProjects.filter((project) => {
    const projectTasks = tasks.filter(
      (task) => task.project._id === project._id
    );
    return (
      projectTasks.length > 0 &&
      projectTasks.every((task) => task.status === "Done")
    );
  });

  const handleCreateProject = async () => {
    try {
      const createdProject = await createProject(
        newProject.title,
        newProject.description,
        newProject.deadline,
        user.state.user._id
      );

      setProjects([...projects, createdProject.data]);
      setNewProject({ title: "", description: "", deadline: "" });
      setIsDialogOpen(false);
      toast("Your new project has been created successfully");
    } catch (error) {
      console.error("Error creating project:", error);
      toast("Failed to create project. Please try again.");
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    try {
      await deleteProject(projectId);
      setProjects(projects.filter((project) => project._id !== projectId));
      toast("The project has been deleted successfully");
    } catch (error) {
      console.error("Error deleting project:", error);
      toast("Failed to delete project. Please try again.");
    }
  };

  return (
    <div className='space-y-6'>
      <div className='flex flex-col sm:flex-row items-center justify-between gap-4'>
        <div className='relative w-full sm:w-96'>
          <Search className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
          <Input
            placeholder='Search projects...'
            className='pl-8'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className='mr-2 h-4 w-4' /> New Project
            </Button>
          </DialogTrigger>
          <DialogContent className='sm:max-w-[525px]'>
            <DialogHeader>
              <DialogTitle>Create New Project</DialogTitle>
              <DialogDescription>
                Fill in the details to create a new project.
              </DialogDescription>
            </DialogHeader>
            <div className='grid gap-4 py-4'>
              <div className='grid gap-2'>
                <Label htmlFor='title'>Project Title</Label>
                <Input
                  id='title'
                  value={newProject.title}
                  onChange={(e) =>
                    setNewProject({ ...newProject, title: e.target.value })
                  }
                  placeholder='Enter project title'
                />
              </div>
              <div className='grid gap-2'>
                <Label htmlFor='description'>Description</Label>
                <Textarea
                  id='description'
                  value={newProject.description}
                  onChange={(e) =>
                    setNewProject({
                      ...newProject,
                      description: e.target.value,
                    })
                  }
                  placeholder='Enter project description'
                />
              </div>
              <div className='grid gap-2'>
                <Label htmlFor='deadline'>Deadline</Label>
                <Input
                  id='deadline'
                  type='date'
                  value={newProject.deadline}
                  onChange={(e) =>
                    setNewProject({ ...newProject, deadline: e.target.value })
                  }
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant='outline' onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleCreateProject}
                disabled={!newProject.title || !newProject.deadline}
              >
                Create Project
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue='active'>
        <TabsList>
          <TabsTrigger value='active'>
            Active Projects ({activeProjects.length})
          </TabsTrigger>
          <TabsTrigger value='completed'>
            Completed Projects ({completedProjects.length})
          </TabsTrigger>
        </TabsList>
        <TabsContent value='active' className='space-y-4'>
          <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
            {activeProjects.map((project) => {
              const projectTasks = tasks.filter(
                (task) => task.project._id === project._id
              );
              const completedTasksCount = projectTasks.filter(
                (task) => task.status === "Done"
              ).length;
              const progress =
                projectTasks.length > 0
                  ? Math.round(
                      (completedTasksCount / projectTasks.length) * 100
                    )
                  : 0;

              return (
                <Card key={project._id} className='overflow-hidden'>
                  <CardContent className='p-6'>
                    <div className='flex items-start justify-between'>
                      <div>
                        <h3 className='font-semibold text-lg line-clamp-1'>
                          {project.title}
                        </h3>
                        <p className='text-sm text-muted-foreground mt-1'>
                          {project.description}
                        </p>
                      </div>
                      <Button
                        size='icon'
                        variant='ghost'
                        onClick={() => handleDeleteProject(project._id)}
                      >
                        <Trash2 className='h-4 w-4 text-red-500' />
                      </Button>
                    </div>
                    <div className='mt-4'>
                      <Progress value={progress} />
                      <p className='text-xs text-muted-foreground mt-1'>
                        {progress}% complete
                      </p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>
        <TabsContent value='completed' className='space-y-4'>
          <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
            {completedProjects.map((project) => (
              <Card key={project._id} className='overflow-hidden'>
                <CardContent className='p-6'>
                  <div className='flex items-start justify-between'>
                    <div>
                      <h3 className='font-semibold text-lg line-clamp-1'>
                        {project.title}
                      </h3>
                      <p className='text-sm text-muted-foreground mt-1'>
                        {project.description}
                      </p>
                    </div>
                    <Button
                      size='icon'
                      variant='ghost'
                      onClick={() => handleDeleteProject(project._id)}
                    >
                      <Trash2 className='h-4 w-4 text-red-500' />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
