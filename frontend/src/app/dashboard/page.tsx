/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
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
  CalendarDays,
  CheckCircle2,
  Clock,
  UsersIcon,
  FolderKanban,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import useStore from "@/store/useStore";
import { getAllTasks, getProjects, getUsers } from "@/util/api";
import { toast } from "react-toastify";
import { getStatusColor } from "@/util/util";
import { Project, Task, User } from "@/types/types";

export default function DashboardPage() {
  const { user } = useStore();
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const [projectsData, usersData, tasksData] = await Promise.all([
          getProjects(),
          getUsers(),
          getAllTasks(),
        ]);

        setProjects(projectsData.data);
        setUsers(usersData.data.users);
        setTasks(tasksData);
      } catch (error) {
        toast("Failed to load data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  if (!user) {
    return <div>Please log in to view the dashboard</div>;
  }

  if (loading) {
    return <div>Loading dashboard...</div>;
  }
  // // Filter projects based on user role
  const userProjects =
    user.role === "admin"
      ? projects
      : projects.filter((project) => project.createdBy._id === user._id);

  // // Filter tasks assigned to the user
  const userTasks = tasks.filter((task) => task.assignee._id === user._id);

  // Calculate project statistics
  const completedProjects = userProjects.filter((project) => {
    const projectTasks = tasks.filter(
      (task) => task.project._id === project._id
    );
    return projectTasks.every((task) => task.status === "Done");
  }).length;

  const inProgressProjects = userProjects.filter((project) => {
    const projectTasks = tasks.filter(
      (task) => task.project._id === project._id
    );
    return (
      projectTasks.some((task) => task.status === "In Progress") &&
      !projectTasks.every((task) => task.status === "Done")
    );
  }).length;

  const upcomingDeadlines = userProjects
    .filter((project) => {
      const deadline = new Date(project.deadline);
      const now = new Date();
      const diffTime = deadline.getTime() - now.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays <= 7 && diffDays >= 0;
    })
    .sort(
      (a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
    );

  // // Calculate task statistics
  const completedTasks = userTasks.filter(
    (task) => task.status === "Done"
  ).length;
  const inProgressTasks = userTasks.filter(
    (task) => task.status === "In Progress"
  ).length;
  const todoTasks = userTasks.filter((task) => task.status === "To Do").length;

  return (
    <div className='space-y-6'>
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              Total Projects
            </CardTitle>
            <FolderKanban className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{userProjects.length}</div>
            <p className='text-xs text-muted-foreground'>
              {completedProjects} completed, {inProgressProjects} in progress
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>My Tasks</CardTitle>
            <CheckCircle2 className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{userTasks.length}</div>
            <p className='text-xs text-muted-foreground'>
              {completedTasks} completed, {todoTasks} to do, {inProgressTasks}{" "}
              in progress
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Team Members</CardTitle>
            <UsersIcon className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{users.length}</div>
            <p className='text-xs text-muted-foreground'>
              {users.filter((u) => u.role === "admin").length} admins,{" "}
              {users.filter((u) => u.role === "project-manager").length}{" "}
              managers
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              Upcoming Deadlines
            </CardTitle>
            <Clock className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{upcomingDeadlines.length}</div>
            <p className='text-xs text-muted-foreground'>
              Projects due within the next 7 days
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue='projects'>
        <TabsList>
          <TabsTrigger value='projects'>Recent Projects</TabsTrigger>
          <TabsTrigger value='tasks'>My Tasks</TabsTrigger>
          <TabsTrigger value='deadlines'>Upcoming Deadlines</TabsTrigger>
        </TabsList>
        <TabsContent value='projects' className='space-y-4'>
          <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
            {userProjects.slice(0, 6).map((project) => {
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
                  <CardHeader className='p-4'>
                    <CardTitle className='line-clamp-1'>
                      {project.title}
                    </CardTitle>
                    <CardDescription className='flex items-center gap-2'>
                      <CalendarDays className='h-4 w-4' />
                      <span>
                        Due {new Date(project.deadline).toLocaleDateString()}
                      </span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent className='p-4 pt-0'>
                    <div className='mb-2 line-clamp-2 text-sm text-muted-foreground'>
                      {project.description}
                    </div>
                    <div className='mb-4 space-y-2'>
                      <div className='flex justify-between text-sm'>
                        <span>Progress</span>
                        <span>{progress}%</span>
                      </div>
                      <Progress value={progress} className='h-2' />
                    </div>
                    <div className='flex items-center justify-between'>
                      <Button asChild size='sm' variant='outline'>
                        <Link href={`/dashboard/projects/${project._id}`}>
                          View
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
          {userProjects.length > 6 && (
            <div className='flex justify-center'>
              <Button asChild variant='outline'>
                <Link href='/dashboard/projects'>View All Projects</Link>
              </Button>
            </div>
          )}
        </TabsContent>
        <TabsContent value='tasks' className='space-y-4'>
          <div className='rounded-md border'>
            <div className='grid grid-cols-[1fr_150px_150px_100px] gap-4 p-4 font-medium border-b'>
              <div>Task</div>
              <div>Project</div>
              <div>Due Date</div>
              <div>Status</div>
            </div>
            {userTasks.slice(0, 10).map((task) => {
              const project = projects.find((p) => p._id === task.project._id);
              return (
                <div
                  key={task._id}
                  className='grid grid-cols-[1fr_150px_150px_100px] gap-4 p-4 items-center border-b last:border-0'
                >
                  <div>
                    <div className='font-medium'>{task.title}</div>
                    <div className='text-sm text-muted-foreground line-clamp-1'>
                      {task.description}
                    </div>
                  </div>
                  <div className='text-sm'>{project?.title}</div>
                  <div className='text-sm'>
                    {new Date(project?.deadline as any).toLocaleDateString()}
                  </div>
                  <div>
                    <Badge
                      className={`${getStatusColor(task.status)} text-white`}
                    >
                      {task.status}
                    </Badge>
                  </div>
                </div>
              );
            })}
          </div>
          {userTasks.length > 10 && (
            <div className='flex justify-center'>
              <Button asChild variant='outline'>
                <Link href='/dashboard/tasks'>View All Tasks</Link>
              </Button>
            </div>
          )}
        </TabsContent>
        <TabsContent value='deadlines' className='space-y-4'>
          <div className='rounded-md border'>
            <div className='grid grid-cols-[1fr_150px_150px] gap-4 p-4 font-medium border-b'>
              <div>Project</div>
              <div>Deadline</div>
              <div>Status</div>
            </div>
            {upcomingDeadlines.map((project) => {
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
                <div
                  key={project._id}
                  className='grid grid-cols-[1fr_150px_150px] gap-4 p-4 items-center border-b last:border-0'
                >
                  <div>
                    <div className='font-medium'>{project.title}</div>
                    <div className='text-sm text-muted-foreground line-clamp-1'>
                      {project.description}
                    </div>
                  </div>
                  <div className='text-sm'>
                    {new Date(project.deadline).toLocaleDateString()}
                  </div>
                  <div>
                    <Progress value={progress} className='h-2' />
                    <div className='mt-1 text-xs text-right'>
                      {progress}% Complete
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
