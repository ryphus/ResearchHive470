import React, { useEffect, useState } from 'react';
import { Container, Paper, Typography, Button, Box, Modal, TextField, MenuItem } from '@mui/material';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const locales = {
  'en-US': require('date-fns/locale/en-US')
};
const localizer = dateFnsLocalizer({
  format, parse, startOfWeek, getDay, locales
});

const eventTypes = [
  { value: 'conference', label: 'Conference' },
  { value: 'seminar', label: 'Seminar' },
  { value: 'workshop', label: 'Workshop' },
  { value: 'deadline', label: 'Deadline' },
  { value: 'other', label: 'Other' }
];

function Events({ user }) {
  const [events, setEvents] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({
    title: '', description: '', location: '', start: '', end: '', type: 'other'
  });
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Fetch only this user's events
  useEffect(() => {
    fetch(`http://localhost:5000/api/events/user/${user.id}`)
      .then(res => res.json())
      .then(data => setEvents(data
        .filter(ev => ev.createdBy._id === user.id || ev.createdBy === user.id)
        .map(ev => ({
          ...ev,
          start: new Date(ev.start),
          end: new Date(ev.end)
        }))
      ));
  }, [user.id]);

  // Handle calendar slot selection for event creation
  const handleSelectSlot = ({ start, end }) => {
    setForm({ ...form, start, end });
    setModalOpen(true);
    setSelectedEvent(null);
  };

  // Handle event creation form input
  const handleInputChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Create event
  const handleSubmit = async e => {
    e.preventDefault();
    const eventData = {
      ...form,
      createdBy: user.id,
      start: new Date(form.start),
      end: new Date(form.end)
    };
    const res = await fetch('http://localhost:5000/api/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(eventData)
    });
    const data = await res.json();
    setEvents([...events, { ...data, start: new Date(data.start), end: new Date(data.end) }]);
    setModalOpen(false);
    setForm({ title: '', description: '', location: '', start: '', end: '', type: 'other' });
  };

  // Show event details and delete option
  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
    setModalOpen(true);
  };

  // Delete event
  const handleDelete = async () => {
    if (!selectedEvent) return;
    await fetch(`http://localhost:5000/api/events/${selectedEvent._id}`, {
      method: 'DELETE'
    });
    setEvents(events.filter(ev => ev._id !== selectedEvent._id));
    setModalOpen(false);
    setSelectedEvent(null);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 6 }}>
      <Paper elevation={4} sx={{ p: 4, borderRadius: 3 }}>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          My Research Calendar
        </Typography>
        <Button variant="contained" color="primary" sx={{ mb: 2 }} onClick={() => { setModalOpen(true); setSelectedEvent(null); }}>
          Create Event
        </Button>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 600 }}
          selectable
          onSelectSlot={handleSelectSlot}
          onSelectEvent={handleSelectEvent}
        />
      </Paper>

      {/* Event Creation or Detail Modal */}
      <Modal open={modalOpen} onClose={() => { setModalOpen(false); setSelectedEvent(null); }}>
        <Box sx={{
          position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
          width: 420, bgcolor: 'background.paper', boxShadow: 24, p: 4, borderRadius: 2
        }}>
          {!selectedEvent ? (
            <>
              <Typography variant="h6" mb={2}>Create Event</Typography>
              <form onSubmit={handleSubmit}>
                <TextField
                  label="Title" name="title" value={form.title} onChange={handleInputChange}
                  fullWidth required sx={{ mb: 2 }}
                />
                <TextField
                  label="Description" name="description" value={form.description} onChange={handleInputChange}
                  fullWidth multiline rows={2} sx={{ mb: 2 }}
                />
                <TextField
                  label="Location" name="location" value={form.location} onChange={handleInputChange}
                  fullWidth sx={{ mb: 2 }}
                />
                <TextField
                  label="Start" name="start" type="datetime-local"
                  value={form.start ? format(new Date(form.start), "yyyy-MM-dd'T'HH:mm") : ''}
                  onChange={e => setForm({ ...form, start: e.target.value })}
                  fullWidth required sx={{ mb: 2 }}
                  InputLabelProps={{ shrink: true }}
                />
                <TextField
                  label="End" name="end" type="datetime-local"
                  value={form.end ? format(new Date(form.end), "yyyy-MM-dd'T'HH:mm") : ''}
                  onChange={e => setForm({ ...form, end: e.target.value })}
                  fullWidth required sx={{ mb: 2 }}
                  InputLabelProps={{ shrink: true }}
                />
                <TextField
                  select label="Type" name="type" value={form.type} onChange={handleInputChange}
                  fullWidth sx={{ mb: 2 }}
                >
                  {eventTypes.map(opt => (
                    <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                  ))}
                </TextField>
                <Button type="submit" variant="contained" color="primary" fullWidth>
                  Create
                </Button>
              </form>
            </>
          ) : (
            <>
              <Typography variant="h5" fontWeight={700}>{selectedEvent.title}</Typography>
              <Typography variant="subtitle1" color="text.secondary">{selectedEvent.type}</Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>{selectedEvent.description}</Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>Location: {selectedEvent.location}</Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                {format(new Date(selectedEvent.start), 'PPpp')} - {format(new Date(selectedEvent.end), 'PPpp')}
              </Typography>
              <Button variant="contained" color="error" fullWidth sx={{ mt: 3 }} onClick={handleDelete}>
                Delete Event
              </Button>
              <Button variant="outlined" color="secondary" fullWidth sx={{ mt: 1 }} onClick={() => { setModalOpen(false); setSelectedEvent(null); }}>
                Close
              </Button>
            </>
          )}
        </Box>
      </Modal>
    </Container>
  );
}

export default Events;