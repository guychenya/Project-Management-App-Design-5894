import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../components/common/SafeIcon';
import { useProject } from '../context/ProjectContext';

const { FiUsers, FiMail, FiPhone, FiMapPin, FiMoreHorizontal, FiUserPlus } = FiIcons;

const TeamPage = () => {
  const { teamMembers, tasks, loading } = useProject();
  const [selectedMember, setSelectedMember] = useState(null);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const getTeamMemberStats = (memberId) => {
    const memberTasks = tasks.filter(task => task.assignees.includes(memberId));
    const completedTasks = memberTasks.filter(task => task.status === 'completed');
    const activeTasks = memberTasks.filter(task => 
      task.status === 'in-progress' || task.status === 'pending'
    );
    const totalHours = memberTasks.reduce((sum, task) => sum + (task.estimatedHours || 0), 0);
    
    return {
      totalTasks: memberTasks.length,
      completedTasks: completedTasks.length,
      activeTasks: activeTasks.length,
      totalHours,
      completionRate: memberTasks.length > 0 ? (completedTasks.length / memberTasks.length) * 100 : 0
    };
  };

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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Team</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage your team members and track their performance.
          </p>
        </div>
        <button className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-200">
          <SafeIcon icon={FiUserPlus} className="w-4 h-4" />
          <span>Add Member</span>
        </button>
      </div>

      {/* Team Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Members</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
                {teamMembers.length}
              </p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <SafeIcon icon={FiUsers} className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Projects</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
                {new Set(tasks.map(task => task.projectId)).size}
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
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Tasks</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
                {tasks.length}
              </p>
            </div>
            <div className="p-3 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
              <SafeIcon icon={FiUsers} className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Completion Rate</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
                {tasks.length > 0 ? Math.round((tasks.filter(t => t.status === 'completed').length / tasks.length) * 100) : 0}%
              </p>
            </div>
            <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
              <SafeIcon icon={FiUsers} className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Team Members Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teamMembers.map((member, index) => {
          const stats = getTeamMemberStats(member.id);
          
          return (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-all duration-200 cursor-pointer"
              onClick={() => setSelectedMember(member)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {member.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {member.role}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500">
                      {member.department}
                    </p>
                  </div>
                </div>
                <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200">
                  <SafeIcon icon={FiMoreHorizontal} className="w-4 h-4 text-gray-500" />
                </button>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Active Tasks</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {stats.activeTasks}
                  </span>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Completed</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {stats.completedTasks}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Completion Rate</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {Math.round(stats.completionRate)}%
                  </span>
                </div>

                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-primary-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${stats.completionRate}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-sm pt-2 border-t border-gray-200 dark:border-gray-700">
                  <span className="text-gray-600 dark:text-gray-400">Total Hours</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {stats.totalHours}h
                  </span>
                </div>
              </div>

              <div className="mt-4 flex items-center space-x-2">
                <div className="flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-400">
                  <SafeIcon icon={FiMail} className="w-3 h-3" />
                  <span className="truncate">{member.email}</span>
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  member.status === 'active' 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                    : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
                }`}>
                  {member.status}
                </span>
                <div className="flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-400">
                  <span>{stats.totalTasks} total tasks</span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {teamMembers.length === 0 && (
        <div className="text-center py-12">
          <SafeIcon icon={FiUsers} className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No team members found
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            Add team members to start collaborating on projects.
          </p>
        </div>
      )}
    </motion.div>
  );
};

export default TeamPage;