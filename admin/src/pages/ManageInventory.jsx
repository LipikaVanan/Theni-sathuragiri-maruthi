import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import api from '../api/axios'

const emptyForm = { partName: '', category: '', stockQty: '', price: '' }

export default function ManageInventory() {
    const [items, setItems] = useState([])
    const [loading, setLoading] = useState(true)
    const [showModal, setShowModal] = useState(false)
    const [editing, setEditing] = useState(null)
    const [form, setForm] = useState(emptyForm)

    useEffect(() => { fetchItems() }, [])

    const fetchItems = () => {
        api.get('/api/inventory')
            .then(res => { setItems(res.data); setLoading(false) })
            .catch(() => setLoading(false))
    }

    const openAdd = () => { setEditing(null); setForm(emptyForm); setShowModal(true) }
    const openEdit = (item) => {
        setEditing(item._id)
        setForm({ partName: item.partName, category: item.category || '', stockQty: item.stockQty, price: item.price })
        setShowModal(true)
    }

    const handleSave = async () => {
        if (!form.partName || !form.price) { toast.error('Part name and price required'); return }
        try {
            if (editing) {
                await api.put(`/api/inventory/${editing}`, form)
                toast.success('Part updated')
            } else {
                await api.post('/api/inventory', form)
                toast.success('Part added')
            }
            setShowModal(false)
            fetchItems()
        } catch (err) {
            toast.error(err.response?.data?.message || 'Error saving')
        }
    }

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this part?')) return
        try { await api.delete(`/api/inventory/${id}`); toast.success('Deleted'); fetchItems() }
        catch { toast.error('Error deleting') }
    }

    const lowStock = items.filter(i => i.stockQty <= 5)

    if (loading) return <div className="spinner-overlay"><div className="spinner"></div></div>

    return (
        <div>
            <div className="admin-header">
                <h1>📦 Manage <span>Inventory</span></h1>
                <button className="btn btn-primary" onClick={openAdd}>+ Add Part</button>
            </div>

            {/* Low stock alert */}
            {lowStock.length > 0 && (
                <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 'var(--radius-md)', padding: '1rem 1.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span style={{ fontSize: '1.3rem' }}>⚠️</span>
                    <div>
                        <div style={{ fontWeight: 700, color: 'var(--accent-red)', fontSize: '0.9rem' }}>Low Stock Alert</div>
                        <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                            {lowStock.map(i => i.partName).join(', ')} — restock needed
                        </div>
                    </div>
                </div>
            )}

            <div className="data-card">
                <table className="data-table">
                    <thead>
                        <tr><th>Part Name</th><th>Category</th><th>Stock Qty</th><th>Unit Price</th><th>Actions</th></tr>
                    </thead>
                    <tbody>
                        {items.map(item => (
                            <tr key={item._id}>
                                <td style={{ fontWeight: 600 }}>{item.partName}</td>
                                <td><span className="status-badge status-confirmed">{item.category || '—'}</span></td>
                                <td>
                                    <span style={{ fontWeight: 700, color: item.stockQty <= 5 ? 'var(--accent-red)' : item.stockQty <= 15 ? 'var(--accent-orange)' : 'var(--accent-green)' }}>
                                        {item.stockQty}
                                    </span>
                                    {item.stockQty <= 5 && <span style={{ fontSize: '0.72rem', color: 'var(--accent-red)', marginLeft: '6px' }}>⚠ LOW</span>}
                                </td>
                                <td style={{ color: 'var(--text-secondary)' }}>₹{item.price}</td>
                                <td>
                                    <div style={{ display: 'flex', gap: '0.4rem' }}>
                                        <button className="btn btn-sm btn-secondary" onClick={() => openEdit(item)}>✏️ Edit</button>
                                        <button className="btn btn-sm btn-danger" onClick={() => handleDelete(item._id)}>🗑️</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {items.length === 0 && <tr><td colSpan="5" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>No inventory items</td></tr>}
                    </tbody>
                </table>
            </div>

            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>{editing ? 'Edit Part' : 'Add Part'}</h2>
                            <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Part Name</label>
                            <input className="form-control" value={form.partName} onChange={e => setForm({ ...form, partName: e.target.value })} />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Category</label>
                            <select className="form-control" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                                <option value="">Select...</option>
                                <option>Fluids</option>
                                <option>Filters</option>
                                <option>Brakes</option>
                                <option>Electrical</option>
                                <option>AC Parts</option>
                                <option>Accessories</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Stock Quantity</label>
                            <input type="number" className="form-control" value={form.stockQty} onChange={e => setForm({ ...form, stockQty: e.target.value })} />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Unit Price (₹)</label>
                            <input type="number" className="form-control" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} />
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
