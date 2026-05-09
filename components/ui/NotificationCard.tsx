import { Bell } from 'lucide-react';

interface NotificationCardProps {
  title: string;
  message: string;
  time: string;
}

export const NotificationCard = ({ title, message, time }: NotificationCardProps) => {
  return (
    <div className="flex items-start p-4 bg-gray-50 rounded-lg">
      <div className="flex-shrink-0">
        <Bell className="w-6 h-6 text-blue-500" />
      </div>
      <div className="ml-3 w-0 flex-1">
        <p className="text-sm font-medium text-gray-900">{title}</p>
        <p className="mt-1 text-sm text-gray-500">{message}</p>
        <p className="mt-1 text-xs text-gray-400">{time}</p>
      </div>
    </div>
  );
};
