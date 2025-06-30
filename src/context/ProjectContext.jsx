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
    setProjects(prev => 
      prev.map(project => 
        project.id === id 
          ? { ...project, ...updates, updatedAt: new Date().toISOString() }
          : project
      )
    );
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
    setTasks(prev => 
      prev.map(task => 
        task.id === id 
          ? { ...task, ...updates, updatedAt: new Date().toISOString() }
          : task
      )
    );
  };

  const deleteTask = (id) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  };

  const addTeamMember = (member) => {
    const newMember = {
      ...member,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setTeamMembers(prev => [...prev, newMember]);
    return newMember;
  };

  const updateTeamMember = (id, updates) => {
    setTeamMembers(prev => 
      prev.map(member => 
        member.id === id 
          ? { ...member, ...updates, updatedAt: new Date().toISOString() }
          : member
      )
    );
  };

  const deleteTeamMember = (id) => {
    setTeamMembers(prev => prev.filter(member => member.id !== id));
    // Remove member from all projects and tasks
    setProjects(prev => 
      prev.map(project => ({
        ...project,
        team: project.team.filter(memberId => memberId !== id),
        manager: project.manager === id ? '' : project.manager
      }))
    );
    setTasks(prev => 
      prev.map(task => ({
        ...task,
        assignees: task.assignees.filter(memberId => memberId !== id)
      }))
    );
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
    addTeamMember,
    updateTeamMember,
    deleteTeamMember,
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