import React, { createContext, useContext, useState, useEffect } from 'react';
import { generateMockData } from '../utils/mockData';

const ProjectContext = createContext();

export const useProject = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProject must be used within a ProjectProvider');
  }
  return context;
};

export const ProjectProvider = ({ children }) => {
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeData = async () => {
      try {
        const mockData = generateMockData();
        setProjects(mockData.projects);
        setTasks(mockData.tasks);
        setTeamMembers(mockData.teamMembers);
      } catch (error) {
        console.error('Error initializing data:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeData();
  }, []);

  const addProject = (project) => {
    const newProject = {
      ...project,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setProjects(prev => [...prev, newProject]);
    return newProject;
  };

  const updateProject = (id, updates) => {
    setProjects(prev => prev.map(project => 
      project.id === id 
        ? { ...project, ...updates, updatedAt: new Date().toISOString() }
        : project
    ));
  };

  const deleteProject = (id) => {
    setProjects(prev => prev.filter(project => project.id !== id));
    setTasks(prev => prev.filter(task => task.projectId !== id));
  };

  const addTask = (task) => {
    const newTask = {
      ...task,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setTasks(prev => [...prev, newTask]);
    return newTask;
  };

  const updateTask = (id, updates) => {
    setTasks(prev => prev.map(task => 
      task.id === id 
        ? { ...task, ...updates, updatedAt: new Date().toISOString() }
        : task
    ));
  };

  const deleteTask = (id) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  };

  const getProjectById = (id) => {
    return projects.find(project => project.id === id);
  };

  const getTasksByProjectId = (projectId) => {
    return tasks.filter(task => task.projectId === projectId);
  };

  const getTasksByAssignee = (assigneeId) => {
    return tasks.filter(task => task.assignees.includes(assigneeId));
  };

  const value = {
    projects,
    tasks,
    teamMembers,
    loading,
    addProject,
    updateProject,
    deleteProject,
    addTask,
    updateTask,
    deleteTask,
    getProjectById,
    getTasksByProjectId,
    getTasksByAssignee
  };

  return (
    <ProjectContext.Provider value={value}>
      {children}
    </ProjectContext.Provider>
  );
};