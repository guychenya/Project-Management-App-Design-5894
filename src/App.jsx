import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import Dashboard from './pages/Dashboard';
import ProjectsPage from './pages/ProjectsPage';
import ProjectDetail from './pages/ProjectDetail';
import TasksPage from './pages/TasksPage';
import TeamPage from './pages/TeamPage';
import ReportsPage from './pages/ReportsPage';
import NotificationCenter from './components/notifications/NotificationCenter';
import { ProjectProvider } from './context/ProjectContext';
import { NotificationProvider } from './context/NotificationContext';
import { ThemeProvider } from './context/ThemeContext';
import './App.css';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <ThemeProvider>
      <ProjectProvider>
        <NotificationProvider>
          <Router>
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
              <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
              
              <div className={`transition-all duration-300 ${sidebarOpen ? 'lg:ml-64' : 'lg:ml-20'}`}>
                <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
                
                <main className="p-4 lg:p-6">
                  <AnimatePresence mode="wait">
                    <Routes>
                      <Route path="/" element={<Dashboard />} />
                      <Route path="/projects" element={<ProjectsPage />} />
                      <Route path="/projects/:id" element={<ProjectDetail />} />
                      <Route path="/tasks" element={<TasksPage />} />
                      <Route path="/team" element={<TeamPage />} />
                      <Route path="/reports" element={<ReportsPage />} />
                    </Routes>
                  </AnimatePresence>
                </main>
              </div>

              <NotificationCenter />
            </div>
          </Router>
        </NotificationProvider>
      </ProjectProvider>
    </ThemeProvider>
  );
}

export default App;