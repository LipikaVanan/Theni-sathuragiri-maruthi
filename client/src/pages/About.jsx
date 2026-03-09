import React from 'react'
import { Link } from 'react-router-dom'

const stats = [
    { number: '10,000+', label: 'Cars Serviced' },
    { number: '15+', label: 'Years Experience' },
    { number: '50+', label: 'Expert Mechanics' },
    { number: '98%', label: 'Customer Satisfaction' }
]

const team = [
    { name: 'Raj Kumar', role: 'Founder & CEO', emoji: '👨‍💼' },
    { name: 'Anita Singh', role: 'Head Mechanic', emoji: '👩‍🔧' },
    { name: 'Vikram Patel', role: 'Service Manager', emoji: '👨‍💻' },
    { name: 'Meera Joshi', role: 'Customer Relations', emoji: '👩‍💼' }
]

const values = [
    { icon: '🎯', title: 'Quality First', desc: 'We never compromise on the quality of parts, tools, or workmanship.' },
    { icon: '🤝', title: 'Trust & Transparency', desc: 'Honest diagnostics and upfront pricing — no hidden fees, ever.' },
    { icon: '💡', title: 'Innovation', desc: 'Cutting-edge diagnostic equipment and continuous training for our team.' },
    { icon: '❤️', title: 'Customer Care', desc: 'Your satisfaction is our mission. We go above and beyond for every customer.' }
]

export default function About() {
    return (
        <div className="about-page">
            <div className="page-header">
                <div className="section-badge">About Us</div>
                <h1>Our <span className="highlight">Story</span></h1>
                <p>Driven by passion, powered by expertise</p>
            </div>

            {/* Story */}
            <section className="section">
                <div className="section-inner">
                    <div className="about-grid">
                        <div className="about-image">
                            <img src="https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=600" alt="AutoCare Pro Team" />
                        </div>
                        <div className="about-content">
                            <h2>From a Small Garage to the <span className="highlight">Region's Best</span></h2>
                            <p>
                                Sathuragiri Motors Car Care was established dedicated Automobile enthusiast who give to a customer,satisfaction in quality service and repair jobs for the cars. The Aim of the workshop is to provide vehicle maintenance,repairs and diagnostics for Maruti Suzuki vehicles and guarantee a first class service at simply and affordable price.
                                The technicians at Sathuragiri Motors trained to the latest technologies and have the most up-to-date diagnostic equipments to pinpoint any faults in the customer’s car quickly and accurately.
                                We having a vast experience In the Automobile Service , A customer can get all car related service under one roof.
                            </p>
                            <p>
                                100% TRANSPARENCY</p>
                            <p>
                                Genuine Spare Parts</p>
                            <p>
                                TRUSTED & QUALITY SERVICE </p>

                            <Link to="/services" className="btn btn-primary">Explore Our Services →</Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats */}
            <section className="section" style={{ background: 'var(--bg-secondary)' }}>
                <div className="section-inner">
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                        {stats.map((s, i) => (
                            <div key={i} className="glass-card" style={{ textAlign: 'center', padding: '2rem' }}>
                                <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--accent-blue)' }}>{s.number}</div>
                                <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.3rem' }}>{s.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Values */}
            <section className="section">
                <div className="section-inner">
                    <div className="section-header">
                        <div className="section-badge">Our Values</div>
                        <h2 className="section-title">What <span className="highlight">Drives</span> Us</h2>
                    </div>
                    <div className="features-grid">
                        {values.map((v, i) => (
                            <div key={i} className="glass-card feature-card">
                                <div className="feature-icon">{v.icon}</div>
                                <h3>{v.title}</h3>
                                <p>{v.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Team */}
            <section className="section" style={{ background: 'var(--bg-secondary)' }}>
                <div className="section-inner">
                    <div className="section-header">
                        <div className="section-badge">Our Team</div>
                        <h2 className="section-title">Meet the <span className="highlight">Experts</span></h2>
                        <p className="section-subtitle">The passionate people behind every exceptional service experience.</p>
                    </div>
                    <div className="team-grid">
                        {team.map((t, i) => (
                            <div key={i} className="glass-card team-card animate-in" style={{ animationDelay: `${i * 0.1}s` }}>
                                <div className="team-avatar">{t.emoji}</div>
                                <h3>{t.name}</h3>
                                <p>{t.role}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="cta-section">
                <h2>Ready to Experience the <span className="highlight">Difference</span>?</h2>
                <p>Join thousands of happy car owners who trust AutoCare Pro.</p>
                <Link to="/book" className="btn btn-orange btn-lg">Book a Service →</Link>
            </section>
        </div>
    )
}
