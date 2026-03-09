import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import api from '../api/axios'

const emptyForm = { title: '', description: '', price: '', image: '', category: 'Maintenance' }

export default function ManageServices() {
    const [services, setServices] = useState([])
    const [loading, setLoading] = useState(true)
    const [showModal, setShowModal] = useState(false)
    const [editing, setEditing] = useState(null)
    const [form, setForm] = useState(emptyForm)

    useEffect(() => { fetchServices() }, [])

    const fetchServices = () => {
        api.get('/api/services')
            .then(res => { setServices(res.data); setLoading(false) })
            .catch(() => setLoading(false))
    }

    const openAdd = () => {
        setEditing(null)
        setForm(emptyForm)
        setShowModal(true)
    }

    const openEdit = (s) => {
        setEditing(s._id)
        setForm({ title: s.title, description: s.description || '', price: s.price, image: s.image || '', category: s.category || 'Maintenance' })
        setShowModal(true)
    }

    const handleSave = async () => {
        if (!form.title || !form.price) {
            toast.error('Title and price are required')
            return
        }
        try {
            if (editing) {
                await api.put(`/api/services/${editing}`, form)
                toast.success('Service updated')
            } else {
                await api.post('/api/services', form)
                toast.success('Service created')
            }
            setShowModal(false)
            fetchServices()
        } catch (err) {
            toast.error(err.response?.data?.message || 'Error saving service')
        }
    }

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this service?')) return
        try {
            await api.delete(`/api/services/${id}`)
            toast.success('Service deleted')
            fetchServices()
        } catch {
            toast.error('Error deleting service')
        }
    }

    if (loading) return <div className="spinner-overlay"><div className="spinner"></div></div>

    return (
        <div>
            <div className="admin-header">
                <h1>🔧 Manage <span>Services</span></h1>
                <button className="btn btn-primary" onClick={openAdd}>+ Add Service</button>
            </div>

            <div className="data-card">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Service</th>
                            <th>Category</th>
                            <th>Price</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {services.map(s => (
                            <tr key={s._id}>
                                <td>
                                    <div className="user-cell">
                                        <img src={s.image || 'https://via.placeholder.com/40'} alt="" style={{ width: 40, height: 40, borderRadius: 8, objectFit: 'cover' }} />
                                        <div>
                                            <div style={{ fontWeight: 600 }}>{s.title}</div>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{(s.description || '').slice(0, 50)}...</div>
                                        </div>
                                    </div>
                                </td>
                                <td><span className="status-badge status-confirmed">{s.category || '—'}</span></td>
                                <td style={{ fontWeight: 700, color: 'var(--accent-orange)' }}>₹{s.price}</td>
                                <td>
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <button className="btn btn-sm btn-secondary" onClick={() => openEdit(s)}>✏️ Edit</button>
                                        <button className="btn btn-sm btn-danger" onClick={() => handleDelete(s._id)}>🗑️</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>{editing ? 'Edit Service' : 'Add Service'}</h2>
                            <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Title</label>
                            <input className="form-control" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Description</label>
                            <textarea className="form-control" rows="3" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Price (₹)</label>
                            <input type="number" className="form-control" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Image URL</label>
                            <input className="form-control" value={form.image} onChange={e => setForm({ ...form, image: e.target.value })} />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Category</label>
                            <select className="form-control" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                                <option>Maintenance</option>
                                <option>Repair</option>
                                <option>Detailing</option>
                                <option>Electrical</option>
                            </select>
                        </div>
                        <div className="modal-actions">
                            <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                            <button className="btn btn-primary" onClick={handleSave}>{editing ? 'Update' : 'Create'}</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
