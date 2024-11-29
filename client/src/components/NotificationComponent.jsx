import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setNotifications } from 'state'; // Redux action to set notifications

const NotificationComponent = ({ userId }) => {
  const dispatch = useDispatch();
  const notifications = useSelector((state) => state.auth.notifications); // Access notifications from Redux store

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch(`http://localhost:3001/notifications/${userId}`);
        const data = await response.json();
        dispatch(setNotifications({ notifications: data })); // Dispatch action to update Redux store with notifications
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();
  }, [userId, dispatch]);

  return (
    <div>
      {notifications && notifications.length > 0 ? (
        notifications.map((notif) => (
          <div key={notif._id}>
            <p>{notif.message}</p>
            <small>{new Date(notif.createdAt).toLocaleString()}</small>
          </div>
        ))
      ) : (
        <p>No new notifications</p>
      )}
    </div>
  );
};

export default NotificationComponent;
