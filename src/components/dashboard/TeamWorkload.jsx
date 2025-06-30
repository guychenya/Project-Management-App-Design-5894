import React from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiUsers } = FiIcons;

const TeamWorkload = ({ teamMembers, tasks }) => {
  const getWorkloadData = () => {
    return teamMembers.map(member => {
      const memberTasks = tasks.filter(task => 
        task.assignees.includes(member.id) && task.status !== 'completed'
      );
      const totalHours = memberTasks.reduce((sum, task) => sum + (task.estimatedHours || 0), 0);
      const workloadPercentage = Math.min((totalHours / 40) * 100, 100); // Assuming 40 hours per week capacity
      
      return {
        ...member,
        activeTasks: memberTasks.length,
        totalHours,
        workloadPercentage
      };
    });
  };

  const workloadData = getWorkloadData();

  const getWorkloadColor = (percentage) => {
    if (percentage >= 90) return 'bg-red-500';
    if (percentage >= 70) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Team Workload</h2>
        <SafeIcon icon={FiUsers} className="w-5 h-5 text-primary-600" />
      </div>
      
      <div className="space-y-4">
        {workloadData.map((member, index) => (
          <motion.div
            key={member.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="flex items-center space-x-3"
          >
            <img
              src={member.avatar}
              alt={member.name}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                {member.name}
              </p>
              <div className="flex items-center space-x-2 mt-1">
                <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-500 ${getWorkloadColor(member.workloadPercentage)}`}
                    style={{ width: `${member.workloadPercentage}%` }}
                  />
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400 w-8">
                  {Math.round(member.workloadPercentage)}%
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {member.activeTasks} tasks • {member.totalHours}h
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default TeamWorkload;