import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useTheme } from '../../context/ThemeContext';
import { useNotification } from '../../context/NotificationContext';

const { FiMenu, FiSun, FiMoon, FiBell, FiSearch, FiUser } = FiIcons;

const Header = ({ onMenuClick }) => {
  const { isDark, toggleTheme } = useTheme();
  const { unreadCount } = useNotification();
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-20">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center space-x-4">
          <button
            onClick={onMenuClick}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
          >
            <SafeIcon icon={FiMenu} className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button>

          <div className="relative hidden md:block">
            <SafeIcon 
              icon={FiSearch} 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" 
            />
            <input
              type="text"
              placeholder="Search projects, tasks, or team members..."
              className="pl-10 pr-4 py-2 w-80 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
          >
            <SafeIcon 
              icon={isDark ? FiSun : FiMoon} 
              className="w-5 h-5 text-gray-600 dark:text-gray-300" 
            />
          </button>

          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 relative"
            >
              <SafeIcon icon={FiBell} className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              {unreadCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
                >
                  {unreadCount > 9 ? '9+' : unreadCount}
                </motion.span>
              )}
            </button>
          </div>

          <div className="flex items-center space-x-3 pl-3 border-l border-gray-200 dark:border-gray-700">
            <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
              <SafeIcon icon={FiUser} className="w-4 h-4 text-white" />
            </div>
            <div className="hidden md:block">
              <p className="text-sm font-medium text-gray-900 dark:text-white">John Doe</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Project Manager</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;