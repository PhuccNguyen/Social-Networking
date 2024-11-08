import { useEffect, useState } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:4001'); // Make sure this matches your server URL

function NotificationComponent({ userId }) {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Register user when connected
    socket.emit('registerUser', userId);

    // Listen for new notifications
    socket.on('newNotification', (notification) => {
      setNotifications((prev) => [notification, ...prev]);
      alert(notification.message); // Display alert or customize UI as desired
    });

    return () => {
      socket.off('newNotification');
    };
  }, [userId]);

  return (
    <div className="notifications">
      {notifications.map((notification, index) => (
        <div key={index} className="notification">
          {notification.message}
        </div>
      ))}
    </div>
  );
}

export default NotificationComponent;
