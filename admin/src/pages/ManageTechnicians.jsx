import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import api from '../api/axios'

const emptyForm = { name: '', specialization: '', experienceYears: '', phone: '', available: true }

export default function ManageTechnicians() {
    const [techs, setTechs] = useState([])
    const [loading, setLoading] = useState(true)
    const [showModal, setShowModal] = useState(false)
    const [editing, setEditing] = useState(null)
    const [form, setForm] = useState(emptyForm)

    useEffect(() => { fetchTechs() }, [])

    const fetchTechs = () => {
        api.get('/api/technicians')
            .then(res => { setTechs(res.data); setLoading(false) })
            .catch(() => setLoading(false))
    }

    const openAdd = () => { setEditing(null); setForm(emptyForm); setShowModal(true) }
    const openEdit = (t) => {
        setEditing(t._id)
        setForm({ name: t.name, specialization: t.specialization, experienceYears: t.experienceYears || '', phone: t.phone || '', available: t.available !== false })
        setShowModal(true)
    }

    const handleSave = async () => {
        if (!form.name || !form.specialization) { toast.error('Name and specialization required'); return }
        try {
            if (editing) {
                await api.put(`/api/technicians/${editing}`, form)
                toast.success('Technician updated')
            } else {
                await api.post('/api/technicians', form)
                toast.success('Technician added')
            }
            setShowModal(false)
            fetchTechs()
        } catch (err) {
            toast.error(err.response?.data?.message || 'Error saving')
        }
    }

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this technician?')) return
        try { await api.delete(`/api/technicians/${id}`); toast.success('Deleted'); fetchTechs() }
        catch { toast.error('Error deleting') }
    }

    if (loading) return <div className="spinner-overlay"><div className="spinner"></div></div>

    return (
        <div>
            <div className="admin-header">
                <h1>🔧 Manage <span>Technicians</span></h1>
                <button className="btn btn-primary" onClick={openAdd}>+ Add Technician</button>
            </div>

            <div className="data-card">
                <table className="data-table">
                    <thead>
                        <tr><th>Technician</th><th>Specialization</th><th>Experience</th><th>Phone</th><th>Status</th><th>Actions</th></tr>
                    </thead>
                    <tbody>
                        {techs.map(t => (
                            <tr key={t._id}>
                                <td>
                                    <div className="user-cell">
                                        <div className="user-avatar" style={{ background: 'linear-gradient(135deg,#06b6d4,#0891b2)' }}>{t.name.charAt(0)}</div>
                                        <div style={{ fontWeight: 600 }}>{t.name}</div>
                                    </div>
                                </td>
                                <td><span className="status-badge status-confirmed">{t.specialization}</span></td>
                                <td>{t.experienceYears || 0} yrs</td>
                                <td style={{ color: 'var(--text-secondary)' }}>{t.phone || '—'}</td>
                                <td>
                                    <span className={`status-badge ${t.available !== false ? 'status-completed' : 'status-cancelled'}`}>
                                        {t.available !== false ? 'Available' : 'Unavailable'}
                                    </span>
                                </td>
                                <td>
                                    <div style={{ display: 'flex', gap: '0.4rem' }}>
                                        <button className="btn btn-sm btn-secondary" onClick={() => openEdit(t)}>✏️ Edit</button>
                                        <button className="btn btn-sm btn-danger" onClick={() => handleDelete(t._id)}>🗑️</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {techs.length === 0 && <tr><td colSpan="6" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>No technicians found</td></tr>}
                    </tbody>
                </table>
            </div>

            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>{editing ? 'Edit Technician' : 'Add Technician'}</h2>
                            <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Name</label>
                            <input className="form-control" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Specialization</label>
                            <select className="form-control" value={form.specialization} onChange={e => setForm({ ...form, specialization: e.target.value })}>
                                <option value="">Select...</option>
                                <option>Engine & Transmission</option>
                                <option>Electrical Systems</option>
                                <option>Brakes & Suspension</option>
                                <option>AC & Cooling</option>
                                <option>Body & Detailing</option>
                                <option>General Maintenance</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Experience (Years)</label>
                            <input type="number" className="form-control" value={form.experienceYears} onChange={e => setForm({ ...form, experienceYears: e.target.value })} />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Phone</label>
                            <input className="form-control" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
                        </div>
                        <div className="form-group">
                            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                                <input type="checkbox" checked={form.available} onChange={e => setForm({ ...form, available: e.target.checked })} />
                                <span className="form-label" style={{ margin: 0 }}>Available for assignments</span>
                            </label>
                        </div>
                        <div className="modal-actions">
                            <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                            <button className="btn btn-primary" onClick={handleSave}>{editing ? 'Update' : 'Add'}</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
