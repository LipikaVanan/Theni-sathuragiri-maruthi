import React, { useEffect, useState } from 'react'
import api from '../api/axios'

export default function Dashboard() {
    const [stats, setStats] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        api.get('/api/admin/stats')
            .then(res => { setStats(res.data); setLoading(false) })
            .catch(() => setLoading(false))
    }, [])

    if (loading) return <div className="spinner-overlay"><div className="spinner"></div></div>

    const maxRevenue = stats?.monthlyRevenue?.length
        ? Math.max(...stats.monthlyRevenue.map(m => m.revenue), 1)
        : 1

    return (
        <div>
            <div className="admin-header">
                <h1>📊 <span>Dashboard</span></h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                    {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
            </div>

            {/* Stats */}
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon blue">👥</div>
                    <div className="stat-info">
                        <h3>{stats?.totalUsers || 0}</h3>
                        <p>Total Users</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon orange">📋</div>
                    <div className="stat-info">
                        <h3>{stats?.totalBookings || 0}</h3>
                        <p>Total Bookings</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon green">💰</div>
                    <div className="stat-info">
                        <h3>₹{(stats?.totalRevenue || 0).toLocaleString()}</h3>
                        <p>Total Revenue</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon purple">⏳</div>
                    <div className="stat-info">
                        <h3>{stats?.pendingBookings || 0}</h3>
                        <p>Pending Services</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon" style={{ background: 'rgba(6,182,212,0.12)' }}>👨‍🔧</div>
                    <div className="stat-info">
                        <h3>{stats?.totalTechnicians || 0}</h3>
                        <p>Technicians</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon" style={{ background: 'rgba(168,85,247,0.12)' }}>🚗</div>
                    <div className="stat-info">
                        <h3>{stats?.totalVehicles || 0}</h3>
                        <p>Registered Vehicles</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon" style={{ background: 'rgba(59,130,246,0.12)' }}>🔄</div>
                    <div className="stat-info">
                        <h3>{stats?.inProgressBookings || 0}</h3>
                        <p>In Progress</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon" style={{ background: stats?.lowStockItems > 0 ? 'rgba(239,68,68,0.12)' : 'rgba(34,197,94,0.12)' }}>📦</div>
                    <div className="stat-info">
                        <h3 style={{ color: stats?.lowStockItems > 0 ? 'var(--accent-red)' : 'inherit' }}>{stats?.lowStockItems || 0}</h3>
                        <p>Low Stock Items</p>
                    </div>
                </div>
            </div>

            {/* Revenue Chart */}
            <div className="chart-card">
                <h3>📈 Monthly Revenue (Last 6 Months)</h3>
                {stats?.monthlyRevenue?.length > 0 ? (
                    <div className="chart-bars">
                        {stats.monthlyRevenue.map((m, i) => (
                            <div key={i} className="chart-bar-wrapper">
                                <div className="chart-bar-value">₹{m.revenue.toLocaleString()}</div>
                                <div
                                    className="chart-bar"
                                    style={{ height: `${(m.revenue / maxRevenue) * 150}px` }}
                                ></div>
                                <div className="chart-bar-label">{m._id}</div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem 0' }}>
                        No revenue data yet. Complete some bookings to see the chart.
                    </p>
                )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                {/* Top Services */}
                <div className="chart-card">
                    <h3>🏆 Most Requested Services</h3>
                    {stats?.topServices?.length > 0 ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginTop: '0.75rem' }}>
                            {stats.topServices.map((s, i) => (
                                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.6rem 0.75rem', background: 'var(--bg-glass)', borderRadius: 'var(--radius-sm)' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <span style={{ fontWeight: 800, fontSize: '0.85rem', color: i === 0 ? 'var(--accent-orange)' : 'var(--text-muted)', width: '20px' }}>#{i + 1}</span>
                                        <span style={{ fontWeight: 600, fontSize: '0.88rem' }}>{s.serviceName}</span>
                                    </div>
                                    <span style={{ fontWeight: 700, color: 'var(--accent-blue-light)', fontSize: '0.88rem' }}>{s.count} bookings</span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '1.5rem 0' }}>No data yet</p>
                    )}
                </div>

                {/* Quick Stats */}
                <div className="chart-card">
                    <h3>📊 Booking Summary</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.75rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.6rem 0', borderBottom: '1px solid var(--border-glass)' }}>
                            <span style={{ color: 'var(--text-muted)' }}>Completed</span>
                            <span style={{ fontWeight: 700, color: 'var(--accent-green)' }}>{stats?.completedBookings || 0}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.6rem 0', borderBottom: '1px solid var(--border-glass)' }}>
                            <span style={{ color: 'var(--text-muted)' }}>In Progress</span>
                            <span style={{ fontWeight: 700, color: 'var(--accent-blue)' }}>{stats?.inProgressBookings || 0}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.6rem 0', borderBottom: '1px solid var(--border-glass)' }}>
                            <span style={{ color: 'var(--text-muted)' }}>Pending</span>
                            <span style={{ fontWeight: 700, color: 'var(--accent-orange)' }}>{stats?.pendingBookings || 0}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.6rem 0' }}>
                            <span style={{ color: 'var(--text-muted)' }}>Completion Rate</span>
                            <span style={{ fontWeight: 700, color: 'var(--accent-green)' }}>
                                {stats?.totalBookings ? Math.round((stats.completedBookings / stats.totalBookings) * 100) : 0}%
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
