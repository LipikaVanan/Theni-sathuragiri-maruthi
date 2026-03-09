import React, { useState, useEffect } from 'react'
import api from '../api/axios'
import { toast } from 'react-toastify'

export default function ManageRewards() {
    const [users, setUsers] = useState([])
    const [rewards, setRewards] = useState([])
    const [rules, setRules] = useState({ amountSpent: 100, pointsEarned: 10, newUserBonus: 50, reviewBonus: 20 })
    const [loading, setLoading] = useState(true)

    // Derived states
    const totalPoints = users.reduce((acc, u) => acc + (u.points || 0), 0)
    const activeUsers = users.filter(u => u.points && u.points > 0).length

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        setLoading(true)
        try {
            const [usersRes, optionsRes, rulesRes] = await Promise.all([
                api.get('/api/admin/rewards-users'),
                api.get('/api/rewards/options'),
                api.get('/api/admin/rewards-rules')
            ])
            setUsers(usersRes.data || [])
            setRewards(optionsRes.data || [])
            if (rulesRes.data && rulesRes.data._id) setRules(rulesRes.data)
        } catch (err) {
            toast.error('Failed to load rewards data')
        }
        setLoading(false)
    }

    const handdleRulesSave = async () => {
        try {
            const res = await api.put('/api/admin/rewards-rules', rules)
            setRules(res.data)
            toast.success('Rules updated successfully!')
        } catch (err) {
            toast.error('Failed to update rules')
        }
    }

    const handleAddReward = async () => {
        const title = prompt('Reward Title (e.g. Free Oil Change)')
        if (!title) return
        const points = prompt('Points Required')
        if (!points) return
        try {
            await api.post('/api/admin/rewards', { title, points: Number(points), icon: '🎁', desc: 'New reward added by admin' })
            toast.success('Reward option added')
            fetchData()
        } catch(err) {
            toast.error('Could not add reward')
        }
    }

    const handleDeleteReward = async (id) => {
        if(window.confirm('Delete this reward?')) {
            try {
                await api.delete(`/api/admin/rewards/${id}`)
                toast.success('Deleted permanently')
                fetchData()
            } catch {
                toast.error('Delete failed')
            }
        }
    }

    const handleEditUserPoints = async (userReward) => {
        const newPoints = prompt(`Set new points for ${userReward?.userId?.name}:`, userReward.points)
        if (newPoints !== null && !isNaN(newPoints)) {
            try {
                await api.put(`/api/admin/users/${userReward.userId._id}/points`, { points: Number(newPoints) })
                toast.success('User points updated')
                fetchData()
            } catch {
                toast.error('Update failed')
            }
        }
    }

    const handleResetPoints = async (userReward) => {
        if (window.confirm(`Reset points to 0 for ${userReward?.userId?.name}?`)) {
            try {
                await api.put(`/api/admin/users/${userReward.userId._id}/points`, { points: 0 })
                toast.success('Points reset to 0')
                fetchData()
            } catch {
                toast.error('Reset failed')
            }
        }
    }

    if (loading) return <div className="spinner-overlay"><div className="spinner"></div></div>

    return (
        <div>
            <div className="admin-header">
                <h1>🎁 Manage <span style={{ background: 'linear-gradient(135deg, #a855f7, #3b82f6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Rewards</span></h1>
            </div>

            {/* Overview Cards */}
            <div className="stats-grid" style={{ marginBottom: '2.5rem' }}>
                <div className="stat-card">
                    <div className="stat-icon purple">💎</div>
                    <div className="stat-info">
                        <h3>{totalPoints}</h3>
                        <p>Total Points Issued</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon blue">👥</div>
                    <div className="stat-info">
                        <h3>{activeUsers}</h3>
                        <p>Users with Points</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon green">🏆</div>
                    <div className="stat-info">
                        <h3>{rewards.length}</h3>
                        <p>Active Reward Options</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon orange">⭐</div>
                    <div className="stat-info">
                        <h3>{users.length > 0 ? users.reduce((acc, u) => acc + (u.totalBookings || 0), 0) : 0}</h3>
                        <p>Total Rewarded Bookings</p>
                    </div>
                </div>
            </div>

            {/* Main Grid for Rules and Rewards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem', marginBottom: '2.5rem' }}>
                {/* Rules Section */}
                <div className="data-card" style={{ marginBottom: 0 }}>
                    <div className="data-card-header">
                        <h2>⚙️ Reward Calculation Rules</h2>
                    </div>
                    <div style={{ padding: '1.5rem' }}>
                        <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{ flex: 1 }}>
                                <label className="form-label">Amount Spent (₹)</label>
                                <input type="number" className="form-control" value={rules.amountSpent} onChange={e => setRules({...rules, amountSpent: e.target.value})} />
                            </div>
                            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-muted)', marginTop: '1.2rem' }}>=</div>
                            <div style={{ flex: 1 }}>
                                <label className="form-label">Points Earned</label>
                                <input type="number" className="form-control" value={rules.pointsEarned} onChange={e => setRules({...rules, pointsEarned: e.target.value})} />
                            </div>
                        </div>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                            Currently: Customers earn {rules.pointsEarned} points for every ₹{rules.amountSpent} spent on bookings.
                        </p>
                        
                        <div className="form-group">
                            <label className="form-label">New User Bonus Points</label>
                            <input type="number" className="form-control" value={rules.newUserBonus} onChange={e => setRules({...rules, newUserBonus: e.target.value})} style={{ maxWidth: '200px' }} />
                        </div>
                        
                        <div className="form-group">
                            <label className="form-label">Review Bonus Points</label>
                            <input type="number" className="form-control" value={rules.reviewBonus} onChange={e => setRules({...rules, reviewBonus: e.target.value})} style={{ maxWidth: '200px' }} />
                        </div>
                        
                        <div className="form-group" style={{ marginTop: '1.8rem', marginBottom: 0 }}>
                            <button className="btn btn-primary" onClick={handdleRulesSave} style={{ background: 'linear-gradient(135deg, #a855f7, #3b82f6)' }}>
                                Save Rules
                            </button>
                        </div>
                    </div>
                </div>

                {/* Redemption Options */}
                <div className="data-card" style={{ marginBottom: 0 }}>
                    <div className="data-card-header">
                        <h2>🎁 Reward Redemption Options</h2>
                        <button className="btn btn-sm btn-primary" onClick={handleAddReward}>+ Add Reward</button>
                    </div>
                    <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {rewards.map(r => (
                            <div key={r._id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', background: 'var(--bg-glass)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-glass)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <div style={{ width: '45px', height: '45px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
                                        {r.icon}
                                    </div>
                                    <div>
                                        <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }}>{r.title}</h4>
                                        <div style={{ color: 'var(--accent-blue-light)', fontSize: '0.8rem', fontWeight: 600, marginTop: '2px' }}>{r.points} Points Required</div>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <button className="btn btn-icon btn-danger" onClick={() => handleDeleteReward(r._id)} title="Delete">🗑️</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Users Table */}
            <div className="data-card">
                <div className="data-card-header">
                    <h2>👥 User Point Balances</h2>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <input type="text" className="form-control" placeholder="Search user..." style={{ width: '250px', padding: '0.5rem 1rem' }} />
                    </div>
                </div>
                <div style={{ overflowX: 'auto' }}>
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>User</th>
                                <th>Total Bookings</th>
                                <th>Reward Points</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(u => u.userId ? (
                                <tr key={u._id}>
                                    <td>
                                        <div className="user-cell">
                                            <div className="user-avatar">{u.userId.name.charAt(0)}</div>
                                            <div>
                                                <div style={{ fontWeight: 600 }}>{u.userId.name}</div>
                                                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{u.userId.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td style={{ color: 'var(--text-secondary)' }}>{u.totalBookings || 0} Bookings</td>
                                    <td>
                                        <span style={{ fontWeight: 800, color: 'var(--accent-purple)', fontSize: '1.1rem' }}>
                                            {u.points}
                                        </span> <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>pts</span>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <button className="btn btn-sm btn-secondary" onClick={() => handleEditUserPoints(u)}>✏️ Edit Points</button>
                                            <button className="btn btn-sm btn-warning" onClick={() => handleResetPoints(u)}>🔄 Reset</button>
                                        </div>
                                    </td>
                                </tr>
                            ) : null)}
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    )
}
