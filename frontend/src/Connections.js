import React, { useEffect, useState, useRef } from 'react';

function Connections({ user }) {
  const [search, setSearch] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [users, setUsers] = useState([]);
  const [connections, setConnections] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const inputRef = useRef(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const usersRes = await fetch('http://localhost:5000/api/user/all'); // haramzada route
        const usersData = await usersRes.json();
        setUsers(usersData);

        const connRes = await fetch(`http://localhost:5000/api/connections/${user.id}`);
        const connData = await connRes.json();
        setConnections(connData.filter(c => c && c.requester && c.recipient)); // Store all connections
        setRequests(connData.filter(c => c.status === 'pending' && c.recipient._id === user.id));
      } catch (err) {
        setMsg('Error loading data');
      }
      setLoading(false);
    }
    fetchData();
  }, [user]);

  // Live search suggestions (match anywhere in name or email)
  useEffect(() => {
    if (search.length === 0) {
      setSuggestions([]);
      setSelectedUser(null);
      return;
    }
    const filtered = users.filter(u =>
      (u.name.toLowerCase().includes(search.toLowerCase()) ||
       u.email.toLowerCase().includes(search.toLowerCase())) &&
      u._id !== user.id
    );
    setSuggestions(filtered.slice(0, 5));
  }, [search, users, user.id]);

  // Check if already connected or pending
  const getConnectionStatus = (otherId) => {
    // Connected
    if (connections.some(c =>
      c &&
      c.status === 'accepted' &&
      ((c.requester._id === user.id && c.recipient._id === otherId) ||
       (c.recipient._id === user.id && c.requester._id === otherId))
    )) return 'connected';

    // Request sent by you, pending
    if (connections.some(c =>
      c &&
      c.status === 'pending' &&
      c.requester._id === user.id &&
      c.recipient._id === otherId
    )) return 'sent';

    // Incoming request from them, pending
    if (connections.some(c =>
      c &&
      c.status === 'pending' &&
      c.requester._id === otherId &&
      c.recipient._id === user.id
    )) return 'incoming';

    return 'none';
  };

  const sendRequest = async (recipientId) => {
    setMsg('');
    const res = await fetch('http://localhost:5000/api/connections/request', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ requesterId: user.id, recipientId })
    });
    if (res.ok) {
      setMsg('Connection request sent!');
      setSelectedUser(null);
      setSearch('');
      setSuggestions([]);
      inputRef.current && inputRef.current.focus();
    } else {
      const err = await res.json();
      setMsg(err.message || 'Error sending request');
    }
  };

  const acceptRequest = async (connectionId) => {
    const res = await fetch('http://localhost:5000/api/connections/accept', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ connectionId })
    });
    if (res.ok) {
      // Remove from requests and add to connections
      setRequests(prev => prev.filter(r => r._id !== connectionId));
      // Fetch updated connections
      const connRes = await fetch(`http://localhost:5000/api/connections/${user.id}`);
      const connData = await connRes.json();
      setConnections(connData.filter(c => c && c.requester && c.recipient)); // Store all connections
    }
  };

  const rejectRequest = async (connectionId) => {
    const res = await fetch('http://localhost:5000/api/connections/reject', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ connectionId })
    });
    if (res.ok) {
      // Remove from requests
      setRequests(prev => prev.filter(r => r._id !== connectionId));
    }
  };

  const removeConnection = async (connectionId) => {
    await fetch(`http://localhost:5000/api/connections/${connectionId}`, {
      method: 'DELETE'
    });
    setConnections(prev => prev.filter(c => c._id !== connectionId));
  };

  // Search button handler
  const handleSearch = () => {
    if (!search.trim()) return;
    const found = users.filter(u =>
      (u.name.toLowerCase().includes(search.toLowerCase()) ||
       u.email.toLowerCase().includes(search.toLowerCase())) &&
      u._id !== user.id
    );
    setSuggestions(found);
    setSelectedUser(null); // Clear selected user so list shows
  };

  // Handle Enter key for search
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div style={{
      maxWidth: 900,
      margin: '40px auto',
      background: '#f9fafb',
      borderRadius: 12,
      boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
      padding: 32
    }}>
      <h2 style={{ marginBottom: 24, color: '#2d3748', fontWeight: 700, fontSize: 32 }}>Connections</h2>
      <div style={{ marginBottom: 32, position: 'relative' }}>
        <input
          ref={inputRef}
          type="text"
          placeholder="Search researchers by name or email"
          value={search}
          onChange={e => {
            setSearch(e.target.value);
            setMsg('');
          }}
          onKeyDown={handleKeyDown}
          style={{
            padding: '12px 16px',
            borderRadius: 6,
            border: '1px solid #cbd5e1',
            width: '100%',
            maxWidth: 350,
            fontSize: 16
          }}
          autoComplete="off"
        />
        <button
          onClick={handleSearch}
          style={{
            marginLeft: 12,
            padding: '12px 24px',
            background: '#3182ce',
            color: '#fff',
            border: 'none',
            borderRadius: 6,
            fontWeight: 600,
            cursor: 'pointer'
          }}
        >
          Search
        </button>
        {suggestions.length > 0 && (
          <div style={{ marginTop: 16 }}>
            {suggestions.map(u => (
              <div key={u._id} style={{
                background: '#fff',
                borderRadius: 8,
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                padding: 24,
                marginBottom: 16,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div>
                  <strong style={{ fontSize: 18 }}>{u.name}</strong>
                  <div style={{ color: '#718096', fontSize: 15 }}>{u.email}</div>
                </div>
                {getConnectionStatus(u._id) === 'none' && (
                  <button
                    onClick={() => sendRequest(u._id)}
                    style={{
                      background: '#3182ce',
                      color: '#fff',
                      border: 'none',
                      borderRadius: 6,
                      padding: '10px 24px',
                      fontWeight: 600,
                      fontSize: 16,
                      cursor: 'pointer'
                    }}
                  >
                    Send Request
                  </button>
                )}
                {getConnectionStatus(u._id) === 'sent' && (
                  <span style={{
                    background: '#f6ad55',
                    color: '#fff',
                    borderRadius: 6,
                    padding: '10px 24px',
                    fontWeight: 600,
                    fontSize: 16,
                    display: 'inline-block'
                  }}>
                    Request Sent
                  </span>
                )}
                {getConnectionStatus(u._id) === 'incoming' && (
                  <span style={{
                    background: '#ecc94b',
                    color: '#fff',
                    borderRadius: 6,
                    padding: '10px 24px',
                    fontWeight: 600,
                    fontSize: 16,
                    display: 'inline-block'
                  }}>
                    Incoming Request
                  </span>
                )}
                {getConnectionStatus(u._id) === 'connected' && (
                  <span style={{
                    background: '#38a169',
                    color: '#fff',
                    borderRadius: 6,
                    padding: '10px 24px',
                    fontWeight: 600,
                    fontSize: 16,
                    display: 'inline-block'
                  }}>
                    Connected
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      {msg && <div style={{ color: '#3182ce', marginBottom: 16 }}>{msg}</div>}
      {selectedUser && (
        <div style={{
          background: '#fff',
          borderRadius: 8,
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
          padding: 24,
          marginBottom: 32,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div>
            <strong style={{ fontSize: 18 }}>{selectedUser.name}</strong>
            <div style={{ color: '#718096', fontSize: 15 }}>{selectedUser.email}</div>
          </div>
          {getConnectionStatus(selectedUser._id) === 'none' && (
            <button
              onClick={() => sendRequest(selectedUser._id)}
              style={{
                background: '#3182ce',
                color: '#fff',
                border: 'none',
                borderRadius: 6,
                padding: '10px 24px',
                fontWeight: 600,
                fontSize: 16,
                cursor: 'pointer'
              }}
            >
              Send Request
            </button>
          )}
          {getConnectionStatus(selectedUser._id) === 'sent' && (
            <span style={{
              background: '#f6ad55',
              color: '#fff',
              borderRadius: 6,
              padding: '10px 24px',
              fontWeight: 600,
              fontSize: 16,
              display: 'inline-block'
            }}>
              Request Sent
            </span>
          )}
          {getConnectionStatus(selectedUser._id) === 'incoming' && (
            <span style={{
              background: '#ecc94b',
              color: '#fff',
              borderRadius: 6,
              padding: '10px 24px',
              fontWeight: 600,
              fontSize: 16,
              display: 'inline-block'
            }}>
              Incoming Request
            </span>
          )}
          {getConnectionStatus(selectedUser._id) === 'connected' && (
            <span style={{
              background: '#38a169',
              color: '#fff',
              borderRadius: 6,
              padding: '10px 24px',
              fontWeight: 600,
              fontSize: 16,
              display: 'inline-block'
            }}>
              Connected
            </span>
          )}
        </div>
      )}

      <section style={{ marginBottom: 32 }}>
        <h3 style={{ color: '#4a5568', marginBottom: 18, fontSize: 22 }}>Pending Requests</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
          {requests.length === 0 && <div style={{ color: '#718096' }}>No pending requests.</div>}
          {requests
            .filter(r => r.requester && r.recipient)
            .map(r => (
              <div key={r._id} style={{
                background: '#fff',
                borderRadius: 8,
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                padding: 18,
                minWidth: 260,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start'
              }}>
                <strong style={{ fontSize: 17 }}>{r.requester.name}</strong>
                <span style={{ color: '#718096', fontSize: 14 }}>{r.requester.email}</span>
                <div style={{ marginTop: 12 }}>
                  <button
                    onClick={() => acceptRequest(r._id)}
                    style={{
                      background: '#38a169',
                      color: '#fff',
                      border: 'none',
                      borderRadius: 6,
                      padding: '7px 18px',
                      marginRight: 8,
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => rejectRequest(r._id)}
                    style={{
                      background: '#e53e3e',
                      color: '#fff',
                      border: 'none',
                      borderRadius: 6,
                      padding: '7px 18px',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
        </div>
      </section>

      <section>
        <h3 style={{ color: '#4a5568', marginBottom: 18, fontSize: 22 }}>Your Connections</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
          {connections.filter(c => c.status === 'accepted').length === 0 && (
            <div style={{ color: '#718096' }}>No connections yet.</div>
          )}
          {connections.filter(c => c.status === 'accepted').map(c => {
            const other = c.requester._id === user.id ? c.recipient : c.requester;
            return (
              <div key={c._id} style={{
                background: '#fff',
                borderRadius: 8,
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                padding: 18,
                minWidth: 260,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start'
              }}>
                <strong style={{ fontSize: 17 }}>{other.name}</strong>
                <span style={{ color: '#718096', fontSize: 14 }}>{other.email}</span>
                <button
                  onClick={() => removeConnection(c._id)}
                  style={{
                    background: '#e53e3e',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 6,
                    padding: '7px 18px',
                    marginTop: 12,
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Remove Connection
                </button>
              </div>
            );
          })}
        </div>
      </section>
      {loading && <div style={{ color: '#718096', marginTop: 24 }}>Loading...</div>}
    </div>
  );
}

export default Connections; //dd