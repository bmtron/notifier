export interface Notification {
  id: string;
  title: string;
  message: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  isRead: boolean;
  type: NotificationType;
}

export enum NotificationType {
  SYSTEM = 'SYSTEM',
  USER = 'USER',
  ALERT = 'ALERT',
}

// Example of extending the base interface
export interface SystemNotification extends Notification {
  type: NotificationType.SYSTEM;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
}

// lol idk what this is, I think this is just some sort of AI hallucination
