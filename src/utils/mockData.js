import { addDays, subDays, format } from 'date-fns';

export const generateMockData = () => {
  const teamMembers = [
    {
      id: '1',
      name: 'Sarah Johnson',
      email: 'sarah.johnson@company.com',
      role: 'Project Manager',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b1e8?w=150&h=150&fit=crop&crop=face',
      department: 'Engineering',
      status: 'active'
    },
    {
      id: '2',
      name: 'Michael Chen',
      email: 'michael.chen@company.com',
      role: 'Senior Developer',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      department: 'Engineering',
      status: 'active'
    },
    {
      id: '3',
      name: 'Emily Rodriguez',
      email: 'emily.rodriguez@company.com',
      role: 'UX Designer',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      department: 'Design',
      status: 'active'
    },
    {
      id: '4',
      name: 'David Kim',
      email: 'david.kim@company.com',
      role: 'DevOps Engineer',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      department: 'Engineering',
      status: 'active'
    },
    {
      id: '5',
      name: 'Lisa Thompson',
      email: 'lisa.thompson@company.com',
      role: 'Marketing Manager',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face',
      department: 'Marketing',
      status: 'active'
    }
  ];

  const projects = [
    {
      id: '1',
      name: 'E-Commerce Platform Redesign',
      description: 'Complete overhaul of the customer-facing e-commerce platform with modern UI/UX and enhanced performance.',
      status: 'in-progress',
      priority: 'high',
      progress: 65,
      startDate: subDays(new Date(), 30).toISOString(),
      endDate: addDays(new Date(), 45).toISOString(),
      budget: 150000,
      spent: 97500,
      manager: '1',
      team: ['1', '2', '3', '4'],
      tags: ['web', 'redesign', 'frontend'],
      color: '#3b82f6'
    },
    {
      id: '2',
      name: 'Mobile App Development',
      description: 'Native mobile application for iOS and Android platforms with offline capabilities.',
      status: 'planning',
      priority: 'medium',
      progress: 15,
      startDate: addDays(new Date(), 7).toISOString(),
      endDate: addDays(new Date(), 120).toISOString(),
      budget: 200000,
      spent: 15000,
      manager: '2',
      team: ['2', '3', '4'],
      tags: ['mobile', 'ios', 'android'],
      color: '#10b981'
    },
    {
      id: '3',
      name: 'Marketing Campaign Q4',
      description: 'Comprehensive marketing campaign for Q4 product launches and holiday season.',
      status: 'completed',
      priority: 'high',
      progress: 100,
      startDate: subDays(new Date(), 90).toISOString(),
      endDate: subDays(new Date(), 5).toISOString(),
      budget: 75000,
      spent: 72000,
      manager: '5',
      team: ['5', '3'],
      tags: ['marketing', 'campaign', 'q4'],
      color: '#f59e0b'
    }
  ];

  const tasks = [
    // E-Commerce Platform Tasks
    {
      id: '1',
      projectId: '1',
      title: 'User Research and Analysis',
      description: 'Conduct comprehensive user research to understand current pain points and requirements.',
      status: 'completed',
      priority: 'high',
      progress: 100,
      estimatedHours: 40,
      actualHours: 42,
      startDate: subDays(new Date(), 30).toISOString(),
      endDate: subDays(new Date(), 25).toISOString(),
      assignees: ['3'],
      dependencies: [],
      tags: ['research', 'ux'],
      type: 'epic'
    },
    {
      id: '2',
      projectId: '1',
      title: 'Database Schema Design',
      description: 'Design and optimize database schema for improved performance and scalability.',
      status: 'completed',
      priority: 'high',
      progress: 100,
      estimatedHours: 32,
      actualHours: 35,
      startDate: subDays(new Date(), 28).toISOString(),
      endDate: subDays(new Date(), 22).toISOString(),
      assignees: ['2'],
      dependencies: [],
      tags: ['database', 'backend'],
      type: 'task'
    },
    {
      id: '3',
      projectId: '1',
      title: 'Frontend Components Development',
      description: 'Develop reusable React components for the new design system.',
      status: 'in-progress',
      priority: 'high',
      progress: 75,
      estimatedHours: 80,
      actualHours: 65,
      startDate: subDays(new Date(), 20).toISOString(),
      endDate: addDays(new Date(), 10).toISOString(),
      assignees: ['2', '3'],
      dependencies: ['1'],
      tags: ['frontend', 'react', 'components'],
      type: 'epic'
    },
    {
      id: '4',
      projectId: '1',
      title: 'API Integration',
      description: 'Integrate frontend with backend APIs and implement error handling.',
      status: 'pending',
      priority: 'medium',
      progress: 30,
      estimatedHours: 45,
      actualHours: 12,
      startDate: addDays(new Date(), 5).toISOString(),
      endDate: addDays(new Date(), 20).toISOString(),
      assignees: ['2'],
      dependencies: ['2', '3'],
      tags: ['api', 'integration'],
      type: 'task'
    },
    {
      id: '5',
      projectId: '1',
      title: 'Performance Optimization',
      description: 'Optimize application performance, including lazy loading and caching strategies.',
      status: 'pending',
      priority: 'medium',
      progress: 0,
      estimatedHours: 35,
      actualHours: 0,
      startDate: addDays(new Date(), 25).toISOString(),
      endDate: addDays(new Date(), 40).toISOString(),
      assignees: ['4'],
      dependencies: ['3', '4'],
      tags: ['performance', 'optimization'],
      type: 'task'
    },
    // Mobile App Tasks
    {
      id: '6',
      projectId: '2',
      title: 'Requirements Gathering',
      description: 'Define functional and non-functional requirements for mobile application.',
      status: 'in-progress',
      priority: 'high',
      progress: 60,
      estimatedHours: 25,
      actualHours: 15,
      startDate: new Date().toISOString(),
      endDate: addDays(new Date(), 10).toISOString(),
      assignees: ['2', '3'],
      dependencies: [],
      tags: ['requirements', 'planning'],
      type: 'epic'
    },
    {
      id: '7',
      projectId: '2',
      title: 'UI/UX Design',
      description: 'Create wireframes, mockups, and interactive prototypes for mobile interfaces.',
      status: 'pending',
      priority: 'high',
      progress: 0,
      estimatedHours: 60,
      actualHours: 0,
      startDate: addDays(new Date(), 12).toISOString(),
      endDate: addDays(new Date(), 35).toISOString(),
      assignees: ['3'],
      dependencies: ['6'],
      tags: ['design', 'ui', 'ux'],
      type: 'epic'
    },
    // Marketing Campaign Tasks
    {
      id: '8',
      projectId: '3',
      title: 'Campaign Strategy Development',
      description: 'Develop comprehensive marketing strategy for Q4 campaign.',
      status: 'completed',
      priority: 'high',
      progress: 100,
      estimatedHours: 30,
      actualHours: 32,
      startDate: subDays(new Date(), 90).toISOString(),
      endDate: subDays(new Date(), 80).toISOString(),
      assignees: ['5'],
      dependencies: [],
      tags: ['strategy', 'planning'],
      type: 'epic'
    },
    {
      id: '9',
      projectId: '3',
      title: 'Content Creation',
      description: 'Create marketing materials, graphics, and copy for various channels.',
      status: 'completed',
      priority: 'medium',
      progress: 100,
      estimatedHours: 50,
      actualHours: 48,
      startDate: subDays(new Date(), 75).toISOString(),
      endDate: subDays(new Date(), 45).toISOString(),
      assignees: ['5', '3'],
      dependencies: ['8'],
      tags: ['content', 'creative'],
      type: 'task'
    }
  ];

  return {
    projects,
    tasks,
    teamMembers
  };
};

export const getStatusColor = (status) => {
  const colors = {
    'not-started': 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
    'pending': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    'in-progress': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    'on-hold': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
    'completed': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    'cancelled': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    'planning': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300'
  };
  return colors[status] || colors['not-started'];
};

export const getPriorityColor = (priority) => {
  const colors = {
    'low': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    'medium': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    'high': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    'critical': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300'
  };
  return colors[priority] || colors['medium'];
};