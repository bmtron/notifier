import type {
  ReminderApiResponse,
  Reminder,
  CreateReminderResult,
} from '../../utils/models/Reminder';
import { transformReminderFromApi } from '../../utils/models/Reminder';

import { createItem } from './createItem';

export const createReminder = async (reminder: Reminder): Promise<CreateReminderResult> => {
  const result = await createItem<ReminderApiResponse>(reminder, '/api/reminders');
  if (!result.success || !result.data) {
    return {
      success: false,
      error: `Failed to create reminder: ${result.error ? result.error : ''}`,
    };
  } else {
    return {
      data: transformReminderFromApi(result.data),
      success: true,
    };
  }
};
