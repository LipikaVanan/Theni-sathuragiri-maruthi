import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'

export default function MyBookings() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }
    fetchBookings()
  }, [user, navigate])

  const fetchBookings = () => {
    api.get('/api/bookings/my')
      .then(res => { setBookings(res.data); setLoading(false) })
      .catch(() => setLoading(false))
  }

  const cancelBooking = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return
    try {
      await api.put(`/api/bookings/${id}`, { status: 'Cancelled' })
      toast.success('Booking cancelled')
      fetchBookings()
    } catch {
      toast.error('Could not cancel booking')
    }
  }

  const getStatusClass = (status) => {
    switch (status) {
      case 'Pending': return 'status-pending'
      case 'Confirmed': return 'status-confirmed'
      case 'In Progress': return 'status-inprogress'
      case 'Completed': return 'status-completed'
      case 'Cancelled': return 'status-cancelled'
      default: return 'status-pending'
    }
  }

  return (
    <div className="bookings-page">
      <div className="section-header" style={{ paddingTop: '1rem' }}>
        <div className="section-badge">My Bookings</div>
        <h1 className="section-title" style={{ fontSize: '2rem' }}>Your <span className="highlight">Bookings</span></h1>
        <p className="section-subtitle">Track and manage all your service bookings</p>
      </div>

      {loading ? (
        <div className="spinner-overlay"><div className="spinner"></div></div>
      ) : bookings.length === 0 ? (
        <div className="glass-card empty-state">
          <div className="empty-state-icon">📋</div>
          <h3>No bookings yet</h3>
          <p>Book your first car service and it will appear here</p>
          <button onClick={() => navigate('/services')} className="btn btn-primary">Browse Services</button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {bookings.map(b => (
            <div key={b._id} className="glass-card booking-item">
              <div className="booking-item-image">
                <img
                  src={b.serviceId?.image || 'https://images.unsplash.com/photo-1487754180451-c456f719a1fc?w=200'}
                  alt={b.serviceId?.title || 'Service'}
                />
              </div>
              <div className="booking-item-info">
                <h3>{b.serviceId?.title || 'Service'}</h3>
                <p>🚗 {b.carDetails?.model || b.vehicle?.brand + ' ' + b.vehicle?.model || 'N/A'} • {b.carDetails?.number || b.vehicle?.registrationNo || ''}</p>
                <p>📅 {b.bookingDate ? new Date(b.bookingDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'N/A'}</p>
                <p>💰 ₹{b.totalAmount || b.serviceId?.price || 0} • {b.paymentMethod || 'COD'}</p>
                {b.assignedTech && (
                  <p>👨‍🔧 Technician: <strong>{b.assignedTech.name}</strong> ({b.assignedTech.specialization})</p>
                )}
              </div>
              <div className="booking-item-actions">
                <span className={`status-badge ${getStatusClass(b.status)}`}>{b.status}</span>
                {(b.status === 'Pending' || b.status === 'Confirmed') && (
                  <button className="btn btn-sm btn-danger" onClick={() => cancelBooking(b._id)}>Cancel</button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
