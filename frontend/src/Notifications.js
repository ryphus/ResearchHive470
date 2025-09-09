import React, { useEffect, useState } from 'react';
import { Drawer, IconButton, Badge, List, ListItem, ListItemText, Button } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';

function Notifications({ user }) {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (!user) return;
    fetch(`http://localhost:5000/api/notifications/${user.id}`)
      .then(res => res.json())
      .then(setNotifications);
  }, [user, open]);

  const markAsRead = async (id) => {
    await fetch(`http://localhost:5000/api/notifications/${id}/read`, { method: 'PUT' });
    setNotifications(notifications.map(n => n._id === id ? { ...n, read: true } : n));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <>
      <IconButton color="inherit" onClick={() => setOpen(true)}>
        <Badge badgeContent={unreadCount} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>
      <Drawer anchor="right" open={open} onClose={() => setOpen(false)}>
        <List sx={{ width: 350 }}>
          <ListItem>
            <ListItemText primary="Notifications" />
          </ListItem>
          {notifications.length === 0 && (
            <ListItem>
              <ListItemText primary="No notifications." />
            </ListItem>
          )}
          {notifications.map(n => (
            <ListItem key={n._id} sx={{ bgcolor: n.read ? '#f5f5f5' : '#e3f2fd' }}>
              <ListItemText
                primary={n.message}
                secondary={new Date(n.createdAt).toLocaleString()}
              />
              {!n.read && (
                <Button size="small" onClick={() => markAsRead(n._id)}>Mark as read</Button>
              )}
            </ListItem>
          ))}
        </List>
      </Drawer>
    </>
  );
}

export default Notifications;