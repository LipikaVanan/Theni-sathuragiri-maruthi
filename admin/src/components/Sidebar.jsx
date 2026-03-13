import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'

export default function Sidebar() {
    const navigate = useNavigate()

    const handleLogout = () => {
        localStorage.removeItem('adminToken')
        localStorage.removeItem('adminUser')
        navigate('/login')
    }

    const admin = JSON.parse(localStorage.getItem('adminUser') || '{}')

    return (
        <aside className="sidebar">
            <div className="sidebar-logo">
                <h2>⚙️ <span>AutoCare</span> Pro</h2>
                <p>Admin Panel</p>
            </div>

            <nav className="sidebar-nav">
                <NavLink to="/" end className={({ isActive }) => isActive ? 'active' : ''}>
                    <span className="nav-icon">📊</span> Dashboard
                </NavLink>
                <NavLink to="/services" className={({ isActive }) => isActive ? 'active' : ''}>
                    <span className="nav-icon">🔧</span> Services
                </NavLink>
                <NavLink to="/bookings" className={({ isActive }) => isActive ? 'active' : ''}>
                    <span className="nav-icon">📋</span> Bookings
                </NavLink>
                <NavLink to="/technicians" className={({ isActive }) => isActive ? 'active' : ''}>
                    <span className="nav-icon">👨‍🔧</span> Technicians
                </NavLink>
                <NavLink to="/vehicles" className={({ isActive }) => isActive ? 'active' : ''}>
                    <span className="nav-icon">🚗</span> Vehicles
                </NavLink>
                <NavLink to="/payments" className={({ isActive }) => isActive ? 'active' : ''}>
                    <span className="nav-icon">💰</span> Payments
                </NavLink>
                <NavLink to="/inventory" className={({ isActive }) => isActive ? 'active' : ''}>
                    <span className="nav-icon">📦</span> Inventory
                </NavLink>
                <NavLink to="/users" className={({ isActive }) => isActive ? 'active' : ''}>
                    <span className="nav-icon">👥</span> Users
                </NavLink>
                <NavLink to="/rewards" className={({ isActive }) => isActive ? 'active' : ''}>
                    <span className="nav-icon">🎁</span> Rewards
                </NavLink>
                <NavLink to="/contacts" className={({ isActive }) => isActive ? 'active' : ''}>
                    <span className="nav-icon">📩</span> Contact Messages
                </NavLink>
            </nav>

            <div className="sidebar-footer">
                <div className="admin-info">
                    <div className="admin-avatar">{(admin.name || 'A').charAt(0)}</div>
                    <div>
                        <div className="admin-name">{admin.name || 'Admin'}</div>
                        <div className="admin-role">Administrator</div>
                    </div>
                </div>
                <button className="btn btn-secondary" style={{ width: '100%' }} onClick={handleLogout}>
                    🚪 Logout
                </button>
            </div>
        </aside>
    )
}
