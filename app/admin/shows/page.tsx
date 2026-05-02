'use client'
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAuthToken, getUsername, logout } from '@/lib/auth';
import PageHero from '@/components/page-hero';
import styles from '@/components/contact-form.module.css';

export default function ShowsManager() {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [shows, setShows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
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

    if (!token) {
      router.push('/admin_login');
      return;
    }

    setUserId(token);
    setUsername(user);
    fetchUserShows(token);
  }, [router]);

  const fetchUserShows = async (uid: string) => {
    try {
      const response = await fetch(`http://localhost:5001/api/shows/user/${uid}`);
      const data = await response.json();
      if (response.ok) {
        setShows(data.shows || []);
      } else {
        setMessage(data.error || 'Failed to fetch shows');
      }
    } catch (error) {
      console.error('Error fetching shows:', error);
      setMessage('Error connecting to server');
    } finally {
      setLoading(false);
    }
  };

  const handleAddShow = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;

    try {
      const response = await fetch('http://localhost:5001/api/shows/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: parseInt(userId),
          ...formData,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Show added successfully!');
        setFormData({ title: '', date: '', location: '', description: '', ticket_url: '' });
        setShowForm(false);
        fetchUserShows(userId);
      } else {
        setMessage(data.error || 'Failed to add show');
      }
    } catch (error) {
      setMessage('Error connecting to server');
    }
  };

  const handleDeleteShow = async (showId: number) => {
    if (!userId || !confirm('Are you sure you want to delete this show?')) return;

    try {
      const response = await fetch(`http://localhost:5001/api/shows/${showId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: parseInt(userId) }),
      });

      if (response.ok) {
        setMessage('Show deleted successfully!');
        fetchUserShows(userId);
      } else {
        const data = await response.json();
        setMessage(data.error || 'Failed to delete show');
      }
    } catch (error) {
      setMessage('Error connecting to server');
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/admin_login');
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '50px' }}>Loading...</div>;

  return (
    <main className="epk-page">
      <PageHero className="contact-hero-panel" ariaLabel="Shows management page" />

      <section className="about-story-section">
        <div className="container" style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h1 className="about-page-heading">My Shows</h1>
            <button 
              onClick={handleLogout}
              style={{ padding: '8px 16px', cursor: 'pointer', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px' }}
            >
              Logout
            </button>
          </div>

          {username && <p style={{ textAlign: 'center' }}>Logged in as: <strong>{username}</strong></p>}

          {message && (
            <p style={{ 
              textAlign: 'center',
              color: message.includes('successfully') ? 'green' : 'red',
              marginBottom: '15px',
              padding: '10px',
              backgroundColor: '#f8f9fa'
            }}>
              {message}
            </p>
          )}

          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <button
              onClick={() => setShowForm(!showForm)}
              style={{
                padding: '10px 20px',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              {showForm ? 'Cancel' : 'Add New Show'}
            </button>
          </div>

          {showForm && (
            <form onSubmit={handleAddShow} className={styles.form} style={{ marginBottom: '50px' }}>
              <input
                className={styles.input}
                placeholder="Show Title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
              <input
                className={styles.input}
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
              />
              <input
                className={styles.input}
                placeholder="Location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                required
              />
              <textarea
                className={styles.input}
                placeholder="Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                style={{ minHeight: '100px', fontFamily: 'inherit' }}
              />
              <input
                className={styles.input}
                placeholder="Ticket Purchase URL"
                value={formData.ticket_url}
                onChange={(e) => setFormData({ ...formData, ticket_url: e.target.value })}
              />
              <button className={styles.button} type="submit">Add Show</button>
            </form>
          )}

          <h2>Your Shows</h2>
          {shows.length === 0 ? (
            <p style={{ textAlign: 'center' }}>No shows added yet. Create one to get started!</p>
          ) : (
            <div style={{ display: 'grid', gap: '20px', marginTop: '20px' }}>
              {shows.map((show) => (
                <div
                  key={show.id}
                  style={{
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    padding: '20px',
                    backgroundColor: '#f9f9f9',
                  }}
                >
                  <h3>{show.title}</h3>
                  <p><strong>Date:</strong> {show.date}</p>
                  <p><strong>Location:</strong> {show.location}</p>
                  <p><strong>Description:</strong> {show.description}</p>
                  {show.ticket_url && (
                    <p><strong>Tickets:</strong> <a href={show.ticket_url} target="_blank" rel="noopener noreferrer">{show.ticket_url}</a></p>
                  )}
                  <button
                    onClick={() => handleDeleteShow(show.id)}
                    style={{
                      marginTop: '10px',
                      padding: '8px 12px',
                      backgroundColor: '#dc3545',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                    }}
                  >
                    Delete Show
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}