import React, { useEffect, useState } from 'react';
import { Task } from './types/task';
import TaskForm from './components/TaskForm';
import TaskCard from './components/TaskCard';
import Timeline from './components/Timeline';
import ActiveTaskWidget from './components/ActiveTaskWidget';
import CompletedTasks from './components/CompletedTasks';
import DailySummary from './components/DailySummary';
import TaskHistory from './components/TaskHistory';
import { Clock, LogOut, LayoutGrid, History } from 'lucide-react';
import { useAuthStore } from './store/authStore';
import { useTaskStore } from './store/taskStore';

function App() {
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [showSummary, setShowSummary] = useState(false);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'history'>('dashboard');
  const { signOut } = useAuthStore();
  const { tasks, fetchTasks, addTask, updateTask, deleteTask } = useTaskStore();

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleAddTask = async (taskInput: Omit<Task, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    await addTask(taskInput);
  };

  const handleStatusChange = async (id: string, status: Task['status']) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    if (status === 'In Progress') {
      if (activeTask) {
        alert('Please complete the current active task first!');
        return;
      }
      const updates = {
        status,
        actual_start_time: new Date(),
      };
      await updateTask(id, updates);
      setActiveTask({ ...task, ...updates });
    } else {
      await updateTask(id, { status });
    }
  };

  const handleCompleteTask = async (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task || !task.actual_start_time) return;

    const now = new Date();
    const duration = Math.floor((now.getTime() - task.actual_start_time.getTime()) / 1000);

    const updates = {
      status: 'Completed' as const,
      actual_end_time: now,
      duration,
    };

    await updateTask(taskId, updates);
    setActiveTask(null);

    alert(`Task completed! Duration: ${Math.floor(duration / 3600)}h ${Math.floor((duration % 3600) / 60)}m ${duration % 60}s`);
  };

  const handleDeleteTask = async (id: string) => {
    if (activeTask?.id === id) {
      setActiveTask(null);
    }
    await deleteTask(id);
  };

  const todaysTasks = tasks.filter(task => 
    task.start_time.toDateString() === new Date().toDateString()
  );

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="bg-gray-800 border-b border-gray-700">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Clock className="text-orange-500" size={32} />
              <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
                TrueFlo
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex bg-gray-700 rounded-lg p-1">
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors
                    ${activeTab === 'dashboard' 
                      ? 'bg-orange-500 text-white' 
                      : 'text-gray-400 hover:text-white'}`}
                >
                  <LayoutGrid size={20} />
                  Dashboard
                </button>
                <button
                  onClick={() => setActiveTab('history')}
                  className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors
                    ${activeTab === 'history' 
                      ? 'bg-orange-500 text-white' 
                      : 'text-gray-400 hover:text-white'}`}
                >
                  <History size={20} />
                  History
                </button>
              </div>
              <button
                onClick={() => setShowSummary(true)}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg
                  transform hover:scale-[1.02] transition-all duration-200
                  flex items-center gap-2"
              >
                <LogOut size={20} />
                End Session
              </button>
              <button
                onClick={signOut}
                className="text-gray-400 hover:text-white px-4 py-2 rounded-lg transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {activeTab === 'dashboard' ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              {activeTask && (
                <div className="mb-8">
                  <ActiveTaskWidget
                    task={activeTask}
                    onComplete={handleCompleteTask}
                  />
                </div>
              )}
              
              <Timeline tasks={todaysTasks} />
              
              <div className="mt-8">
                <CompletedTasks tasks={tasks} />
              </div>

              <div className="mt-8 grid sm:grid-cols-2 gap-6">
                {tasks
                  .filter(task => task.status === 'Pending')
                  .map(task => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onStatusChange={handleStatusChange}
                      onDelete={handleDeleteTask}
                    />
                  ))}
              </div>
            </div>

            <div className="lg:col-span-1">
              <TaskForm onSubmit={handleAddTask} />
            </div>
          </div>
        ) : (
          <TaskHistory tasks={tasks} />
        )}
      </main>

      {showSummary && (
        <DailySummary
          tasks={tasks}
          onClose={() => setShowSummary(false)}
        />
      )}
    </div>
  );
}

export default App;