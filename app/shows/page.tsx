'use client'
import { useEffect, useState, type FormEvent, type ChangeEvent } from 'react';
import PageHero from '@/components/page-hero';
import { getAuthToken, getUsername, logout } from '@/lib/auth';
import styles from '@/components/contact-form.module.css';

export default function ShowsPage() {
  const [shows, setShows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [showLogin, setShowLogin] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingShowId, setEditingShowId] = useState<number | null>(null);
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    location: '',
    description: '',
    ticket_url: '',
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    const token = getAuthToken();
    const user = getUsername();

    if (token) {
      setUserId(token);
      setUsername(user);
    }

    fetchAllShows();
  }, []);

  useEffect(() => {
    if (!message) return;

    const timeout = window.setTimeout(() => {
      setMessage('');
    }, 15000);

    return () => window.clearTimeout(timeout);
  }, [message]);

  const fetchAllShows = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/shows/all');
      const data = await response.json();
      if (response.ok) {
        setShows(data.shows || []);
      }
    } catch (error) {
      console.error('Error fetching shows:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage('');

    try {
      const response = await fetch('http://localhost:5001/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: loginUsername, password: loginPassword }),
      });
      const data = await response.json();

      if (response.ok && data.user_id) {
        localStorage.setItem('user_id', data.user_id);
        localStorage.setItem('username', data.username);
        setUserId(data.user_id.toString());
        setUsername(data.username);
        setShowLogin(false);
        setShowForm(true);
        setMessage('Login successful. You can now manage shows.');
      } else {
        setMessage(data.error || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      setMessage('Error connecting to server');
    }
  };

  const handleLogout = () => {
    logout();
    setUserId(null);
    setUsername(null);
    setShowForm(false);
    setEditingShowId(null);
    setShowLogin(false);
    setFormData({ title: '', date: '', location: '', description: '', ticket_url: '' });
    setLoginUsername('');
    setLoginPassword('');
    setMessage('Logged out successfully.');
  };

  const handleSaveShow = async (e: FormEvent) => {
    e.preventDefault();
    if (!userId) {
      setMessage('Please log in to manage shows.');
      setShowLogin(true);
      return;
    }

    try {
      const url = editingShowId
        ? `http://localhost:5001/api/shows/${editingShowId}`
        : 'http://localhost:5001/api/shows/add';
      const method = editingShowId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: parseInt(userId),
          ...formData,
        }),
      });
      const data = await response.json();

      if (response.ok) {
        setMessage(editingShowId ? 'Show updated successfully!' : 'Show added successfully!');
        setShowForm(false);
        setEditingShowId(null);
        setFormData({ title: '', date: '', location: '', description: '', ticket_url: '' });
        fetchAllShows();
      } else {
        setMessage(data.error || 'Failed to save show');
      }
    } catch (error) {
      console.error('Save show error:', error);
      setMessage('Error connecting to server');
    }
  };

  const handleEditShow = (show: any) => {
    setEditingShowId(show.id);
    setFormData({
      title: show.title,
      date: show.date,
      location: show.location,
      description: show.description || '',
      ticket_url: show.ticket_url || '',
    });
    setShowForm(true);
    document.getElementById('admin-form-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleDeleteShow = async (showId: number) => {
    if (!userId) {
      setMessage('Please log in to delete shows.');
      setShowLogin(true);
      return;
    }

    if (!confirm('Are you sure you want to delete this show?')) return;

    try {
      const response = await fetch(`http://localhost:5001/api/shows/${showId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: parseInt(userId) }),
      });
      const data = await response.json();

      if (response.ok) {
        setMessage('Show deleted successfully!');
        fetchAllShows();
      } else {
        setMessage(data.error || 'Failed to delete show');
      }
    } catch (error) {
      console.error('Delete show error:', error);
      setMessage('Error connecting to server');
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCancelEdit = () => {
    setShowForm(false);
    setEditingShowId(null);
    setFormData({ title: '', date: '', location: '', description: '', ticket_url: '' });
    setMessage('');
  };

  const formatExternalLink = (url: string) => {
    if (!url) return '#';
    return url.startsWith('http') ? url : `https://${url}`;
  };

  return (
    <main className="shows-page">
      <PageHero className="shows-hero-panel" ariaLabel="Shows page navigation" />

      <section className="shows-list-section">
        <div className="container">
          <div className="shows-copy">
            <h1 className="shows-page-heading">Shows</h1>
          </div>

          {loading ? (
            <p style={{ textAlign: 'center', padding: '40px' }}>Loading shows...</p>
          ) : shows.length === 0 ? (
            <p style={{ textAlign: 'center', padding: '40px' }}>No shows scheduled yet.</p>
          ) : (
            <div className="shows-cards-wrap">
              <div className="shows-cards">
                {shows.map((show) => (
                  <article key={show.id} className="show-card">
                    <div className="show-card-date">
                      <p className="show-card-date-line">{show.date}</p>
                      <p className="show-card-venue-line">{show.location}</p>
                    </div>

                    <div className="show-card-city">{show.title}</div>

                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                      <a
                        href={formatExternalLink(show.ticket_url)}
                        className="show-card-ticket"
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => !show.ticket_url && e.preventDefault()}
                      >
                        Buy Tickets
                      </a>

                      {userId && (
                        <div style={{ display: 'flex', gap: '5px' }}>
                          <button
                            onClick={() => handleEditShow(show)}
                            style={{
                              padding: '10px 12px',
                              background: '#f7efe5',
                              color: '#1e1a17',
                              border: '1px solid rgba(30, 26, 23, 0.14)',
                              borderRadius: '2px',
                              fontSize: '0.85rem',
                              fontWeight: '500',
                              cursor: 'pointer',
                            }}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteShow(show.id)}
                            style={{
                              padding: '10px 12px',
                              background: '#dc3545',
                              color: 'white',
                              border: 'none',
                              borderRadius: '2px',
                              fontSize: '0.85rem',
                              fontWeight: '500',
                              cursor: 'pointer',
                            }}
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            </div>
          )}

          <div style={{ marginTop: '60px', paddingTop: '40px', borderTop: '1px solid rgba(30, 26, 23, 0.14)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '10px' }}>Band Access</h2>
                {username && <p style={{ margin: 0 }}>Logged in as: <strong>{username}</strong></p>}
              </div>

              {userId ? (
                <button
                  onClick={handleLogout}
                  style={{ padding: '8px 14px', backgroundColor: '#333', color: 'white', border: 'none', borderRadius: '25px', cursor: 'pointer', fontSize: '0.95rem' }}
                >
                  Logout
                </button>
              ) : (
                <button
                  onClick={() => {
                    setShowLogin(!showLogin);
                    setShowForm(false);
                    setEditingShowId(null);
                    setMessage('');
                  }}
                  style={{ padding: '8px 14px', backgroundColor: '#444', color: 'white', border: 'none', borderRadius: '25px', cursor: 'pointer', fontSize: '0.95rem' }}
                >
                  {showLogin ? 'Hide login' : 'Band log in'}
                </button>
              )}
            </div>

            {message && (
              <div style={{ marginTop: '15px', padding: '10px 14px', borderRadius: '8px', backgroundColor: message.includes('successfully') ? '#d4edda' : '#f8d7da', color: message.includes('successfully') ? '#155724' : '#721c24' }}>
                {message}
              </div>
            )}

            {showLogin && !userId && (
              <form onSubmit={handleLogin} style={{ marginTop: '20px', maxWidth: '520px', display: 'grid', gap: '12px' }}>
                <input
                  className={styles.input}
                  placeholder="Username"
                  value={loginUsername}
                  onChange={(e) => setLoginUsername(e.target.value)}
                  required
                />
                <input
                  className={styles.input}
                  type="password"
                  placeholder="Password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  required
                />
                <button className={styles.button} type="submit" style={{ maxWidth: '160px' }}>
                  Log in
                </button>
              </form>
            )}

            {userId && (
              <div id="admin-form-section" style={{ marginTop: '30px' }}>
                {!showForm ? (
                  <button
                    onClick={() => {
                      setShowForm(true);
                      setMessage('');
                    }}
                    style={{ padding: '10px 18px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.95rem' }}
                  >
                    {editingShowId ? 'Edit show' : 'Add new show'}
                  </button>
                ) : (
                  <form onSubmit={handleSaveShow} style={{ marginTop: '20px', maxWidth: '600px', display: 'grid', gap: '14px' }}>
                    <div style={{ display: 'grid', gap: '6px' }}>
                      <label style={{ fontWeight: '500' }}>Title</label>
                      <input type="text" name="title" value={formData.title} onChange={handleInputChange} required className={styles.input} />
                    </div>
                    <div style={{ display: 'grid', gap: '6px' }}>
                      <label style={{ fontWeight: '500' }}>Date</label>
                      <input type="date" name="date" value={formData.date} onChange={handleInputChange} required className={styles.input} />
                    </div>
                    <div style={{ display: 'grid', gap: '6px' }}>
                      <label style={{ fontWeight: '500' }}>Location</label>
                      <input type="text" name="location" value={formData.location} onChange={handleInputChange} required className={styles.input} />
                    </div>
                    <div style={{ display: 'grid', gap: '6px' }}>
                      <label style={{ fontWeight: '500' }}>Description</label>
                      <textarea name="description" value={formData.description} onChange={handleInputChange} className={styles.input} style={{ minHeight: '100px', fontFamily: 'inherit' }} />
                    </div>
                    <div style={{ display: 'grid', gap: '6px' }}>
                      <label style={{ fontWeight: '500' }}>Ticket URL</label>
                      <input type="text" name="ticket_url" value={formData.ticket_url} onChange={handleInputChange} className={styles.input} />
                    </div>
                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                      <button type="submit" className={styles.button} style={{ flex: '1 1 auto' }}>
                        {editingShowId ? 'Update show' : 'Save show'}
                      </button>
                      <button type="button" onClick={handleCancelEdit} style={{ flex: '1 1 auto', padding: '10px 18px', background: '#e0e0e0', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                        Cancel
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
