import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import api from '../api/axios'

export default function ManageBookings() {
    const [bookings, setBookings] = useState([])
    const [technicians, setTechnicians] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        Promise.all([
            api.get('/api/bookings'),
            api.get('/api/technicians')
        ]).then(([bRes, tRes]) => {
            setBookings(bRes.data)
            setTechnicians(tRes.data)
            setLoading(false)
        }).catch(() => setLoading(false))
    }, [])

    const fetchBookings = () => {
        api.get('/api/bookings')
            .then(res => setBookings(res.data))
            .catch(() => { })
    }

    const updateStatus = async (id, status) => {
        try {
            await api.put(`/api/bookings/${id}`, { status })
            toast.success(`Booking ${status.toLowerCase()}`)
            fetchBookings()
        } catch {
            toast.error('Error updating booking')
        }
    }

    const assignTech = async (bookingId, techId) => {
        try {
            await api.put(`/api/bookings/${bookingId}`, { assignedTech: techId || null })
            toast.success('Technician assigned')
            fetchBookings()
        } catch {
            toast.error('Error assigning technician')
        }
    }

    const deleteBooking = async (id) => {
        if (!window.confirm('Delete this booking?')) return
        try {
            await api.delete(`/api/bookings/${id}`)
            toast.success('Booking deleted')
            fetchBookings()
        } catch {
            toast.error('Error deleting booking')
        }
    }

    const getStatusClass = (status) => {
        switch (status) {
            case 'Pending': return 'status-pending'
            case 'Confirmed': return 'status-confirmed'
            case 'In Progress': return 'status-confirmed'
            case 'Completed': return 'status-completed'
            case 'Cancelled': return 'status-cancelled'
            default: return 'status-pending'
        }
    }

    if (loading) return <div className="spinner-overlay"><div className="spinner"></div></div>

    return (
        <div>
            <div className="admin-header">
                <h1>📋 Manage <span>Bookings</span></h1>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>{bookings.length} total bookings</span>
            </div>

            <div className="data-card">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Customer</th>
                            <th>Service</th>
                            <th>Car</th>
                            <th>Date</th>
                            <th>Amount</th>
                            <th>Technician</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bookings.map(b => (
                            <tr key={b._id}>
                                <td>
                                    <div className="user-cell">
                                        <div className="user-avatar">{(b.userId?.name || '?').charAt(0)}</div>
                                        <div>
                                            <div style={{ fontWeight: 600 }}>{b.userId?.name || 'Unknown'}</div>
                                            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{b.userId?.email || ''}</div>
                                        </div>
                                    </div>
                                </td>
                                <td>{b.serviceId?.title || 'N/A'}</td>
                                <td>
                                    <div style={{ fontSize: '0.85rem' }}>{b.carDetails?.model || (b.vehicle ? `${b.vehicle.brand} ${b.vehicle.model}` : '—')}</div>
                                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{b.carDetails?.number || b.vehicle?.registrationNo || ''}</div>
                                </td>
                                <td>{b.bookingDate ? new Date(b.bookingDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }) : '—'}</td>
                                <td style={{ fontWeight: 700, color: 'var(--accent-orange)' }}>₹{b.totalAmount || 0}</td>
                                <td>
                                    <select
                                        className="form-control"
                                        style={{ width: 'auto', padding: '0.3rem 0.5rem', fontSize: '0.75rem', minWidth: '120px' }}
                                        value={b.assignedTech?._id || ''}
                                        onChange={e => assignTech(b._id, e.target.value)}
                                    >
                                        <option value="">Unassigned</option>
                                        {technicians.filter(t => t.available !== false).map(t => (
                                            <option key={t._id} value={t._id}>{t.name}</option>
                                        ))}
                                    </select>
                                </td>
                                <td><span className={`status-badge ${getStatusClass(b.status)}`}>{b.status}</span></td>
                                <td>
                                    <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                                        <select
                                            className="form-control"
                                            style={{ width: 'auto', padding: '0.3rem 0.5rem', fontSize: '0.75rem' }}
                                            value={b.status}
                                            onChange={e => updateStatus(b._id, e.target.value)}
                                        >
                                            <option value="Pending">Pending</option>
                                            <option value="Confirmed">Confirmed</option>
                                            <option value="In Progress">In Progress</option>
                                            <option value="Completed">Completed</option>
                                            <option value="Cancelled">Cancelled</option>
                                        </select>
                                        <button className="btn btn-sm btn-danger" onClick={() => deleteBooking(b._id)}>🗑️</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {bookings.length === 0 && (
                            <tr>
                                <td colSpan="8" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                                    No bookings found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
