import React, { useEffect, useState } from 'react'
import api from '../api/axios'

const renderStars = (rating, size = '1.1rem') => {
    if (!rating || rating === 0) {
        return <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontStyle: 'italic' }}>Not Rated</span>
    }
    const classMap = { 1: "one", 2: "two", 3: "three", 4: "four", 5: "five" }
    const cls = classMap[rating] || ""
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ fontSize: size, letterSpacing: '2px' }}>
                {[1, 2, 3, 4, 5].map(i => (
                    <span key={i} className={`star ${i <= rating ? cls : ''}`}>★</span>
                ))}
            </div>
            <span id="output" style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Rating is: {rating}/5</span>
        </div>
    )
}

export default function ManageContacts() {
    const [contacts, setContacts] = useState([])
    const [loading, setLoading] = useState(true)
    const [selected, setSelected] = useState(null)
    const [search, setSearch] = useState('')

    useEffect(() => {
        const fetchData = () => {
            api.get('/api/contact')
                .then(res => { setContacts(res.data); setLoading(false) })
                .catch(() => setLoading(false))
        }
        fetchData()
        const interval = setInterval(fetchData, 5000)
        return () => clearInterval(interval)
    }, [])

    const filtered = contacts.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.email.toLowerCase().includes(search.toLowerCase()) ||
        c.subject.toLowerCase().includes(search.toLowerCase())
    )

    if (loading) return <div className="spinner-overlay"><div className="spinner"></div></div>

    return (
        <div>
            <div className="admin-header">
                <h1>📩 <span>Contact Messages</span></h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                    {contacts.length} message{contacts.length !== 1 ? 's' : ''} received from customers
                </p>
            </div>

            {/* Search */}
            <div style={{ marginBottom: '1.5rem' }}>
                <input
                    className="form-control"
                    placeholder="🔍 Search by name, email or subject..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    style={{ maxWidth: '420px' }}
                />
            </div>

            {filtered.length === 0 ? (
                <div className="table-card" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                    {search ? 'No messages match your search.' : 'No contact messages yet.'}
                </div>
            ) : (
                <div className="table-card">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Subject</th>
                                <th>Rating</th>
                                <th>Date</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((c, i) => (
                                <tr key={c._id}>
                                    <td style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{i + 1}</td>
                                    <td style={{ fontWeight: 600 }}>{c.name}</td>
                                    <td style={{ color: 'var(--accent-blue-light)', fontSize: '0.88rem' }}>{c.email}</td>
                                    <td style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.subject}</td>
                                    <td>
                                        {renderStars(c.rating, '1.1rem')}
                                    </td>
                                    <td style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                                        {new Date(c.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                                    </td>
                                    <td>
                                        <button
                                            className="btn btn-secondary"
                                            style={{ padding: '0.3rem 0.85rem', fontSize: '0.8rem' }}
                                            onClick={() => setSelected(c)}
                                        >
                                            👁 View
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Modal */}
            {selected && (
                <div
                    style={{
                        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)',
                        zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center',
                        padding: '1rem'
                    }}
                    onClick={() => setSelected(null)}
                >
                    <div
                        className="modal-content"
                        style={{ maxWidth: '540px', width: '100%', padding: '2rem', position: 'relative' }}
                        onClick={e => e.stopPropagation()}
                    >
                        <button
                            onClick={() => setSelected(null)}
                            style={{
                                position: 'absolute', top: '1rem', right: '1rem',
                                background: 'none', border: 'none', color: 'var(--text-muted)',
                                fontSize: '1.3rem', cursor: 'pointer'
                            }}
                        >✕</button>

                        <h3 style={{ marginBottom: '1.25rem', fontSize: '1.1rem' }}>📩 Message Details</h3>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <span style={{ color: 'var(--text-muted)', minWidth: '80px' }}>From:</span>
                                <span style={{ fontWeight: 600 }}>{selected.name}</span>
                            </div>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <span style={{ color: 'var(--text-muted)', minWidth: '80px' }}>Email:</span>
                                <a href={`mailto:${selected.email}`} style={{ color: 'var(--accent-blue-light)' }}>{selected.email}</a>
                            </div>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <span style={{ color: 'var(--text-muted)', minWidth: '80px' }}>Subject:</span>
                                <span style={{ fontWeight: 600 }}>{selected.subject}</span>
                            </div>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <span style={{ color: 'var(--text-muted)', minWidth: '80px' }}>Date:</span>
                                <span>{new Date(selected.createdAt).toLocaleString('en-IN')}</span>
                            </div>
                            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                <span style={{ color: 'var(--text-muted)', minWidth: '80px' }}>Rating:</span>
                                {renderStars(selected.rating, '1.4rem')}
                            </div>
                            <div>
                                <div style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Message:</div>
                                <div style={{
                                    background: 'var(--bg-glass)', borderRadius: 'var(--radius-sm)',
                                    padding: '1rem', lineHeight: 1.7, whiteSpace: 'pre-wrap',
                                    border: '1px solid var(--border-glass)'
                                }}>
                                    {selected.message}
                                </div>
                            </div>
                        </div>

                        <a
                            href={`mailto:${selected.email}?subject=Re: ${encodeURIComponent(selected.subject)}`}
                            className="btn btn-primary"
                            style={{ marginTop: '1.5rem', display: 'inline-block', textDecoration: 'none' }}
                        >
                            📧 Reply via Email
                        </a>
                    </div>
                </div>
            )}
        </div>
    )
}
