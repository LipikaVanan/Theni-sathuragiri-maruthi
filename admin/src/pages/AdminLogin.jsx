import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import api from '../api/axios'

export default function AdminLogin() {
    const navigate = useNavigate()
    const [form, setForm] = useState({ email: '', password: '' })
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!form.email || !form.password) {
            toast.error('Please fill all fields')
            return
        }
        setLoading(true)
        try {
            const res = await api.post('/api/admin/auth/login', form)
            const data = res.data
            localStorage.setItem('adminToken', data.token)
            localStorage.setItem('adminUser', JSON.stringify(data))
            toast.success('Welcome, Admin! 🎉')
            navigate('/')
        } catch (err) {
            toast.error(err.response?.data?.message || 'Login failed')
        }
        setLoading(false)
    }

    return (
        <div className="admin-auth">
            <div className="admin-auth-card">
                <div style={{ textAlign: 'center', fontSize: '2.5rem', marginBottom: '0.5rem' }}>⚙️</div>
                <h1>Admin <span style={{ background: 'linear-gradient(135deg,#3b82f6,#f97316)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Login</span></h1>
                <p className="subtitle">Access the AutoCare Pro management dashboard</p>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Email Address</label>
                        <input type="email" className="form-control" placeholder="admin@autocarepro.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Password</label>
                        <input type="password" className="form-control" placeholder="••••••••" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
                    </div>
                    <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }} disabled={loading}>
                        {loading ? 'Signing in...' : '🔐 Sign In'}
                    </button>
                </form>
                <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                    Default: admin@autocarepro.com / admin123
                </p>
            </div>
        </div>
    )
}
