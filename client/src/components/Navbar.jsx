import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const location = useLocation()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setOpen(false)
  }, [location])

  const isActive = (path) => location.pathname === path ? 'active' : ''

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="navbar-inner">
        <Link to="/" className="navbar-logo">
          <span className="logo-icon">🚗</span>
          <span className="logo-text"><span>SATHURAGIRI MOTORS</span></span>
        </Link>

        <ul className={`nav-links ${open ? 'open' : ''}`}>
          <li><Link to="/" className={isActive('/')}>Home</Link></li>
          <li><Link to="/about" className={isActive('/about')}>About</Link></li>
          <li><Link to="/services" className={isActive('/services')}>Services</Link></li>
          {user && (
            <>
              <li><Link to="/book" className={isActive('/book')}>Book Service</Link></li>
              <li><Link to="/my-bookings" className={isActive('/my-bookings')}>My Bookings</Link></li>
              <li><Link to="/rewards" className={isActive('/rewards')}>Rewards</Link></li>
            </>
          )}
          <li><Link to="/contact" className={isActive('/contact')}>Contact</Link></li>

          {/* Mobile auth links */}
          <div className="nav-auth" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '1rem' }}>
            {user ? (
              <>
                <span className="nav-user-name">👤 {user.name}</span>
                <button onClick={logout} className="btn btn-sm btn-secondary" style={{ width: '100%' }}>Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-sm btn-secondary" style={{ width: '100%', textAlign: 'center' }}>Login</Link>
                <Link to="/register" className="btn btn-sm btn-primary" style={{ width: '100%', textAlign: 'center' }}>Register</Link>
              </>
            )}
          </div>
        </ul>

        <div className="nav-auth" style={{ display: 'none' }} id="desktop-auth">
          {user ? (
            <>
              <span className="nav-user-name">👤 {user.name}</span>
              <button onClick={logout} className="btn btn-sm btn-secondary">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-sm btn-secondary">Login</Link>
              <Link to="/register" className="btn btn-sm btn-primary">Register</Link>
            </>
          )}
        </div>

        <button className={`hamburger ${open ? 'open' : ''}`} onClick={() => setOpen(!open)}>
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      <style>{`
        @media (min-width: 769px) {
          .nav-links .nav-auth { display: none !important; }
          #desktop-auth { display: flex !important; }
        }
      `}</style>
    </nav>
  )
}
