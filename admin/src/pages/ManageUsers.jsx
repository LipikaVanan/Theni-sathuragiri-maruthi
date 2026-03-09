import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import api from '../api/axios'

export default function ManageUsers() {
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => { fetchUsers() }, [])

    const fetchUsers = () => {
        api.get('/api/users')
            .then(res => { setUsers(res.data); setLoading(false) })
            .catch(() => setLoading(false))
    }

    const toggleBlock = async (id) => {
        try {
            const res = await api.put(`/api/users/${id}/block`)
            toast.success(res.data.message)
            fetchUsers()
        } catch {
            toast.error('Error updating user')
        }
    }

    const deleteUser = async (id) => {
        if (!window.confirm('Delete this user permanently?')) return
        try {
            await api.delete(`/api/users/${id}`)
            toast.success('User deleted')
            fetchUsers()
        } catch {
            toast.error('Error deleting user')
        }
    }

    if (loading) return <div className="spinner-overlay"><div className="spinner"></div></div>

    return (
        <div>
            <div className="admin-header">
                <h1>👥 Manage <span>Users</span></h1>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>{users.length} registered users</span>
            </div>

            <div className="data-card">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>User</th>
                            <th>Role</th>
                            <th>Phone</th>
                            <th>Status</th>
                            <th>Joined</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(u => (
                            <tr key={u._id}>
                                <td>
                                    <div className="user-cell">
                                        <div className="user-avatar" style={{ background: u.role === 'admin' ? 'linear-gradient(135deg,#f97316,#ea580c)' : 'var(--gradient-blue)' }}>
                                            {u.name.charAt(0)}
                                        </div>
                                        <div>
                                            <div style={{ fontWeight: 600 }}>{u.name}</div>
                                            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{u.email}</div>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <span className={`status-badge ${u.role === 'admin' ? 'status-confirmed' : 'status-pending'}`}>
                                        {u.role}
                                    </span>
                                </td>
                                <td style={{ color: 'var(--text-secondary)' }}>{u.phone || '—'}</td>
                                <td>
                                    <span className={`status-badge ${u.blocked ? 'status-cancelled' : 'status-completed'}`}>
                                        {u.blocked ? 'Blocked' : 'Active'}
                                    </span>
                                </td>
                                <td style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                                    {new Date(u.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                                </td>
                                <td>
                                    <div style={{ display: 'flex', gap: '0.4rem' }}>
                                        {u.role !== 'admin' && (
                                            <>
                                                <button
                                                    className={`btn btn-sm ${u.blocked ? 'btn-success' : 'btn-warning'}`}
                                                    onClick={() => toggleBlock(u._id)}
                                                >
                                                    {u.blocked ? '✅ Unblock' : '🚫 Block'}
                                                </button>
                                                <button className="btn btn-sm btn-danger" onClick={() => deleteUser(u._id)}>🗑️</button>
                                            </>
                                        )}
                                        {u.role === 'admin' && <span style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>—</span>}
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {users.length === 0 && (
                            <tr>
                                <td colSpan="6" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                                    No users found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
