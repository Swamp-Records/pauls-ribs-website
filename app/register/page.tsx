'use client'
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import PageHero from '@/components/page-hero'
import styles from '@/components/contact-form.module.css'

export default function Register() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setResult('');

    if (password !== confirmPassword) {
      setResult('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:5001/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      });

      const data = await response.json();

      if (response.ok && data.user_id) {
        setResult('Registration successful! Redirecting to login...');
        setTimeout(() => router.push('/admin_login'), 1500);
      } else {
        setResult(data.error || 'Registration failed');
      }
    } catch (error) {
      setResult('Error connecting to server');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="epk-page">
      <PageHero className="contact-hero-panel" ariaLabel="Registration page" />

      <section className="about-story-section">
        <center>
          <div className="container">
            <div className="about-copy">
              <h1 className="about-page-heading">Register</h1>
              <form className={styles.form} onSubmit={onSubmit}>
                <input 
                  className={styles.input} 
                  placeholder="Username" 
                  type="text" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
                <input 
                  className={styles.input} 
                  placeholder="Password" 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <input 
                  className={styles.input} 
                  placeholder="Confirm Password" 
                  type="password" 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <button className={styles.button} type="submit" disabled={loading}>
                  {loading ? 'Registering...' : 'Register'}
                </button>
                <p style={{ color: result.includes('successful') ? 'green' : 'red' }}>
                  {result}
                </p>
                <p style={{ marginTop: '20px' }}>
                  Already have an account? <a href="/admin_login" style={{ color: '#007bff' }}>Login here</a>
                </p>
              </form>
            </div>
          </div>
        </center>
      </section>
    </main>
  );
}
