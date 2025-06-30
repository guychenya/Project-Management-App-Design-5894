import React from 'react';
import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiActivity, FiCheckCircle, FiUserPlus, FiFileText, FiClock } = FiIcons;

const ActivityFeed = () => {
  const activities = [
    {
      id: '1',
      type: 'task_completed',
      user: 'Sarah Johnson',
      action: 'completed task',
      target: 'User Research and Analysis',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      icon: FiCheckCircle,
      color: 'text-green-600'
    },
    {
      id: '2',
      type: 'user_assigned',
      user: 'Michael Chen',
      action: 'was assigned to',
      target: 'Frontend Components Development',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      icon: FiUserPlus,
      color: 'text-blue-600'
    },
    {
      id: '3',
      type: 'file_uploaded',
      user: 'Emily Rodriguez',
      action: 'uploaded file',
      target: 'design_mockups.pdf',
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
      icon: FiFileText,
      color: 'text-purple-600'
    },
    {
      id: '4',
      type: 'deadline_approaching',
      user: 'System',
      action: 'deadline reminder for',
      target: 'API Integration',
      timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
      icon: FiClock,
      color: 'text-orange-600'
    }
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Recent Activity</h2>
        <SafeIcon icon={FiActivity} className="w-5 h-5 text-primary-600" />
      </div>
      
      <div className="space-y-4">
        {activities.map((activity, index) => (
          <motion.div
            key={activity.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="flex items-start space-x-3"
          >
            <div className={`p-2 rounded-full bg-gray-100 dark:bg-gray-700 ${activity.color}`}>
              <SafeIcon icon={activity.icon} className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-900 dark:text-white">
                <span className="font-medium">{activity.user}</span>
                {' '}
                <span className="text-gray-600 dark:text-gray-400">{activity.action}</span>
                {' '}
                <span className="font-medium">{activity.target}</span>
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
      
      <button className="w-full mt-4 text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium">
        View all activity
      </button>
    </div>
  );
};

export default ActivityFeed;