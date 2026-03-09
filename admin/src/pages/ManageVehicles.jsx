import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import api from '../api/axios'

export default function ManageVehicles() {
    const [vehicles, setVehicles] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => { fetchVehicles() }, [])

    const fetchVehicles = () => {
        api.get('/api/vehicles')
            .then(res => { setVehicles(res.data); setLoading(false) })
            .catch(() => setLoading(false))
    }

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this vehicle?')) return
        try { await api.delete(`/api/vehicles/${id}`); toast.success('Vehicle removed'); fetchVehicles() }
        catch { toast.error('Error deleting vehicle') }
    }

    if (loading) return <div className="spinner-overlay"><div className="spinner"></div></div>

    return (
        <div>
            <div className="admin-header">
                <h1>🚗 Manage <span>Vehicles</span></h1>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>{vehicles.length} registered vehicles</span>
            </div>

            <div className="data-card">
                <table className="data-table">
                    <thead>
                        <tr><th>Owner</th><th>Vehicle</th><th>Registration</th><th>Fuel Type</th><th>Year</th><th>Actions</th></tr>
                    </thead>
                    <tbody>
                        {vehicles.map(v => (
                            <tr key={v._id}>
                                <td>
                                    <div className="user-cell">
                                        <div className="user-avatar">{(v.customer?.name || '?').charAt(0)}</div>
                                        <div>
                                            <div style={{ fontWeight: 600 }}>{v.customer?.name || 'Unknown'}</div>
                                            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{v.customer?.email || ''}</div>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <div style={{ fontWeight: 600 }}>{v.brand} {v.model}</div>
                                </td>
                                <td><span style={{ fontFamily: 'monospace', fontWeight: 600, color: 'var(--accent-blue-light)' }}>{v.registrationNo}</span></td>
                                <td><span className="status-badge status-confirmed">{v.fuelType || '—'}</span></td>
                                <td style={{ color: 'var(--text-secondary)' }}>{v.year || '—'}</td>
                                <td>
                                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(v._id)}>🗑️</button>
                                </td>
                            </tr>
                        ))}
                        {vehicles.length === 0 && <tr><td colSpan="6" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>No vehicles registered</td></tr>}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
