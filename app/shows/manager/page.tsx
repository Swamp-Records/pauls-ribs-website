'use client'
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAuthToken, getUsername, logout } from '@/lib/auth';
import PageHero from '@/components/page-hero';
import styles from '@/components/contact-form.module.css';

export default function ShowsManager() {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [shows, setShows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // NEW: State to track if we are editing
  const [editingShowId, setEditingShowId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    location: '',
    description: '',
    image_url: '',
    ticket_url: '',
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      router.push('/admin_login');
      return;
    }
    setUserId(token);
    fetchUserShows(token);
  }, [router]);

  // Helper for External Links
  const formatLink = (url: string) => {
    if (!url) return '#';
    return url.startsWith('http') ? url : `https://${url}`;
  };

  const fetchUserShows = async (uid: string) => {
    try {
      const response = await fetch(`http://localhost:5001/api/shows/user/${uid}`);
      const data = await response.json();
      if (response.ok) setShows(data.shows || []);
    } catch (error) {
      setMessage('Error connecting to server');
    } finally {
      setLoading(false);
    }
  };

  // NEW: Function to prepare the form for editing
  const startEdit = (show: any) => {
    setEditingShowId(show.id);
    setFormData({
      title: show.title,
      date: show.date,
      location: show.location,
      description: show.description || '',
      image_url: show.image_url || '',
      ticket_url: show.ticket_url || '',
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSaveShow = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;

    // Switch between Add (POST) and Update (PUT)
    const url = editingShowId 
      ? `http://localhost:5001/api/shows/${editingShowId}` 
      : 'http://localhost:5001/api/shows/add';
    
    const method = editingShowId ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: parseInt(userId), ...formData }),
      });

      if (response.ok) {
        setMessage(editingShowId ? 'Show updated!' : 'Show added!');
        setEditingShowId(null);
        setFormData({ title: '', date: '', location: '', description: '', image_url: '', ticket_url: '' });
        setShowForm(false);
        fetchUserShows(userId);
      }
    } catch (error) {
      setMessage('Error saving show');
    }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '50px' }}>Loading...</div>;

  return (
    <main className="epk-page">
      <PageHero className="contact-hero-panel" ariaLabel="Shows management" />
      <section className="container" style={{ padding: '40px 20px' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <h1>Band Dashboard</h1>
            <button onClick={() => { 
                setShowForm(!showForm); 
                if(showForm) setEditingShowId(null); 
            }} style={{ padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px' }}>
                {showForm ? 'Close Form' : '+ Add New Show'}
            </button>
        </div>

        {showForm && (
          <form onSubmit={handleSaveShow} className={styles.form} style={{ background: '#f4f4f4', padding: '20px', borderRadius: '8px' }}>
            <h3>{editingShowId ? 'Edit Show' : 'Add New Show'}</h3>
            <input className={styles.input} placeholder="Title" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />
            <input className={styles.input} type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} required />
            <input className={styles.input} placeholder="Location" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} required />
            <input className={styles.input} placeholder="Ticket URL (e.g. youtube.com)" value={formData.ticket_url} onChange={e => setFormData({...formData, ticket_url: e.target.value})} />
            <button className={styles.button} type="submit">{editingShowId ? 'Update Show' : 'Post Show'}</button>
          </form>
        )}

        <div style={{ marginTop: '40px' }}>
          <h2>Your Live Shows</h2>
          {shows.map(show => (
            <div key={show.id} style={{ border: '1px solid #ddd', padding: '15px', marginBottom: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'white' }}>
              <div>
                <strong>{show.date}</strong> - {show.title}
                <br />
                <small>{show.location}</small>
              </div>
              <div>
                <button onClick={() => startEdit(show)} style={{ marginRight: '10px', padding: '5px 10px', cursor: 'pointer' }}>Edit</button>
                <button onClick={() => {/* delete logic */}} style={{ padding: '5px 10px', backgroundColor: '#ffeded', color: 'red', border: '1px solid red', cursor: 'pointer' }}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}