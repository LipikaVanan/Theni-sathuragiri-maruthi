import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import api from '../api/axios'

export default function ManagePayments() {
    const [payments, setPayments] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => { fetchPayments() }, [])

    const fetchPayments = () => {
        api.get('/api/payments')
            .then(res => { setPayments(res.data); setLoading(false) })
            .catch(() => setLoading(false))
    }

    const updateStatus = async (id, status) => {
        try {
            await api.put(`/api/payments/${id}`, { paymentStatus: status })
            toast.success(`Payment marked as ${status}`)
            fetchPayments()
        } catch { toast.error('Error updating payment') }
    }

    const totalPaid = payments.filter(p => p.paymentStatus === 'Paid').reduce((sum, p) => sum + (p.amount || 0), 0)
    const totalPending = payments.filter(p => p.paymentStatus === 'Pending').reduce((sum, p) => sum + (p.amount || 0), 0)

    if (loading) return <div className="spinner-overlay"><div className="spinner"></div></div>

    return (
        <div>
            <div className="admin-header">
                <h1>💰 Manage <span>Payments</span></h1>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>{payments.length} payments</span>
            </div>

            {/* Summary cards */}
            <div className="stats-grid" style={{ marginBottom: '1.5rem' }}>
                <div className="stat-card">
                    <div className="stat-icon green">✅</div>
                    <div className="stat-info">
                        <h3>₹{totalPaid.toLocaleString()}</h3>
                        <p>Total Collected</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon orange">⏳</div>
                    <div className="stat-info">
                        <h3>₹{totalPending.toLocaleString()}</h3>
                        <p>Pending Payments</p>
                    </div>
                </div>
            </div>

            <div className="data-card">
                <table className="data-table">
                    <thead>
                        <tr><th>Customer</th><th>Service</th><th>Amount</th><th>Method</th><th>Status</th><th>Date</th><th>Actions</th></tr>
                    </thead>
                    <tbody>
                        {payments.map(p => (
                            <tr key={p._id}>
                                <td>
                                    <div className="user-cell">
                                        <div className="user-avatar">{(p.booking?.userId?.name || '?').charAt(0)}</div>
                                        <div>
                                            <div style={{ fontWeight: 600 }}>{p.booking?.userId?.name || 'Unknown'}</div>
                                            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{p.booking?.userId?.email || ''}</div>
                                        </div>
                                    </div>
                                </td>
                                <td>{p.booking?.serviceId?.title || 'N/A'}</td>
                                <td style={{ fontWeight: 700, color: 'var(--accent-orange)' }}>₹{p.amount || 0}</td>
                                <td><span className="status-badge status-confirmed">{p.paymentMethod}</span></td>
                                <td>
                                    <span className={`status-badge ${p.paymentStatus === 'Paid' ? 'status-completed' : 'status-pending'}`}>
                                        {p.paymentStatus}
                                    </span>
                                </td>
                                <td style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                                    {p.paymentDate ? new Date(p.paymentDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }) : '—'}
                                </td>
                                <td>
                                    {p.paymentStatus === 'Pending' ? (
                                        <button className="btn btn-sm btn-success" onClick={() => updateStatus(p._id, 'Paid')}>✅ Mark Paid</button>
                                    ) : (
                                        <button className="btn btn-sm btn-warning" onClick={() => updateStatus(p._id, 'Pending')}>↩️ Unpay</button>
                                    )}
                                </td>
                            </tr>
                        ))}
                        {payments.length === 0 && <tr><td colSpan="7" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>No payments found</td></tr>}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
