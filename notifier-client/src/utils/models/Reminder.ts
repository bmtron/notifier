export interface Reminder {
  reminderId: number | null;
  userId: number;
  title: string;
  notes: string;
  expiration: Date;
  repeated: boolean;
  repeatPattern: string;
  completed: boolean;
  deleted: boolean;
  createdAt: Date | null;
  updatedAt: Date | null;
}

export interface CreateReminderResult {
  success: boolean;
  data?: Reminder;
  error?: string;
}

export interface GetRemindersResult {
  success: boolean;
  data?: Reminder[];
  error?: string;
}

export interface UpdateReminderResult {
  success: boolean;
  data?: Reminder;
  error?: string;
}

export interface ReminderApiResponse {
  reminder_id: number | null;
  user_id: number;
  title: string;
  notes: string;
  expiration: Date;
  repeated: boolean;
  repeat_pattern: string;
  completed: boolean;
  deleted: boolean;
  created_at: Date | null;
  updated_at: Date | null;
}

export const transformReminderFromApi = (data: ReminderApiResponse): Reminder => ({
  reminderId: data.reminder_id,
  userId: data.user_id,
  title: data.title,
  notes: data.notes,
  expiration: data.expiration,
  repeated: data.repeated,
  repeatPattern: data.repeat_pattern,
  completed: data.completed,
  deleted: data.deleted,
  createdAt: data.created_at,
  updatedAt: data.updated_at,
});
