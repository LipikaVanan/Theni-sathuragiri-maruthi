import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/axios'

const categories = ['All', 'Maintenance', 'Repair', 'Detailing', 'Electrical']

export default function Services() {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')

  useEffect(() => {
    api.get('/api/services')
      .then(res => { setServices(res.data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const filtered = services.filter(s => {
    const matchSearch = s.title.toLowerCase().includes(search.toLowerCase()) ||
      (s.description && s.description.toLowerCase().includes(search.toLowerCase()))
    const matchCat = category === 'All' || s.category === category
    return matchSearch && matchCat
  })

  return (
    <div>
      <div className="page-header">
        <div className="section-badge">Our Services</div>
        <h1>Professional Car <span className="highlight">Services</span></h1>
        <p>Expert care for every make and model</p>
      </div>

      <section className="section" style={{ paddingTop: '2rem' }}>
        <div className="section-inner">
          {/* Search & Filter */}
          <div className="search-filter-bar">
            <div className="search-input-wrapper">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                className="search-input"
                placeholder="Search services..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <div className="filter-tabs">
              {categories.map(c => (
                <button
                  key={c}
                  className={`filter-tab ${category === c ? 'active' : ''}`}
                  onClick={() => setCategory(c)}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="spinner-overlay"><div className="spinner"></div></div>
          ) : filtered.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">🔍</div>
              <h3>No services found</h3>
              <p>Try adjusting your search or filter criteria</p>
            </div>
          ) : (
            <div className="services-grid">
              {filtered.map((s, i) => (
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
        </div>
      </section>
    </div>
  )
}
