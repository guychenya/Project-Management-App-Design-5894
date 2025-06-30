import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useNotification } from '../../context/NotificationContext';

const { FiBell, FiX, FiCheck, FiTrash2, FiSettings } = FiIcons;

const NotificationCenter = () => {
  const { 
    notifications, 
    unreadCount, 
    markAsRead, 
    markAllAsRead, 
    removeNotification, 
    clearAll 
  } = useNotification();
  
  const [isOpen, setIsOpen] = useState(false);

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'success':
        return FiCheck;
      case 'warning':
        return FiBell;
      case 'error':
        return FiX;
      default:
        return FiBell;
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'success':
        return 'text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-400';
      case 'warning':
        return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-400';
      case 'error':
        return 'text-red-600 bg-red-100 dark:bg-red-900 dark:text-red-400';
      default:
        return 'text-blue-600 bg-blue-100 dark:bg-blue-900 dark:text-blue-400';
    }
  };

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 bg-primary-600 hover:bg-primary-700 text-white p-4 rounded-full shadow-lg transition-all duration-200 z-40"
      >
        <SafeIcon icon={FiBell} className="w-6 h-6" />
        {unreadCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center"
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </motion.span>
        )}
      </button>

      {/* Notification Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 z-50"
              onClick={() => setIsOpen(false)}
            />
            
            <motion.div
              initial={{ opacity: 0, x: 400 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 400 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 h-full w-96 bg-white dark:bg-gray-800 shadow-xl z-50 overflow-hidden flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Notifications
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {unreadCount} unread
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  {notifications.length > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400"
                    >
                      Mark all read
                    </button>
                  )}
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                  >
                    <SafeIcon icon={FiX} className="w-4 h-4 text-gray-500" />
                  </button>
                </div>
              </div>

              {/* Notifications List */}
              <div className="flex-1 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center p-6">
                    <SafeIcon icon={FiBell} className="w-12 h-12 text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      No notifications
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400">
                      You're all caught up! New notifications will appear here.
                    </p>
                  </div>
                ) : (
                  <div className="p-4 space-y-3">
                    {notifications.map((notification) => (
                      <motion.div
                        key={notification.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className={`p-4 rounded-lg border transition-all duration-200 cursor-pointer ${
                          notification.read
                            ? 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600'
                            : 'bg-white dark:bg-gray-800 border-primary-200 dark:border-primary-700 shadow-sm'
                        }`}
                        onClick={() => !notification.read && markAsRead(notification.id)}
                      >
                        <div className="flex items-start space-x-3">
                          <div className={`p-2 rounded-full ${getNotificationColor(notification.type)}`}>
                            <SafeIcon 
                              icon={getNotificationIcon(notification.type)} 
                              className="w-4 h-4" 
                            />
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                                  {notification.title}
                                </h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                  {notification.message}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                                  {formatDistanceToNow(new Date(notification.timestamp), { addSuffix: true })}
                                </p>
                              </div>
                              
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeNotification(notification.id);
                                }}
                                className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors duration-200"
                              >
                                <SafeIcon icon={FiX} className="w-3 h-3 text-gray-400" />
                              </button>
                            </div>
                            
                            {!notification.read && (
                              <div className="w-2 h-2 bg-primary-500 rounded-full mt-2"></div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              {notifications.length > 0 && (
                <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <button
                      onClick={clearAll}
                      className="flex items-center space-x-2 text-sm text-red-600 hover:text-red-700 dark:text-red-400"
                    >
                      <SafeIcon icon={FiTrash2} className="w-4 h-4" />
                      <span>Clear all</span>
                    </button>
                    <button className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-700 dark:text-gray-400">
                      <SafeIcon icon={FiSettings} className="w-4 h-4" />
                      <span>Settings</span>
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default NotificationCenter;