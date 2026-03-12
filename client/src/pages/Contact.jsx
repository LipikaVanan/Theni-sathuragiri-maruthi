import React, { useState } from 'react'
import { toast } from 'react-toastify'
import api from '../api/axios'

const contactInfo = [
    { icon: '📍', title: 'Visit Us', text: '21/5, Raventhira Oil Mill Compound,Cumbum Road,Theni - 625531.' },
    { icon: '📞', title: 'Call Us', text: '+91 9047033678' },
    { icon: '✉️', title: 'Email Us', text: 'sathuragirimotorworks@gmail.com' },
    { icon: '🕐', title: 'Working Hours', text: 'Mon - Sat: 8:45 AM - 6:30 PM' }
]

export default function Contact() {
    const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
    const [sending, setSending] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!form.name || !form.email || !form.subject || !form.message) {
            toast.error('Please fill all fields')
            return
        }
        setSending(true)
        try {
            await api.post('/api/contact', form)
            toast.success('Message sent successfully! 📧')
            setForm({ name: '', email: '', subject: '', message: '' })
        } catch {
            toast.error('Failed to send message')
        }
        setSending(false)
    }

    return (
        <div>
            <div className="page-header">
                <div className="section-badge">Contact</div>
                <h1>Get in <span className="highlight">Touch</span></h1>
                <p>We'd love to hear from you</p>
            </div>

            <section className="section" style={{ paddingTop: '2rem' }}>
                <div className="section-inner">
                    <div className="contact-grid">
                        {/* Contact Info */}
                        <div>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem' }}>
                                Contact <span className="highlight">Information</span>
                            </h2>
                            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', lineHeight: 1.7 }}>
                                Have a question about our services? Need a quote? Or just want to say hello?
                                Reach out to us through any of the channels below.
                            </p>
                            {contactInfo.map((c, i) => (
                                <div key={i} className="glass-card contact-info-card">
                                    <div className="contact-info-icon">{c.icon}</div>
                                    <div>
                                        <h4>{c.title}</h4>
                                        <p>{c.text}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Contact Form */}
                        <div className="glass-card" style={{ padding: '2.5rem' }}>
                            <h3 style={{ marginBottom: '1.5rem', fontSize: '1.3rem' }}>Send us a Message</h3>
                            <form onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <label className="form-label">Your Name</label>
                                    <input className="form-control" placeholder="John Doe" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Email Address</label>
                                    <input type="email" className="form-control" placeholder="john@example.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Subject</label>
                                    <input className="form-control" placeholder="How can we help?" value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Message</label>
                                    <textarea className="form-control" rows="4" placeholder="Tell us more..." value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} />
                                </div>
                                <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }} disabled={sending}>
                                    {sending ? 'Sending...' : '📧 Send Message'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>

            {/* Map */}
            <section className="section" style={{ paddingTop: '0' }}>
                <div className="section-inner">
                    <div className="glass-card" style={{ padding: 0, overflow: 'hidden', height: '350px' }}>
                        <iframe
                            title="AutoCare Pro Location"
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d241317.11609823277!2d72.74109995!3d19.08219865!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c6306644edc1%3A0x5da4ed8f8d648c69!2sMumbai%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1234567890"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen=""
                            loading="lazy"
                        />
                    </div>
                </div>
            </section>
        </div>
    )
}
