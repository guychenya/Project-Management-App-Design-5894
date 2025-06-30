import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiHome, FiFolderPlus, FiCheckSquare, FiUsers, FiBarChart3, FiSettings, FiX } = FiIcons;

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();

  const menuItems = [
    { path: '/', icon: FiHome, label: 'Dashboard' },
    { path: '/projects', icon: FiFolderPlus, label: 'Projects' },
    { path: '/tasks', icon: FiCheckSquare, label: 'Tasks' },
    { path: '/team', icon: FiUsers, label: 'Team' },
    { path: '/reports', icon: FiBarChart3, label: 'Reports' },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <motion.div
        initial={false}
        animate={{
          x: isOpen ? 0 : -280,
          width: isOpen ? 256 : 80
        }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="fixed left-0 top-0 h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 z-50 lg:z-30"
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <motion.div
            animate={{ opacity: isOpen ? 1 : 0 }}
            transition={{ duration: 0.2 }}
            className="flex items-center space-x-3"
          >
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <SafeIcon icon={FiFolderPlus} className="w-5 h-5 text-white" />
            </div>
            {isOpen && (
              <span className="text-xl font-bold text-gray-900 dark:text-white">
                ProjectFlow
              </span>
            )}
          </motion.div>
          
          {isOpen && (
            <button
              onClick={onClose}
              className="lg:hidden p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <SafeIcon icon={FiX} className="w-5 h-5 text-gray-500" />
            </button>
          )}
        </div>

        <nav className="mt-6 px-3">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center px-3 py-2 rounded-lg transition-colors duration-200 ${
                      isActive
                        ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300'
                        : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                    }`
                  }
                  onClick={() => window.innerWidth < 1024 && onClose()}
                >
                  <SafeIcon icon={item.icon} className="w-5 h-5 flex-shrink-0" />
                  <motion.span
                    animate={{ opacity: isOpen ? 1 : 0 }}
                    transition={{ duration: 0.2 }}
                    className={`ml-3 ${isOpen ? 'block' : 'hidden'}`}
                  >
                    {item.label}
                  </motion.span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="absolute bottom-4 left-0 right-0 px-3">
          <button className="flex items-center w-full px-3 py-2 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200">
            <SafeIcon icon={FiSettings} className="w-5 h-5 flex-shrink-0" />
            <motion.span
              animate={{ opacity: isOpen ? 1 : 0 }}
              transition={{ duration: 0.2 }}
              className={`ml-3 ${isOpen ? 'block' : 'hidden'}`}
            >
              Settings
            </motion.span>
          </button>
        </div>
      </motion.div>
    </>
  );
};

export default Sidebar;