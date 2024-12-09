export type Priority = 'High' | 'Medium' | 'Low';
export type Category = 'Work' | 'Personal';
export type TaskStatus = 'Pending' | 'In Progress' | 'Completed';

export interface Task {
  id: string;
  user_id: string;
  name: string;
  start_time: Date;
  end_time: Date;
  priority: Priority;
  description?: string;
  category: Category;
  status: TaskStatus;
  created_at: Date;
  updated_at: Date;
  actual_start_time?: Date;
  actual_end_time?: Date;
  duration?: number;
}

export type TaskInput = Omit<Task, 'id' | 'user_id' | 'created_at' | 'updated_at'>;