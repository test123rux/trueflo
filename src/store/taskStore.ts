import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { Task, TaskInput } from '../types/task';
import { useAuthStore } from './authStore';

interface TaskState {
  tasks: Task[];
  loading: boolean;
  fetchTasks: () => Promise<void>;
  addTask: (task: TaskInput) => Promise<void>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
}

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],
  loading: false,

  fetchTasks: async () => {
    const user = useAuthStore.getState().user;
    if (!user) return;

    set({ loading: true });
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const tasks = data.map(task => ({
        ...task,
        start_time: new Date(task.start_time),
        end_time: new Date(task.end_time),
        actual_start_time: task.actual_start_time ? new Date(task.actual_start_time) : undefined,
        actual_end_time: task.actual_end_time ? new Date(task.actual_end_time) : undefined,
        created_at: new Date(task.created_at),
        updated_at: new Date(task.updated_at),
      }));

      set({ tasks });
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      set({ loading: false });
    }
  },

  addTask: async (taskInput: TaskInput) => {
    const user = useAuthStore.getState().user;
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('tasks')
        .insert([{
          ...taskInput,
          user_id: user.id,
          start_time: taskInput.start_time.toISOString(),
          end_time: taskInput.end_time.toISOString(),
          actual_start_time: taskInput.actual_start_time?.toISOString(),
          actual_end_time: taskInput.actual_end_time?.toISOString(),
        }])
        .select()
        .single();

      if (error) throw error;

      const newTask: Task = {
        ...data,
        start_time: new Date(data.start_time),
        end_time: new Date(data.end_time),
        actual_start_time: data.actual_start_time ? new Date(data.actual_start_time) : undefined,
        actual_end_time: data.actual_end_time ? new Date(data.actual_end_time) : undefined,
        created_at: new Date(data.created_at),
        updated_at: new Date(data.updated_at),
      };

      set({ tasks: [newTask, ...get().tasks] });
    } catch (error) {
      console.error('Error adding task:', error);
    }
  },

  updateTask: async (id: string, updates: Partial<Task>) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .update({
          ...updates,
          start_time: updates.start_time?.toISOString(),
          end_time: updates.end_time?.toISOString(),
          actual_start_time: updates.actual_start_time?.toISOString(),
          actual_end_time: updates.actual_end_time?.toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', id);

      if (error) throw error;

      set({
        tasks: get().tasks.map(task =>
          task.id === id
            ? { ...task, ...updates, updated_at: new Date() }
            : task
        ),
      });
    } catch (error) {
      console.error('Error updating task:', error);
    }
  },

  deleteTask: async (id: string) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id);

      if (error) throw error;

      set({ tasks: get().tasks.filter(task => task.id !== id) });
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  },
}));