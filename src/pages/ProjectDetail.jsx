import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../components/common/SafeIcon';
import { useProject } from '../context/ProjectContext';
import TaskCard from '../components/tasks/TaskCard';
import GanttChart from '../components/gantt/GanttChart';
import { getStatusColor, getPriorityColor } from '../utils/mockData';

const { FiArrowLeft, FiEdit, FiUsers, FiCalendar, FiDollarSign, FiBarChart, FiPlus } = FiIcons;

const ProjectDetail = () => {
  const { id } = useParams();
  const { getProjectById, getTasksByProjectId, teamMembers } = useProject();
  const [activeTab, setActiveTab] = useState('overview');

  const project = getProjectById(id);
  const tasks = getTasksByProjectId(id);

  if (!project) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Project not found
        </h2>
        <Link 
          to="/projects"
          className="text-primary-600 hover:text-primary-700 dark:text-primary-400"
        >
          Back to Projects
        </Link>
      </div>
    );
  }

  const projectTeam = teamMembers.filter(member => 
    project.team.includes(member.id)
  );

  const completedTasks = tasks.filter(task => task.status === 'completed');
  const overdueTasks = tasks.filter(task => {
    const endDate = new Date(task.endDate);
    return endDate < new Date() && task.status !== 'completed';
  });

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'tasks', label: 'Tasks' },
    { id: 'gantt', label: 'Gantt Chart' },
    { id: 'team', label: 'Team' },
    { id: 'files', label: 'Files' }
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
        <div className="flex items-center space-x-4">
          <Link
            to="/projects"
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
          >
            <SafeIcon icon={FiArrowLeft} className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {project.name}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              {project.description}
            </p>
          </div>
        </div>
        <button className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-200">
          <SafeIcon icon={FiEdit} className="w-4 h-4" />
          <span>Edit Project</span>
        </button>
      </div>

      {/* Project Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Progress</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
                {project.progress}%
              </p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <SafeIcon icon={FiBarChart} className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-4">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${project.progress}%` }}
            />
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
              <SafeIcon icon={FiUsers} className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Budget</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
                ${project.spent.toLocaleString()}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                of ${project.budget.toLocaleString()}
              </p>
            </div>
            <div className="p-3 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
              <SafeIcon icon={FiDollarSign} className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Due Date</p>
              <p className="text-lg font-bold text-gray-900 dark:text-white mt-2">
                {format(new Date(project.endDate), 'MMM dd, yyyy')}
              </p>
              {overdueTasks.length > 0 && (
                <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                  {overdueTasks.length} overdue
                </p>
              )}
            </div>
            <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
              <SafeIcon icon={FiCalendar} className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Project Details */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(project.status)}`}>
              {project.status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </span>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(project.priority)}`}>
              {project.priority} priority
            </span>
            <div className="flex items-center space-x-2">
              {project.tags.map(tag => (
                <span
                  key={tag}
                  className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded text-xs"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <div 
            className="w-4 h-4 rounded-full"
            style={{ backgroundColor: project.color }}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              Project Timeline
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Start Date:</span>
                <span className="text-gray-900 dark:text-white">
                  {format(new Date(project.startDate), 'MMM dd, yyyy')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">End Date:</span>
                <span className="text-gray-900 dark:text-white">
                  {format(new Date(project.endDate), 'MMM dd, yyyy')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Duration:</span>
                <span className="text-gray-900 dark:text-white">
                  {Math.ceil((new Date(project.endDate) - new Date(project.startDate)) / (1000 * 60 * 60 * 24))} days
                </span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              Team Members
            </h3>
            <div className="space-y-2">
              {projectTeam.slice(0, 4).map(member => (
                <div key={member.id} className="flex items-center space-x-3">
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {member.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {member.role}
                    </p>
                  </div>
                </div>
              ))}
              {projectTeam.length > 4 && (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  +{projectTeam.length - 4} more members
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-8 px-6">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                  activeTab === tab.id
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
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Recent Tasks
                </h3>
                <div className="space-y-3">
                  {tasks.slice(0, 5).map(task => (
                    <TaskCard key={task.id} task={task} compact />
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'tasks' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  All Tasks ({tasks.length})
                </h3>
                <button className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-200">
                  <SafeIcon icon={FiPlus} className="w-4 h-4" />
                  <span>Add Task</span>
                </button>
              </div>
              <div className="space-y-3">
                {tasks.map(task => (
                  <TaskCard key={task.id} task={task} viewMode="list" />
                ))}
              </div>
            </div>
          )}

          {activeTab === 'gantt' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Project Timeline
              </h3>
              <GanttChart tasks={tasks} />
            </div>
          )}

          {activeTab === 'team' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Team Members ({projectTeam.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {projectTeam.map(member => (
                  <div
                    key={member.id}
                    className="flex items-center space-x-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                  >
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {member.name}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {member.role}
                      </p>
                      <p className="text-xs text-gray-400 dark:text-gray-500">
                        {member.department}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'files' && (
            <div className="text-center py-12">
              <SafeIcon icon={FiUsers} className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No files uploaded yet
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                Upload project files to share with your team.
              </p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectDetail;