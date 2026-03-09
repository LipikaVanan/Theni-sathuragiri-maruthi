import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/axios'

const testimonials = [
  {
    name: 'Rahul Sharma',
    role: 'BMW Owner',
    text: 'Absolutely outstanding service! The team at AutoCare Pro treated my car like their own. The attention to detail during the full service was remarkable.',
    rating: 5,
    color: '#3b82f6'
  },
  {
    name: 'Priya Patel',
    role: 'Honda City Owner',
    text: 'Best car service center in the city. Transparent pricing, no hidden costs, and my car runs like new after their engine service. Highly recommended!',
    rating: 5,
    color: '#f97316'
  },
  {
    name: 'Arjun Verma',
    role: 'Hyundai Creta Owner',
    text: 'I\'ve been coming here for 3 years now. Their AC service is top-notch and the booking system makes everything so convenient. Five stars!',
    rating: 5,
    color: '#22c55e'
  }
]

const features = [
  { icon: '🔧', title: 'Expert Mechanics', desc: 'ASE-certified technicians with 10+ years of experience handling all makes and models.' },
  { icon: '⚡', title: 'Quick Turnaround', desc: 'Most services completed same-day. We value your time and keep you moving.' },
  { icon: '💰', title: 'Transparent Pricing', desc: 'No hidden fees, no surprises. Get upfront quotes before any work begins.' },
  { icon: '🛡️', title: 'Warranty Backed', desc: 'All repairs come with a minimum 6-month warranty for your peace of mind.' }
]

export default function Home() {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/api/services')
      .then(res => { setServices(res.data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  return (
    <div>
      {/* Hero */}
      <section className="hero">
        <div className="hero-shape hero-shape-1"></div>
        <div className="hero-shape hero-shape-2"></div>
        <div className="hero-shape hero-shape-3"></div>
        <div className="hero-content">
          <div className="hero-badge">✨ Trusted by 10,000+ Car Owners</div>
          <h1 className="hero-title">
            Sathuragiri Motors<br />
            <span className="gradient-text">Maruthi Suzuki</span>
          </h1>
          <p className="hero-subtitle">
            Expert mechanics, state-of-the-art equipment, and transparent pricing.
            Book your next service in minutes and drive with confidence.
          </p>
          <div className="hero-buttons">
            <Link to="/book" className="btn btn-primary btn-lg">Book a Service →</Link>
            <Link to="/services" className="btn btn-secondary btn-lg">Explore Services</Link>
          </div>
          <div className="hero-stats">
            <div className="hero-stat">
              <div className="hero-stat-number">10K+</div>
              <div className="hero-stat-label">Happy Customers</div>
            </div>
            <div className="hero-stat">
              <div className="hero-stat-number">15+</div>
              <div className="hero-stat-label">Years Experience</div>
            </div>
            <div className="hero-stat">
              <div className="hero-stat-number">50+</div>
              <div className="hero-stat-label">Expert Mechanics</div>
            </div>
            <div className="hero-stat">
              <div className="hero-stat-number">4.9★</div>
              <div className="hero-stat-label">Average Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="section" style={{ background: 'var(--bg-secondary)' }}>
        <div className="section-inner">
          <div className="about-grid">
            <div className="about-image">
              <img src="https://images.unsplash.com/photo-1625047509248-ec889cbff17f?w=600" alt="AutoCare Pro Workshop" />
            </div>
            <div className="about-content">
              <div className="section-badge">About Us</div>
              <h2>We Keep Your Car Running at Its <span className="highlight">Best</span></h2>
              <p>
                Founded in 2015, AutoCare Pro has grown to become one of the most trusted
                car service centers in the region. Our state-of-the-art facility is equipped
                with the latest diagnostic tools and staffed by certified professionals.
              </p>
              <p>
                Whether it's a routine oil change or a major engine overhaul, we treat every
                vehicle with the same meticulous care and attention.
              </p>
              <Link to="/about" className="btn btn-outline">Learn More →</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="section">
        <div className="section-inner">
          <div className="section-header">
            <div className="section-badge">Why Choose Us</div>
            <h2 className="section-title">Built on Trust, Driven by <span className="highlight">Excellence</span></h2>
            <p className="section-subtitle">Here's what makes AutoCare Pro the preferred choice for thousands of car owners.</p>
          </div>
          <div className="features-grid">
            {features.map((f, i) => (
              <div key={i} className="glass-card feature-card animate-in" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="feature-icon">{f.icon}</div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="section" style={{ background: 'var(--bg-secondary)' }}>
        <div className="section-inner">
          <div className="section-header">
            <div className="section-badge">Our Services</div>
            <h2 className="section-title">Professional Care for <span className="highlight">Every Car</span></h2>
            <p className="section-subtitle">From routine maintenance to complex repairs — we've got you covered.</p>
          </div>
          {loading ? (
            <div className="spinner-overlay"><div className="spinner"></div></div>
          ) : (
            <div className="services-grid">
              {services.slice(0, 4).map((s, i) => (
                <div key={s._id} className="glass-card service-card animate-in" style={{ animationDelay: `${i * 0.1}s` }}>
                  <div className="service-card-image">
                    <img src={s.image || 'https://images.unsplash.com/photo-1487754180451-c456f719a1fc?w=400'} alt={s.title} />
                    {s.category && <span className="service-card-category">{s.category}</span>}
                  </div>
                  <div className="service-card-body">
                    <h3>{s.title}</h3>
                    <p>{s.description}</p>
                    <div className="service-card-footer">
                      <span className="service-price">₹{s.price} <small>onwards</small></span>
                      <Link to={`/book?service=${s._id}`} className="btn btn-sm btn-primary">Book Now</Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
            <Link to="/services" className="btn btn-outline btn-lg">View All Services →</Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section">
        <div className="section-inner">
          <div className="section-header">
            <div className="section-badge">Testimonials</div>
            <h2 className="section-title">What Our Customers <span className="highlight">Say</span></h2>
            <p className="section-subtitle">Real reviews from real car owners who trust AutoCare Pro.</p>
          </div>
          <div className="testimonials-grid">
            {testimonials.map((t, i) => (
              <div key={i} className="glass-card testimonial-card animate-in" style={{ animationDelay: `${i * 0.15}s` }}>
                <div className="testimonial-stars">{'★'.repeat(t.rating)}</div>
                <p className="testimonial-text">"{t.text}"</p>
                <div className="testimonial-author">
                  <div className="testimonial-avatar" style={{ background: t.color }}>
                    {t.name.charAt(0)}
                  </div>
                  <div className="testimonial-author-info">
                    <h4>{t.name}</h4>
                    <p>{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <h2>Ready to Give Your Car the <span className="highlight">Best Care</span>?</h2>
        <p>Book your service today and experience the AutoCare Pro difference.</p>
        <Link to="/book" className="btn btn-orange btn-lg">Book Your Service Now →</Link>
      </section>
    </div>
  )
}
