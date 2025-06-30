import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../components/common/SafeIcon';
import { useProject } from '../context/ProjectContext';
import ProjectCard from '../components/projects/ProjectCard';
import ProjectFilters from '../components/projects/ProjectFilters';
import CreateProjectModal from '../components/projects/CreateProjectModal';

const { FiPlus, FiGrid, FiList } = FiIcons;

const ProjectsPage = () => {
  const { projects, loading } = useProject();
  const [viewMode, setViewMode] = useState('grid');
  const [filters, setFilters] = useState({
    status: 'all',
    priority: 'all',
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

  const filteredProjects = projects.filter(project => {
    const matchesStatus = filters.status === 'all' || project.status === filters.status;
    const matchesPriority = filters.priority === 'all' || project.priority === filters.priority;
    const matchesSearch = !filters.search || 
      project.name.toLowerCase().includes(filters.search.toLowerCase()) ||
      project.description.toLowerCase().includes(filters.search.toLowerCase());
    
    return matchesStatus && matchesPriority && matchesSearch;
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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Projects</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage and track all your projects in one place.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
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
            <span>New Project</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <ProjectFilters filters={filters} onFiltersChange={setFilters} />

      {/* Projects Grid/List */}
      <div className={`${
        viewMode === 'grid' 
          ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' 
          : 'space-y-4'
      }`}>
        {filteredProjects.map((project, index) => (
          <ProjectCard 
            key={project.id} 
            project={project} 
            viewMode={viewMode}
            index={index}
          />
        ))}
      </div>

      {filteredProjects.length === 0 && (
        <div className="text-center py-12">
          <SafeIcon icon={FiGrid} className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No projects found
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            {filters.search || filters.status !== 'all' || filters.priority !== 'all'
              ? 'Try adjusting your filters to see more projects.'
              : 'Get started by creating your first project.'
            }
          </p>
        </div>
      )}

      {/* Create Project Modal */}
      <CreateProjectModal 
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />
    </motion.div>
  );
};

export default ProjectsPage;