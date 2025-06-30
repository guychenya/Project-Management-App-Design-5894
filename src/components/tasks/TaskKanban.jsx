import React from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import TaskCard from './TaskCard';

const { FiCircle, FiClock, FiPlay, FiPause, FiCheck, FiX } = FiIcons;

const TaskKanban = ({ tasks }) => {
  const columns = [
    {
      id: 'not-started',
      title: 'Not Started',
      icon: FiCircle,
      color: 'text-gray-500',
      bgColor: 'bg-gray-50 dark:bg-gray-900',
      borderColor: 'border-gray-200 dark:border-gray-700'
    },
    {
      id: 'pending',
      title: 'Pending',
      icon: FiClock,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
      borderColor: 'border-yellow-200 dark:border-yellow-800'
    },
    {
      id: 'in-progress',
      title: 'In Progress',
      icon: FiPlay,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      borderColor: 'border-blue-200 dark:border-blue-800'
    },
    {
      id: 'on-hold',
      title: 'On Hold',
      icon: FiPause,
      color: 'text-orange-500',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20',
      borderColor: 'border-orange-200 dark:border-orange-800'
    },
    {
      id: 'completed',
      title: 'Completed',
      icon: FiCheck,
      color: 'text-green-500',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      borderColor: 'border-green-200 dark:border-green-800'
    }
  ];

  const getTasksByStatus = (status) => {
    return tasks.filter(task => task.status === status);
  };

  return (
    <div className="flex space-x-6 overflow-x-auto pb-6">
      {columns.map((column) => {
        const columnTasks = getTasksByStatus(column.id);
        
        return (
          <motion.div
            key={column.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={`flex-shrink-0 w-80 ${column.bgColor} rounded-lg border ${column.borderColor} p-4`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <SafeIcon icon={column.icon} className={`w-5 h-5 ${column.color}`} />
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {column.title}
                </h3>
                <span className="bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs px-2 py-1 rounded-full">
                  {columnTasks.length}
                </span>
              </div>
            </div>
            
            <div className="space-y-3 max-h-[calc(100vh-300px)] overflow-y-auto custom-scrollbar">
              {columnTasks.map((task, index) => (
                <TaskCard 
                  key={task.id} 
                  task={task} 
                  viewMode="grid"
                  compact={true}
                  index={index}
                />
              ))}
              
              {columnTasks.length === 0 && (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <p className="text-sm">No tasks in this column</p>
                </div>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default TaskKanban;