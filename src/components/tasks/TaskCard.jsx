import React from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useProject } from '../../context/ProjectContext';
import { getStatusColor, getPriorityColor } from '../../utils/mockData';

const { FiCalendar, FiClock, FiUser, FiMoreHorizontal, FiLink } = FiIcons;

const TaskCard = ({ task, viewMode = 'grid', compact = false, index = 0 }) => {
  const { teamMembers, projects } = useProject();
  
  const assignees = teamMembers.filter(member => 
    task.assignees.includes(member.id)
  );
  
  const project = projects.find(p => p.id === task.projectId);
  const progressPercentage = task.progress || 0;
  const isOverdue = new Date(task.endDate) < new Date() && task.status !== 'completed';

  if (viewMode === 'list' && !compact) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: index * 0.05 }}
        className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border-l-4 hover:shadow-md transition-all duration-200 ${
          isOverdue ? 'border-l-red-500' : 'border-l-primary-500'
        } border-r border-t border-b border-gray-200 dark:border-gray-700`}
      >
        <div className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-2">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {task.title}
                </h3>
                {task.dependencies && task.dependencies.length > 0 && (
                  <SafeIcon icon={FiLink} className="w-4 h-4 text-gray-400" title="Has dependencies" />
                )}
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                {task.description}
              </p>
              
              <div className="flex items-center space-x-4 mb-3">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                  {task.status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                  {task.priority} priority
                </span>
                {project && (
                  <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full text-xs">
                    {project.name}
                  </span>
                )}
              </div>

              <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center space-x-1">
                  <SafeIcon icon={FiCalendar} className="w-4 h-4" />
                  <span>Due {format(new Date(task.endDate), 'MMM dd, yyyy')}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <SafeIcon icon={FiClock} className="w-4 h-4" />
                  <span>{task.estimatedHours}h estimated</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 ml-6">
              <div className="text-center">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {progressPercentage}%
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Complete</p>
              </div>
              
              <div className="flex -space-x-2">
                {assignees.slice(0, 3).map(assignee => (
                  <img
                    key={assignee.id}
                    src={assignee.avatar}
                    alt={assignee.name}
                    className="w-8 h-8 rounded-full border-2 border-white dark:border-gray-800"
                    title={assignee.name}
                  />
                ))}
                {assignees.length > 3 && (
                  <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 border-2 border-white dark:border-gray-800 flex items-center justify-center">
                    <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
                      +{assignees.length - 3}
                    </span>
                  </div>
                )}
              </div>
              
              <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200">
                <SafeIcon icon={FiMoreHorizontal} className="w-4 h-4 text-gray-500" />
              </button>
            </div>
          </div>
          
          <div className="mt-4">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-gray-600 dark:text-gray-400">Progress</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {progressPercentage}%
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 progress-bar">
              <div
                className={`h-2 rounded-full transition-all duration-500 ${
                  isOverdue ? 'bg-red-500' : 'bg-primary-600'
                }`}
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border hover:shadow-lg transition-all duration-200 task-card ${
        isOverdue 
          ? 'border-red-200 dark:border-red-800' 
          : 'border-gray-200 dark:border-gray-700'
      } ${compact ? 'p-4' : 'p-6'}`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-2">
            <h3 className={`font-semibold text-gray-900 dark:text-white ${
              compact ? 'text-base' : 'text-lg'
            }`}>
              {task.title}
            </h3>
            {task.dependencies && task.dependencies.length > 0 && (
              <SafeIcon icon={FiLink} className="w-4 h-4 text-gray-400" title="Has dependencies" />
            )}
          </div>
          {!compact && (
            <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2 mb-3">
              {task.description}
            </p>
          )}
        </div>
        
        <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200">
          <SafeIcon icon={FiMoreHorizontal} className="w-4 h-4 text-gray-500" />
        </button>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">Progress</span>
          <span className="font-medium text-gray-900 dark:text-white">
            {progressPercentage}%
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 progress-bar">
          <div
            className={`h-2 rounded-full transition-all duration-500 ${
              isOverdue ? 'bg-red-500' : 'bg-primary-600'
            }`}
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
            {task.status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
          </span>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
            {task.priority}
          </span>
        </div>
        
        <div className="flex -space-x-2">
          {assignees.slice(0, 2).map(assignee => (
            <img
              key={assignee.id}
              src={assignee.avatar}
              alt={assignee.name}
              className="w-6 h-6 rounded-full border-2 border-white dark:border-gray-800"
              title={assignee.name}
            />
          ))}
          {assignees.length > 2 && (
            <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700 border-2 border-white dark:border-gray-800 flex items-center justify-center">
              <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
                +{assignees.length - 2}
              </span>
            </div>
          )}
        </div>
      </div>

      {!compact && (
        <div className="flex items-center justify-between mt-3 text-xs text-gray-500 dark:text-gray-400">
          <div className="flex items-center space-x-1">
            <SafeIcon icon={FiCalendar} className="w-3 h-3" />
            <span>Due {format(new Date(task.endDate), 'MMM dd')}</span>
          </div>
          <div className="flex items-center space-x-1">
            <SafeIcon icon={FiClock} className="w-3 h-3" />
            <span>{task.estimatedHours}h</span>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default TaskCard;