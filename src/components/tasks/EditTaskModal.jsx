import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useProject } from '../../context/ProjectContext';
import { useNotification } from '../../context/NotificationContext';

const { FiX } = FiIcons;

const EditTaskModal = ({ isOpen, onClose, task }) => {
  const { updateTask, projects, teamMembers } = useProject();
  const { addNotification } = useNotification();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    projectId: '',
    status: 'pending',
    priority: 'medium',
    startDate: '',
    endDate: '',
    estimatedHours: '',
    progress: 0,
    assignees: [],
    tags: '',
    type: 'task'
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || '',
        description: task.description || '',
        projectId: task.projectId || '',
        status: task.status || 'pending',
        priority: task.priority || 'medium',
        startDate: task.startDate ? task.startDate.split('T')[0] : '',
        endDate: task.endDate ? task.endDate.split('T')[0] : '',
        estimatedHours: task.estimatedHours?.toString() || '',
        progress: task.progress || 0,
        assignees: task.assignees || [],
        tags: task.tags ? task.tags.join(', ') : '',
        type: task.type || 'task'
      });
    }
  }, [task]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validation
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Task title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.projectId) newErrors.projectId = 'Project is required';
    if (!formData.startDate) newErrors.startDate = 'Start date is required';
    if (!formData.endDate) newErrors.endDate = 'End date is required';
    if (!formData.estimatedHours) newErrors.estimatedHours = 'Estimated hours is required';
    if (formData.assignees.length === 0) newErrors.assignees = 'At least one assignee is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Update task
    const updatedTask = {
      ...formData,
      estimatedHours: parseFloat(formData.estimatedHours),
      progress: parseInt(formData.progress),
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean)
    };

    updateTask(task.id, updatedTask);
    addNotification({
      type: 'success',
      title: 'Task Updated',
      message: `${formData.title} has been updated successfully.`
    });

    onClose();
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const handleAssigneeChange = (memberId) => {
    setFormData(prev => ({
      ...prev,
      assignees: prev.assignees.includes(memberId)
        ? prev.assignees.filter(id => id !== memberId)
        : [...prev.assignees, memberId]
    }));
    if (errors.assignees) {
      setErrors(prev => ({ ...prev, assignees: null }));
    }
  };

  if (!task) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            onClick={onClose}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Edit Task
                </h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
                >
                  <SafeIcon icon={FiX} className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Task Title *
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                        errors.title ? 'border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-gray-600'
                      } dark:bg-gray-700 dark:text-white`}
                      placeholder="Enter task title"
                    />
                    {errors.title && (
                      <p className="text-red-500 text-sm mt-1">{errors.title}</p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Description *
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      rows={3}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                        errors.description ? 'border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-gray-600'
                      } dark:bg-gray-700 dark:text-white`}
                      placeholder="Describe the task"
                    />
                    {errors.description && (
                      <p className="text-red-500 text-sm mt-1">{errors.description}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Project *
                    </label>
                    <select
                      value={formData.projectId}
                      onChange={(e) => handleInputChange('projectId', e.target.value)}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                        errors.projectId ? 'border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-gray-600'
                      } dark:bg-gray-700 dark:text-white`}
                    >
                      <option value="">Select project</option>
                      {projects.map(project => (
                        <option key={project.id} value={project.id}>
                          {project.name}
                        </option>
                      ))}
                    </select>
                    {errors.projectId && (
                      <p className="text-red-500 text-sm mt-1">{errors.projectId}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Type
                    </label>
                    <select
                      value={formData.type}
                      onChange={(e) => handleInputChange('type', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    >
                      <option value="task">Task</option>
                      <option value="epic">Epic</option>
                      <option value="subtask">Subtask</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Status
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => handleInputChange('status', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    >
                      <option value="not-started">Not Started</option>
                      <option value="pending">Pending</option>
                      <option value="in-progress">In Progress</option>
                      <option value="on-hold">On Hold</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Priority
                    </label>
                    <select
                      value={formData.priority}
                      onChange={(e) => handleInputChange('priority', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="critical">Critical</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Start Date *
                    </label>
                    <input
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => handleInputChange('startDate', e.target.value)}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                        errors.startDate ? 'border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-gray-600'
                      } dark:bg-gray-700 dark:text-white`}
                    />
                    {errors.startDate && (
                      <p className="text-red-500 text-sm mt-1">{errors.startDate}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      End Date *
                    </label>
                    <input
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => handleInputChange('endDate', e.target.value)}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                        errors.endDate ? 'border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-gray-600'
                      } dark:bg-gray-700 dark:text-white`}
                    />
                    {errors.endDate && (
                      <p className="text-red-500 text-sm mt-1">{errors.endDate}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Estimated Hours *
                    </label>
                    <input
                      type="number"
                      value={formData.estimatedHours}
                      onChange={(e) => handleInputChange('estimatedHours', e.target.value)}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                        errors.estimatedHours ? 'border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-gray-600'
                      } dark:bg-gray-700 dark:text-white`}
                      placeholder="0"
                    />
                    {errors.estimatedHours && (
                      <p className="text-red-500 text-sm mt-1">{errors.estimatedHours}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Progress (%)
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={formData.progress}
                      onChange={(e) => handleInputChange('progress', e.target.value)}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                      <span>0%</span>
                      <span className="font-medium text-gray-900 dark:text-white">{formData.progress}%</span>
                      <span>100%</span>
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Assignees *
                    </label>
                    <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto border border-gray-300 dark:border-gray-600 rounded-lg p-3">
                      {teamMembers.map(member => (
                        <label key={member.id} className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 p-2 rounded">
                          <input
                            type="checkbox"
                            checked={formData.assignees.includes(member.id)}
                            onChange={() => handleAssigneeChange(member.id)}
                            className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                          />
                          <img
                            src={member.avatar}
                            alt={member.name}
                            className="w-6 h-6 rounded-full"
                          />
                          <span className="text-sm text-gray-700 dark:text-gray-300">
                            {member.name}
                          </span>
                        </label>
                      ))}
                    </div>
                    {errors.assignees && (
                      <p className="text-red-500 text-sm mt-1">{errors.assignees}</p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Tags
                    </label>
                    <input
                      type="text"
                      value={formData.tags}
                      onChange={(e) => handleInputChange('tags', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      placeholder="Enter tags separated by commas"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors duration-200"
                  >
                    Update Task
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default EditTaskModal;