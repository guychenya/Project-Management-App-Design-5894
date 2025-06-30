import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../components/common/SafeIcon';
import { useProject } from '../context/ProjectContext';
import TaskCard from '../components/tasks/TaskCard';
import TaskFilters from '../components/tasks/TaskFilters';
import CreateTaskModal from '../components/tasks/CreateTaskModal';
import TaskKanban from '../components/tasks/TaskKanban';

const { FiPlus, FiGrid, FiList, FiColumns } = FiIcons;

const TasksPage = () => {
  const { tasks, loading } = useProject();
  const [viewMode, setViewMode] = useState('list');
  const [filters, setFilters] = useState({
    status: 'all',
    priority: 'all',
    project: 'all',
    assignee: 'all',
    search: ''
  });
  const [showCreateModal, setShowCreateModal] = useState(false);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const filteredTasks = tasks.filter(task => {
    const matchesStatus = filters.status === 'all' || task.status === filters.status;
    const matchesPriority = filters.priority === 'all' || task.priority === filters.priority;
    const matchesProject = filters.project === 'all' || task.projectId === filters.project;
    const matchesAssignee = filters.assignee === 'all' || task.assignees.includes(filters.assignee);
    const matchesSearch = !filters.search || 
      task.title.toLowerCase().includes(filters.search.toLowerCase()) ||
      task.description.toLowerCase().includes(filters.search.toLowerCase());
    
    return matchesStatus && matchesPriority && matchesProject && matchesAssignee && matchesSearch;
  });

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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Tasks</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Track and manage all your tasks across projects.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
            <button
              onClick={() => setViewMode('kanban')}
              className={`p-2 rounded-md transition-colors duration-200 ${
                viewMode === 'kanban'
                  ? 'bg-white dark:bg-gray-600 shadow-sm'
                  : 'hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              <SafeIcon icon={FiColumns} className="w-4 h-4 text-gray-600 dark:text-gray-300" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md transition-colors duration-200 ${
                viewMode === 'grid'
                  ? 'bg-white dark:bg-gray-600 shadow-sm'
                  : 'hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              <SafeIcon icon={FiGrid} className="w-4 h-4 text-gray-600 dark:text-gray-300" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-md transition-colors duration-200 ${
                viewMode === 'list'
                  ? 'bg-white dark:bg-gray-600 shadow-sm'
                  : 'hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              <SafeIcon icon={FiList} className="w-4 h-4 text-gray-600 dark:text-gray-300" />
            </button>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-200"
          >
            <SafeIcon icon={FiPlus} className="w-4 h-4" />
            <span>New Task</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <TaskFilters filters={filters} onFiltersChange={setFilters} />

      {/* Tasks View */}
      {viewMode === 'kanban' ? (
        <TaskKanban tasks={filteredTasks} />
      ) : (
        <div className={`${
          viewMode === 'grid' 
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' 
            : 'space-y-4'
        }`}>
          {filteredTasks.map((task, index) => (
            <TaskCard 
              key={task.id} 
              task={task} 
              viewMode={viewMode}
              index={index}
            />
          ))}
        </div>
      )}

      {filteredTasks.length === 0 && (
        <div className="text-center py-12">
          <SafeIcon icon={FiGrid} className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No tasks found
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            {Object.values(filters).some(filter => filter !== 'all' && filter !== '')
              ? 'Try adjusting your filters to see more tasks.'
              : 'Get started by creating your first task.'
            }
          </p>
        </div>
      )}

      {/* Create Task Modal */}
      <CreateTaskModal 
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />
    </motion.div>
  );
};

export default TasksPage;