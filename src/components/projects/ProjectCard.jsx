import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useProject } from '../../context/ProjectContext';
import { getStatusColor, getPriorityColor } from '../../utils/mockData';

const { FiCalendar, FiUsers, FiDollarSign, FiTrendingUp, FiMoreHorizontal } = FiIcons;

const ProjectCard = ({ project, viewMode = 'grid', compact = false, index = 0 }) => {
  const { teamMembers } = useProject();
  
  const projectTeam = teamMembers.filter(member => 
    project.team.includes(member.id)
  );

  const progressPercentage = project.progress || 0;
  const budgetUsed = (project.spent / project.budget) * 100;

  if (viewMode === 'list' && !compact) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: index * 0.05 }}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-200"
      >
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <Link 
                to={`/projects/${project.id}`}
                className="text-lg font-semibold text-gray-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200"
              >
                {project.name}
              </Link>
              <p className="text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                {project.description}
              </p>
              <div className="flex items-center space-x-4 mt-3">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                  {project.status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(project.priority)}`}>
                  {project.priority} priority
                </span>
              </div>
            </div>
            
            <div className="flex items-center space-x-6 ml-6">
              <div className="text-center">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {progressPercentage}%
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Progress</p>
              </div>
              
              <div className="flex -space-x-2">
                {projectTeam.slice(0, 3).map(member => (
                  <img
                    key={member.id}
                    src={member.avatar}
                    alt={member.name}
                    className="w-8 h-8 rounded-full border-2 border-white dark:border-gray-800"
                    title={member.name}
                  />
                ))}
                {projectTeam.length > 3 && (
                  <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 border-2 border-white dark:border-gray-800 flex items-center justify-center">
                    <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
                      +{projectTeam.length - 3}
                    </span>
                  </div>
                )}
              </div>
              
              <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200">
                <SafeIcon icon={FiMoreHorizontal} className="w-4 h-4 text-gray-500" />
              </button>
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
      className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-200 task-card ${
        compact ? 'p-4' : 'p-6'
      }`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0">
          <Link 
            to={`/projects/${project.id}`}
            className={`font-semibold text-gray-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200 ${
              compact ? 'text-base' : 'text-lg'
            }`}
          >
            {project.name}
          </Link>
          {!compact && (
            <p className="text-gray-600 dark:text-gray-400 mt-2 text-sm line-clamp-2">
              {project.description}
            </p>
          )}
        </div>
        
        <div 
          className="w-3 h-3 rounded-full flex-shrink-0 ml-3"
          style={{ backgroundColor: project.color }}
        />
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
            className="bg-primary-600 h-2 rounded-full transition-all duration-500"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
            {project.status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
          </span>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(project.priority)}`}>
            {project.priority}
          </span>
        </div>
        
        <div className="flex -space-x-2">
          {projectTeam.slice(0, 3).map(member => (
            <img
              key={member.id}
              src={member.avatar}
              alt={member.name}
              className="w-6 h-6 rounded-full border-2 border-white dark:border-gray-800"
              title={member.name}
            />
          ))}
          {projectTeam.length > 3 && (
            <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700 border-2 border-white dark:border-gray-800 flex items-center justify-center">
              <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
                +{projectTeam.length - 3}
              </span>
            </div>
          )}
        </div>
      </div>

      {!compact && (
        <div className="flex items-center justify-between mt-4 text-xs text-gray-500 dark:text-gray-400">
          <div className="flex items-center space-x-1">
            <SafeIcon icon={FiCalendar} className="w-3 h-3" />
            <span>Due {format(new Date(project.endDate), 'MMM dd')}</span>
          </div>
          <div className="flex items-center space-x-1">
            <SafeIcon icon={FiDollarSign} className="w-3 h-3" />
            <span>${project.spent.toLocaleString()} / ${project.budget.toLocaleString()}</span>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default ProjectCard;