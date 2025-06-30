import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { format, addDays, differenceInDays, startOfMonth, endOfMonth } from 'date-fns';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useProject } from '../../context/ProjectContext';
import { getStatusColor } from '../../utils/mockData';

const { FiLink } = FiIcons;

const GanttChart = ({ tasks }) => {
  const { teamMembers } = useProject();

  const ganttData = useMemo(() => {
    if (!tasks || tasks.length === 0) return { tasks: [], timeline: [], startDate: new Date(), endDate: new Date() };

    const sortedTasks = [...tasks].sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
    const startDate = startOfMonth(new Date(sortedTasks[0].startDate));
    const endDate = endOfMonth(new Date(sortedTasks[sortedTasks.length - 1].endDate));
    
    const totalDays = differenceInDays(endDate, startDate);
    const timeline = Array.from({ length: totalDays + 1 }, (_, i) => addDays(startDate, i));

    const processedTasks = sortedTasks.map(task => {
      const taskStart = new Date(task.startDate);
      const taskEnd = new Date(task.endDate);
      const startOffset = differenceInDays(taskStart, startDate);
      const duration = differenceInDays(taskEnd, taskStart) + 1;
      const progress = task.progress || 0;

      const assignees = teamMembers.filter(member => 
        task.assignees.includes(member.id)
      );

      return {
        ...task,
        startOffset,
        duration,
        progress,
        assignees,
        isOverdue: taskEnd < new Date() && task.status !== 'completed'
      };
    });

    return {
      tasks: processedTasks,
      timeline,
      startDate,
      endDate,
      totalDays
    };
  }, [tasks, teamMembers]);

  if (!tasks || tasks.length === 0) {
    return (
      <div className="text-center py-12">
        <SafeIcon icon={FiLink} className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          No tasks to display
        </h3>
        <p className="text-gray-500 dark:text-gray-400">
          Add some tasks to see the Gantt chart.
        </p>
      </div>
    );
  }

  const { tasks: processedTasks, timeline, totalDays } = ganttData;
  const dayWidth = Math.max(30, Math.min(60, 1200 / totalDays));

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="flex">
        {/* Task Names Column */}
        <div className="w-80 bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700">
          <div className="h-12 bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center px-4">
            <h3 className="font-semibold text-gray-900 dark:text-white">Tasks</h3>
          </div>
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {processedTasks.map((task) => (
              <div key={task.id} className="h-16 flex items-center px-4 hover:bg-gray-100 dark:hover:bg-gray-800">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {task.title}
                    </h4>
                    {task.dependencies && task.dependencies.length > 0 && (
                      <SafeIcon icon={FiLink} className="w-3 h-3 text-gray-400" />
                    )}
                  </div>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                      {task.status.replace('-', ' ')}
                    </span>
                    <div className="flex -space-x-1">
                      {task.assignees.slice(0, 2).map(assignee => (
                        <img
                          key={assignee.id}
                          src={assignee.avatar}
                          alt={assignee.name}
                          className="w-4 h-4 rounded-full border border-white dark:border-gray-800"
                          title={assignee.name}
                        />
                      ))}
                      {task.assignees.length > 2 && (
                        <div className="w-4 h-4 rounded-full bg-gray-300 dark:bg-gray-600 border border-white dark:border-gray-800 flex items-center justify-center">
                          <span className="text-xs text-gray-600 dark:text-gray-300">
                            +{task.assignees.length - 2}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Gantt Timeline */}
        <div className="flex-1 overflow-x-auto gantt-timeline">
          <div style={{ width: timeline.length * dayWidth }}>
            {/* Timeline Header */}
            <div className="h-12 bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex">
              {timeline.map((date, index) => (
                <div
                  key={index}
                  className="border-r border-gray-200 dark:border-gray-700 flex items-center justify-center text-xs text-gray-600 dark:text-gray-400"
                  style={{ width: dayWidth, minWidth: dayWidth }}
                >
                  {index % 7 === 0 && (
                    <div className="text-center">
                      <div className="font-medium">{format(date, 'MMM')}</div>
                      <div>{format(date, 'd')}</div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Gantt Bars */}
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {processedTasks.map((task, taskIndex) => (
                <div key={task.id} className="h-16 relative flex items-center">
                  {/* Background grid */}
                  <div className="absolute inset-0 flex">
                    {timeline.map((_, index) => (
                      <div
                        key={index}
                        className="border-r border-gray-100 dark:border-gray-800"
                        style={{ width: dayWidth, minWidth: dayWidth }}
                      />
                    ))}
                  </div>

                  {/* Task bar */}
                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.5, delay: taskIndex * 0.1 }}
                    className={`absolute h-6 rounded-lg gantt-bar ${
                      task.isOverdue ? 'bg-red-500' : 'bg-primary-500'
                    } shadow-sm`}
                    style={{
                      left: task.startOffset * dayWidth + 4,
                      width: Math.max(task.duration * dayWidth - 8, 20)
                    }}
                  >
                    {/* Progress indicator */}
                    <div
                      className="h-full bg-white bg-opacity-30 rounded-lg"
                      style={{ width: `${task.progress}%` }}
                    />
                    
                    {/* Task info tooltip */}
                    <div className="absolute top-full left-0 mt-1 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <div className="bg-gray-900 text-white text-xs rounded px-2 py-1 whitespace-nowrap">
                        {task.title} - {task.progress}%
                      </div>
                    </div>
                  </motion.div>

                  {/* Milestone indicators */}
                  {task.type === 'epic' && (
                    <div
                      className="absolute w-3 h-3 bg-yellow-500 transform rotate-45"
                      style={{
                        left: task.startOffset * dayWidth - 6,
                        top: '50%',
                        marginTop: -6
                      }}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="px-4 py-3 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-6 text-xs">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-2 bg-primary-500 rounded"></div>
            <span className="text-gray-600 dark:text-gray-400">On Track</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-2 bg-red-500 rounded"></div>
            <span className="text-gray-600 dark:text-gray-400">Overdue</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-yellow-500 transform rotate-45"></div>
            <span className="text-gray-600 dark:text-gray-400">Epic/Milestone</span>
          </div>
          <div className="flex items-center space-x-2">
            <SafeIcon icon={FiLink} className="w-3 h-3 text-gray-400" />
            <span className="text-gray-600 dark:text-gray-400">Has Dependencies</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GanttChart;