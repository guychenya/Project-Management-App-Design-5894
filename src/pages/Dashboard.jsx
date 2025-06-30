import React from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../components/common/SafeIcon';
import { useProject } from '../context/ProjectContext';
import ProjectCard from '../components/projects/ProjectCard';
import TaskCard from '../components/tasks/TaskCard';
import StatsCard from '../components/dashboard/StatsCard';
import ActivityFeed from '../components/dashboard/ActivityFeed';
import TeamWorkload from '../components/dashboard/TeamWorkload';

const { FiFolderPlus, FiCheckSquare, FiUsers, FiTrendingUp, FiClock, FiAlertTriangle } = FiIcons;

const Dashboard = () => {
  const { projects, tasks, teamMembers, loading } = useProject();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const activeProjects = projects.filter(p => p.status === 'in-progress');
  const completedTasks = tasks.filter(t => t.status === 'completed');
  const overdueTasks = tasks.filter(t => {
    const endDate = new Date(t.endDate);
    return endDate < new Date() && t.status !== 'completed';
  });
  const upcomingTasks = tasks.filter(t => {
    const startDate = new Date(t.startDate);
    const today = new Date();
    const threeDaysFromNow = new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000);
    return startDate >= today && startDate <= threeDaysFromNow && t.status === 'pending';
  });

  const stats = [
    {
      title: 'Active Projects',
      value: activeProjects.length,
      icon: FiFolderPlus,
      color: 'bg-blue-500',
      change: '+12%',
      changeType: 'positive'
    },
    {
      title: 'Completed Tasks',
      value: completedTasks.length,
      icon: FiCheckSquare,
      color: 'bg-green-500',
      change: '+8%',
      changeType: 'positive'
    },
    {
      title: 'Team Members',
      value: teamMembers.length,
      icon: FiUsers,
      color: 'bg-purple-500',
      change: '0%',
      changeType: 'neutral'
    },
    {
      title: 'Overdue Tasks',
      value: overdueTasks.length,
      icon: FiAlertTriangle,
      color: 'bg-red-500',
      change: '-5%',
      changeType: 'negative'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Welcome back! Here's what's happening with your projects.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Last updated: {new Date().toLocaleTimeString()}
          </span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatsCard key={stat.title} {...stat} index={index} />
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Projects */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Active Projects
              </h2>
              <SafeIcon icon={FiTrendingUp} className="w-5 h-5 text-primary-600" />
            </div>
            <div className="space-y-4">
              {activeProjects.slice(0, 3).map(project => (
                <ProjectCard key={project.id} project={project} compact />
              ))}
              {activeProjects.length === 0 && (
                <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                  No active projects at the moment.
                </p>
              )}
            </div>
          </div>

          {/* Recent Tasks */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Upcoming Tasks
              </h2>
              <SafeIcon icon={FiClock} className="w-5 h-5 text-primary-600" />
            </div>
            <div className="space-y-3">
              {upcomingTasks.slice(0, 5).map(task => (
                <TaskCard key={task.id} task={task} compact />
              ))}
              {upcomingTasks.length === 0 && (
                <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                  No upcoming tasks scheduled.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Team Workload */}
          <TeamWorkload teamMembers={teamMembers} tasks={tasks} />
          
          {/* Activity Feed */}
          <ActivityFeed />
        </div>
      </div>
    </motion.div>
  );
};

export default Dashboard;