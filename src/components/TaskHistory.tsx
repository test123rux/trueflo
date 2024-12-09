import React from 'react';
import { Task } from '../types/task';
import { formatDate } from '../utils/dateUtils';
import DailySummary from './DailySummary';

interface TaskHistoryProps {
  tasks: Task[];
}

export default function TaskHistory({ tasks }: TaskHistoryProps) {
  const [selectedDate, setSelectedDate] = React.useState<string | null>(null);

  // Group tasks by date
  const tasksByDate = tasks.reduce((acc: { [key: string]: Task[] }, task) => {
    const dateKey = task.start_time.toDateString();
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(task);
    return acc;
  }, {});

  // Sort dates in reverse chronological order
  const dates = Object.keys(tasksByDate).sort((a, b) => 
    new Date(b).getTime() - new Date(a).getTime()
  );

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <h2 className="text-2xl font-bold text-white mb-6">Task History</h2>
      
      <div className="space-y-4">
        {dates.map((date) => {
          const dayTasks = tasksByDate[date];
          const completedTasks = dayTasks.filter(t => t.status === 'Completed');
          const totalTasks = dayTasks.length;
          
          return (
            <button
              key={date}
              onClick={() => setSelectedDate(date)}
              className="w-full bg-gray-700 rounded-lg p-4 hover:bg-gray-600 transition-colors
                text-left group border border-transparent hover:border-orange-500"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold text-white">{formatDate(new Date(date))}</h3>
                  <p className="text-gray-400 text-sm">
                    {completedTasks.length} of {totalTasks} tasks completed
                  </p>
                </div>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-orange-500 text-sm">View Summary →</span>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {selectedDate && (
        <DailySummary
          date={new Date(selectedDate)}
          tasks={tasksByDate[selectedDate]}
          onClose={() => setSelectedDate(null)}
        />
      )}
    </div>
  );
}