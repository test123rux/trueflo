import React from 'react';
import { Task } from '../types/task';
import { formatTime, formatDate, formatDuration } from '../utils/dateUtils';
import { XCircle, Clock, CheckCircle, XSquare, Calendar } from 'lucide-react';

interface DailySummaryProps {
  tasks: Task[];
  onClose: () => void;
  date?: Date;
}

export default function DailySummary({ tasks, onClose, date }: DailySummaryProps) {
  const summaryDate = date || new Date();
  const dayTasks = date 
    ? tasks
    : tasks.filter(task => task.start_time.toDateString() === new Date().toDateString());

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-lg p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto m-4">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <Calendar className="text-orange-500" size={32} />
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">Daily Summary</h2>
              <p className="text-gray-400">{formatDate(summaryDate)}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <XCircle size={24} />
          </button>
        </div>

        <div className="space-y-6">
          {dayTasks.length === 0 ? (
            <p className="text-gray-400 text-center py-8">No tasks scheduled for this day</p>
          ) : (
            dayTasks.map((task) => (
              <div
                key={task.id}
                className="bg-gray-800 rounded-lg p-6 border border-gray-700"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">{task.name}</h3>
                    {task.description && (
                      <p className="text-gray-400 text-sm mb-2">{task.description}</p>
                    )}
                  </div>
                  {task.status === 'Completed' ? (
                    <CheckCircle className="text-green-500" size={24} />
                  ) : (
                    <XSquare className="text-red-500" size={24} />
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-gray-400">
                      <Clock size={16} />
                      <span>Scheduled: {formatTime(task.start_time)} - {formatTime(task.end_time)}</span>
                    </div>
                    {task.actual_start_time && (
                      <div className="flex items-center gap-2 text-gray-400">
                        <Clock size={16} />
                        <span>Started: {formatTime(task.actual_start_time)}</span>
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    {task.actual_end_time && (
                      <div className="flex items-center gap-2 text-gray-400">
                        <Clock size={16} />
                        <span>Completed: {formatTime(task.actual_end_time)}</span>
                      </div>
                    )}
                    {task.duration && (
                      <div className="flex items-center gap-2 text-green-500">
                        <Clock size={16} />
                        <span>Time Spent: {formatDuration(task.duration)}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}