import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Task, Priority, Category, TaskStatus } from '../types/task';
import { roundToNearest15Minutes } from '../utils/dateUtils';

interface TaskFormProps {
  onSubmit: (task: Omit<Task, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => void;
}

export default function TaskForm({ onSubmit }: TaskFormProps) {
  const [name, setName] = useState('');
  const [startTime, setStartTime] = useState(roundToNearest15Minutes(new Date()));
  const [endTime, setEndTime] = useState(roundToNearest15Minutes(new Date(startTime.getTime() + 30 * 60000)));
  const [priority, setPriority] = useState<Priority>('Medium');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<Category>('Work');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name,
      start_time: startTime,
      end_time: endTime,
      priority,
      description,
      category,
      status: 'Pending',
    });
    setName('');
    setDescription('');
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-800 p-6 rounded-lg shadow-xl">
      <h2 className="text-2xl font-bold mb-6 text-white">New Task</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-orange-400 mb-2">Task Name</label>
          <input
            type="text"
            maxLength={50}
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-gray-700 text-white rounded px-4 py-2 focus:ring-2 focus:ring-orange-500 focus:outline-none"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-orange-400 mb-2">Start Time</label>
            <input
              type="datetime-local"
              value={startTime.toISOString().slice(0, 16)}
              onChange={(e) => setStartTime(new Date(e.target.value))}
              className="w-full bg-gray-700 text-white rounded px-4 py-2 focus:ring-2 focus:ring-orange-500 focus:outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-orange-400 mb-2">End Time</label>
            <input
              type="datetime-local"
              value={endTime.toISOString().slice(0, 16)}
              onChange={(e) => setEndTime(new Date(e.target.value))}
              className="w-full bg-gray-700 text-white rounded px-4 py-2 focus:ring-2 focus:ring-orange-500 focus:outline-none"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-orange-400 mb-2">Priority</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as Priority)}
              className="w-full bg-gray-700 text-white rounded px-4 py-2 focus:ring-2 focus:ring-orange-500 focus:outline-none"
            >
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
          <div>
            <label className="block text-orange-400 mb-2">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as Category)}
              className="w-full bg-gray-700 text-white rounded px-4 py-2 focus:ring-2 focus:ring-orange-500 focus:outline-none"
            >
              <option value="Work">Work</option>
              <option value="Personal">Personal</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-orange-400 mb-2">Description (Optional)</label>
          <textarea
            maxLength={200}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full bg-gray-700 text-white rounded px-4 py-2 focus:ring-2 focus:ring-orange-500 focus:outline-none"
            rows={3}
          />
        </div>

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-2 px-4 rounded-lg
            hover:from-orange-600 hover:to-orange-700 transform hover:scale-[1.02] transition-all duration-200
            flex items-center justify-center gap-2"
        >
          <Plus size={20} />
          Add Task
        </button>
      </div>
    </form>
  );
}