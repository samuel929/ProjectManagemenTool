/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Plus, Trash2, UsersIcon } from "lucide-react";
import { toast } from "react-toastify";
import {
  createTask,
  deleteTask,
  getAllTasks,
  getProjects,
  getUsers,
} from "@/util/api";
import { Project, Task, User } from "@/store/useStore";

export default function ProjectDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [mounted, setMounted] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    status: "To Do" as const,
    dueDate: "",
    assigneeId: "",
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    const storedUser = localStorage.getItem("user-storage");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      if (parsedUser.state && parsedUser.state.user) {
        setUser(parsedUser.state.user);
      }
    }

    const fetchData = async () => {
      try {
        const resolvedParams = await params;
        const [projectsData, usersData, tasksData] = await Promise.all([
          getProjects(),
          getUsers(),
          getAllTasks(),
        ]);

        // Find the specific project by ID
        const foundProject = projectsData.data.find(
          (p: Project) => p._id === resolvedParams.id
        );
        if (foundProject) {
          setProject(foundProject);
        } else {
          toast("Project not found");
          router.push("/projects");
        }

        setUsers(usersData.data.users);
        // Filter tasks for this project
        const projectTasks = tasksData.filter(
          (t: Task) => t.project._id === resolvedParams.id
        );
        setTasks(projectTasks);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast("Failed to load data. Please try again later.");
      }
    };

    fetchData();
  }, [params, router]);

  if (!mounted || !user || !project) return null;
  const projectManager = users.find((u) => u._id === project.createdBy._id);

  const completedTasksCount = tasks.filter(
    (task) => task.status === "Done"
  ).length;
  const progress =
    tasks.length > 0
      ? Math.round((completedTasksCount / tasks.length) * 100)
      : 0;

  const todoTasks = tasks.filter((task) => task.status === "To Do");
  const inProgressTasks = tasks.filter((task) => task.status === "In Progress");
  const doneTasks = tasks.filter((task) => task.status === "Done");

  const isProjectCompleted =
    tasks.length > 0 && tasks.every((task) => task.status === "Done");
  const isDeadlineMet =
    isProjectCompleted && new Date(project.deadline) >= new Date();

  const handleCreateTask = async () => {
    try {
      const newTaskObj: any = {
        title: newTask.title,
        description: newTask.description,
        status: newTask.status,
        assignee: newTask.assigneeId,
        project: project._id,
      };

      await createTask(
        newTask.title,
        newTask.description,
        newTask.status,
        newTask.assigneeId,
        project._id
      );

      setTasks([...tasks, newTaskObj]);
      setNewTask({
        title: "",
        description: "",
        status: "To Do",
        dueDate: "",
        assigneeId: "",
      });
      setIsDialogOpen(false);
      toast.success("Your new task has been created successfully");
    } catch (error) {
      console.error("Error creating task:", error);
      toast.error("Failed to create task");
    }
  };

  const handleUpdateTaskStatus = (
    taskId: string,
    newStatus: "To Do" | "In Progress" | "Done"
  ) => {
    setTasks(
      tasks.map((task) =>
        task._id === taskId ? { ...task, status: newStatus } : task
      )
    );
    toast.success(`Task status changed to ${newStatus}`);
  };

  const handleDeleteTask = async (taskId: string) => {
    await deleteTask(taskId);
    setTasks(tasks.filter((task) => task._id !== taskId));
    toast.success("The task has been deleted successfully");
  };

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "To Do":
        return "bg-blue-500";
      case "In Progress":
        return "bg-yellow-500";
      case "Done":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  const getCompletionStatusColor = () =>
    isProjectCompleted
      ? isDeadlineMet
        ? "bg-green-500"
        : "bg-orange-500"
      : "bg-blue-500";

  const getCompletionStatusText = () =>
    isProjectCompleted
      ? isDeadlineMet
        ? "Completed on time"
        : "Completed after deadline"
      : "In progress";

  const renderTaskList = (taskList: Task[]) => {
    return taskList.map((task) => {
      const assignee = users.find((u) => u._id === task.assignee._id);
      return (
        <Card key={task._id}>
          <CardHeader>
            <div className='flex justify-between items-center'>
              <CardTitle className='text-lg'>{task.title}</CardTitle>
              <Badge className={`${getStatusColor(task.status)} text-white`}>
                {task.status}
              </Badge>
            </div>
            <CardDescription>{task.description}</CardDescription>
          </CardHeader>
          <CardContent className='space-y-2'>
            <div className='flex justify-between text-sm text-muted-foreground'>
              {/* <span className='flex items-center gap-2'>
                <Clock className='h-4 w-4' />
                Due {new Date(task.dueDate).toLocaleDateString()}
              </span> */}
              <span className='flex items-center gap-2'>
                <UsersIcon className='h-4 w-4' />
                {assignee?.name || "Unassigned"}
              </span>
            </div>
            <div className='flex gap-2'>
              {["To Do", "In Progress", "Done"].map((status) => (
                <Button
                  key={status}
                  variant={task.status === status ? "default" : "outline"}
                  size='sm'
                  onClick={() =>
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    handleUpdateTaskStatus(task._id, status as any)
                  }
                >
                  {status}
                </Button>
              ))}
              <Button
                variant='destructive'
                size='sm'
                onClick={() => handleDeleteTask(task._id)}
              >
                <Trash2 className='h-4 w-4' />
              </Button>
            </div>
          </CardContent>
        </Card>
      );
    });
  };

  return (
    <div className='space-y-4'>
      <div className='flex justify-between items-center'>
        <h1 className='text-2xl font-bold'>{project.title}</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className='h-4 w-4 mr-2' />
              New Task
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Task</DialogTitle>
              <DialogDescription>
                Fill out the form to create a new task for this project.
              </DialogDescription>
            </DialogHeader>
            <div className='space-y-4'>
              <div>
                <Label htmlFor='title'>Title</Label>
                <Input
                  id='title'
                  value={newTask.title}
                  onChange={(e) =>
                    setNewTask({ ...newTask, title: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor='description'>Description</Label>
                <Textarea
                  id='description'
                  value={newTask.description}
                  onChange={(e) =>
                    setNewTask({ ...newTask, description: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor='assignee'>Assignee</Label>
                <Select
                  value={newTask.assigneeId}
                  onValueChange={(value) =>
                    setNewTask({ ...newTask, assigneeId: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder='Select assignee' />
                  </SelectTrigger>
                  <SelectContent>
                    {users.map((user) => (
                      <SelectItem key={user._id} value={user._id}>
                        {user.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor='dueDate'>Due Date</Label>
                <Input
                  id='dueDate'
                  type='date'
                  value={newTask.dueDate}
                  onChange={(e) =>
                    setNewTask({ ...newTask, dueDate: e.target.value })
                  }
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleCreateTask}>Create Task</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className='flex items-center gap-4'>
        <Avatar className='h-12 w-12'>
          <AvatarFallback>
            {getInitials(projectManager?.name || "PM")}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className='font-medium'>Managed by {projectManager?.name}</p>
          <p className='text-sm text-muted-foreground'>{project.description}</p>
        </div>
      </div>

      <div className='space-y-2'>
        <div className='flex justify-between items-center'>
          <span className='text-sm font-medium'>
            {getCompletionStatusText()}
          </span>
          <span className='text-sm font-medium'>{progress}%</span>
        </div>
        <Progress value={progress} className='h-2' />
      </div>

      <div className='flex gap-2'>
        <Badge className={getCompletionStatusColor()}>
          {getCompletionStatusText()}
        </Badge>
        <Badge variant='outline'>
          <CalendarDays className='h-4 w-4 mr-2' />
          Deadline: {new Date(project.deadline).toLocaleDateString()}
        </Badge>
        <Badge variant='outline'>
          <UsersIcon className='h-4 w-4 mr-2' />3 Members
        </Badge>
      </div>

      <Tabs defaultValue='all'>
        <TabsList>
          <TabsTrigger value='all'>All Tasks ({tasks.length})</TabsTrigger>
          <TabsTrigger value='todo'>To Do ({todoTasks.length})</TabsTrigger>
          <TabsTrigger value='inprogress'>
            In Progress ({inProgressTasks.length})
          </TabsTrigger>
          <TabsTrigger value='done'>Done ({doneTasks.length})</TabsTrigger>
        </TabsList>
        <TabsContent value='all'>
          <div className='space-y-4'>{renderTaskList(tasks)}</div>
        </TabsContent>
        <TabsContent value='todo'>
          <div className='space-y-4'>{renderTaskList(todoTasks)}</div>
        </TabsContent>
        <TabsContent value='inprogress'>
          <div className='space-y-4'>{renderTaskList(inProgressTasks)}</div>
        </TabsContent>
        <TabsContent value='done'>
          <div className='space-y-4'>{renderTaskList(doneTasks)}</div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
