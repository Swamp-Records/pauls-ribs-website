'use client'
import { useState, type FormEvent } from 'react';
import PageHero from '@/components/page-hero'
import styles from '@/components/contact-form.module.css'

export default function ContactForm() {
  const [result, setResult] = useState("");

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    formData.append("access_key", "141b8400-0354-4935-a806-dfe43856f13e");

    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      body: formData
    });

    const data = await response.json();
    setResult(data.success ? "Success!" : "Error");
  };

  return (
    <main className="epk-page">
          <PageHero className="contact-hero-panel" ariaLabel="EPK page navigation" />
    
          <section className="about-story-section">
            <center>
            <div className="container">
              <div className="about-copy">
                <h1 className="about-page-heading">Contact Us!</h1>
                  <form className={styles.form} onSubmit={onSubmit}>
                    <input className={styles.input} placeholder="Name" type="text" name="name" required/>
                    <input className={styles.input} placeholder="Email" type="email" name="email" required/>
                    <textarea className={styles.input} placeholder="Message" name="message" required></textarea>
                    <button className={styles.button} type="submit">Submit</button>
                    <p>{result}</p>
                  </form>
              </div>
            </div>
            </center>
          </section>
        </main>
    
  );
}
