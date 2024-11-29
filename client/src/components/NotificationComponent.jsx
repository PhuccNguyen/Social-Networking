import { useEffect, useState } from "react";
import io from "socket.io-client";
import { useDispatch } from "react-redux";
import { setNotifications } from "state";
import "./NotificationComponent.css";

const socket = io("http://localhost:3001");

function NotificationComponent({ userId }) {
  const dispatch = useDispatch();
  const [notifications, setNotificationsLocal] = useState([]); // Local state for notifications

  useEffect(() => {
    if (userId) {
      socket.emit("registerUser", userId); // Register user for notifications
      console.log(`User ${userId} registered for notifications`);

      // Listen for incoming notifications
      socket.on("notification", (data) => {
        console.log("Received notification:", data);
        setNotificationsLocal((prev) => [...prev, data]);
        dispatch(setNotifications({ notifications: [...notifications, data] })); // Persist in Redux
      });
    }

    // Cleanup when component unmounts
    return () => {
      socket.off("notification");
      socket.disconnect();
    };
  }, [userId, dispatch]);

  return (
    <div className="notification-container">
      {notifications.map((notification, index) => (
        <div key={index} className="notification-item">
          <p>{notification.message}</p>
        </div>
      ))}
    </div>
  );
}

export default NotificationComponent;
