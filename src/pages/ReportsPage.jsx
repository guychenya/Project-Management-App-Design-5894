import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../components/common/SafeIcon';
import { useProject } from '../context/ProjectContext';

const { FiBarChart3, FiTrendingUp, FiDownload, FiCalendar, FiFilter } = FiIcons;

const ReportsPage = () => {
  const { projects, tasks, teamMembers, loading } = useProject();
  const [dateRange, setDateRange] = useState('30');
  const [reportType, setReportType] = useState('overview');

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  // Calculate metrics
  const completedTasks = tasks.filter(task => task.status === 'completed');
  const overdueTasks = tasks.filter(task => {
    const endDate = new Date(task.endDate);
    return endDate < new Date() && task.status !== 'completed';
  });

  const projectStats = projects.map(project => {
    const projectTasks = tasks.filter(task => task.projectId === project.id);
    const completedProjectTasks = projectTasks.filter(task => task.status === 'completed');
    
    return {
      ...project,
      taskCount: projectTasks.length,
      completedTaskCount: completedProjectTasks.length,
      completionRate: projectTasks.length > 0 ? (completedProjectTasks.length / projectTasks.length) * 100 : 0
    };
  });

  const teamStats = teamMembers.map(member => {
    const memberTasks = tasks.filter(task => task.assignees.includes(member.id));
    const completedMemberTasks = memberTasks.filter(task => task.status === 'completed');
    
    return {
      ...member,
      taskCount: memberTasks.length,
      completedTaskCount: completedMemberTasks.length,
      completionRate: memberTasks.length > 0 ? (completedMemberTasks.length / memberTasks.length) * 100 : 0
    };
  });

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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Reports</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Analyze project performance and team productivity.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
            <option value="365">Last year</option>
          </select>
          <button className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-200">
            <SafeIcon icon={FiDownload} className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Projects</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
                {projects.length}
              </p>
              <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                {projects.filter(p => p.status === 'completed').length} completed
              </p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <SafeIcon icon={FiBarChart3} className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Tasks</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
                {tasks.length}
              </p>
              <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                {completedTasks.length} completed
              </p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
              <SafeIcon icon={FiTrendingUp} className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Completion Rate</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
                {tasks.length > 0 ? Math.round((completedTasks.length / tasks.length) * 100) : 0}%
              </p>
              <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">
                Above average
              </p>
            </div>
            <div className="p-3 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
              <SafeIcon icon={FiBarChart3} className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Overdue Tasks</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
                {overdueTasks.length}
              </p>
              <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                Needs attention
              </p>
            </div>
            <div className="p-3 bg-red-100 dark:bg-red-900 rounded-lg">
              <SafeIcon icon={FiCalendar} className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Report Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'projects', label: 'Projects' },
              { id: 'team', label: 'Team Performance' },
              { id: 'timeline', label: 'Timeline' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setReportType(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                  reportType === tab.id
                    ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {reportType === 'overview' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Project Overview
              </h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900 dark:text-white">Project Status Distribution</h4>
                  <div className="space-y-3">
                    {['planning', 'in-progress', 'completed', 'on-hold'].map(status => {
                      const count = projects.filter(p => p.status === status).length;
                      const percentage = projects.length > 0 ? (count / projects.length) * 100 : 0;
                      
                      return (
                        <div key={status} className="flex items-center justify-between">
                          <span className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                            {status.replace('-', ' ')}
                          </span>
                          <div className="flex items-center space-x-2">
                            <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                              <div
                                className="bg-primary-600 h-2 rounded-full"
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                            <span className="text-sm font-medium text-gray-900 dark:text-white w-8">
                              {count}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900 dark:text-white">Task Status Distribution</h4>
                  <div className="space-y-3">
                    {['pending', 'in-progress', 'completed', 'on-hold'].map(status => {
                      const count = tasks.filter(t => t.status === status).length;
                      const percentage = tasks.length > 0 ? (count / tasks.length) * 100 : 0;
                      
                      return (
                        <div key={status} className="flex items-center justify-between">
                          <span className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                            {status.replace('-', ' ')}
                          </span>
                          <div className="flex items-center space-x-2">
                            <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                              <div
                                className="bg-green-600 h-2 rounded-full"
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                            <span className="text-sm font-medium text-gray-900 dark:text-white w-8">
                              {count}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {reportType === 'projects' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Project Performance
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Project</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Status</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Progress</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Tasks</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Budget</th>
                    </tr>
                  </thead>
                  <tbody>
                    {projectStats.map(project => (
                      <tr key={project.id} className="border-b border-gray-100 dark:border-gray-800">
                        <td className="py-3 px-4">
                          <div className="font-medium text-gray-900 dark:text-white">
                            {project.name}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="capitalize text-gray-600 dark:text-gray-400">
                            {project.status.replace('-', ' ')}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-2">
                            <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                              <div
                                className="bg-primary-600 h-2 rounded-full"
                                style={{ width: `${project.progress}%` }}
                              />
                            </div>
                            <span className="text-gray-900 dark:text-white">{project.progress}%</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-gray-900 dark:text-white">
                            {project.completedTaskCount}/{project.taskCount}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-gray-900 dark:text-white">
                            ${project.spent.toLocaleString()}/${project.budget.toLocaleString()}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {reportType === 'team' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Team Performance
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {teamStats.map(member => (
                  <div
                    key={member.id}
                    className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4"
                  >
                    <div className="flex items-center space-x-3 mb-4">
                      <img
                        src={member.avatar}
                        alt={member.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          {member.name}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {member.role}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Tasks Completed</span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {member.completedTaskCount}/{member.taskCount}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Success Rate</span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {Math.round(member.completionRate)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                        <div
                          className="bg-green-600 h-2 rounded-full"
                          style={{ width: `${member.completionRate}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {reportType === 'timeline' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Project Timeline
              </h3>
              <div className="text-center py-12">
                <SafeIcon icon={FiBarChart3} className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Timeline View Coming Soon
                </h4>
                <p className="text-gray-500 dark:text-gray-400">
                  Interactive timeline visualization will be available in the next update.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ReportsPage;