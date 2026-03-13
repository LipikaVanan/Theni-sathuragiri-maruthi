import React, { useEffect, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'

const steps = ['Service', 'Car Details', 'Schedule', 'Payment', 'Confirm']

const indianCars = {
  'Maruti Suzuki': { type: 'Hatchback', models: ['Alto K10', 'Alto 800', 'S-Presso', 'Celerio', 'WagonR', 'Ignis', 'Swift', 'Baleno', 'Dzire', 'Ciaz', 'Ertiga', 'XL6', 'Brezza', 'Grand Vitara', 'Fronx', 'Jimny', 'Invicto', 'Eeco'] },
  'Hyundai': { type: 'Sedan', models: ['Grand i10 Nios', 'i20', 'i20 N Line', 'Aura', 'Verna', 'Venue', 'Venue N Line', 'Creta', 'Creta N Line', 'Alcazar', 'Tucson', 'Ioniq 5', 'Exter'] },
  'Tata': { type: 'SUV', models: ['Tiago', 'Tiago EV', 'Tigor', 'Tigor EV', 'Altroz', 'Punch', 'Punch EV', 'Nexon', 'Nexon EV', 'Harrier', 'Safari', 'Curvv', 'Curvv EV'] },
  'Mahindra': { type: 'SUV', models: ['Bolero', 'Bolero Neo', 'Scorpio N', 'Scorpio Classic', 'XUV300', 'XUV400 EV', 'XUV700', 'Thar', 'Thar ROXX', 'BE 6', 'XEV 9e'] },
  'Kia': { type: 'SUV', models: ['Sonet', 'Seltos', 'Carens', 'EV6', 'EV9', 'Syros'] },
  'Toyota': { type: 'Sedan', models: ['Glanza', 'Urban Cruiser Hyryder', 'Innova Crysta', 'Innova Hycross', 'Fortuner', 'Fortuner Legender', 'Hilux', 'Camry', 'Vellfire', 'Land Cruiser 300'] },
  'Honda': { type: 'Sedan', models: ['Amaze', 'City', 'City e:HEV', 'Elevate'] },
  'MG': { type: 'SUV', models: ['Astor', 'Hector', 'Hector Plus', 'Gloster', 'ZS EV', 'Comet EV', 'Windsor EV'] },
  'Skoda': { type: 'Sedan', models: ['Slavia', 'Kushaq', 'Kodiaq', 'Superb', 'Kylaq'] },
  'Volkswagen': { type: 'Sedan', models: ['Polo', 'Virtus', 'Taigun', 'Tiguan'] },
  'BMW': { type: 'Luxury', models: ['2 Series Gran Coupe', '3 Series', '5 Series', '7 Series', 'X1', 'X3', 'X5', 'X7', 'iX1', 'i4', 'i7', 'XM'] },
  'Mercedes-Benz': { type: 'Luxury', models: ['A-Class Limousine', 'C-Class', 'E-Class', 'S-Class', 'GLA', 'GLB', 'GLC', 'GLE', 'GLS', 'EQB', 'EQS', 'AMG GT'] },
  'Audi': { type: 'Luxury', models: ['A4', 'A6', 'A8', 'Q3', 'Q5', 'Q7', 'Q8', 'e-tron', 'RS5', 'RS Q8'] },
  'Jeep': { type: 'SUV', models: ['Compass', 'Meridian', 'Grand Cherokee', 'Wrangler'] },
  'Renault': { type: 'Hatchback', models: ['Kwid', 'Triber', 'Kiger'] },
  'Nissan': { type: 'SUV', models: ['Magnite', 'X-Trail'] },
  'Citroën': { type: 'SUV', models: ['C3', 'C3 Aircross', 'eC3', 'C5 Aircross'] },
  'BYD': { type: 'Luxury', models: ['Atto 3', 'Seal', 'e6'] },
  'Force': { type: 'SUV', models: ['Gurkha'] },
  'Isuzu': { type: 'SUV', models: ['D-Max V-Cross', 'mu-X'] },
}

const carBrands = Object.keys(indianCars)

export default function BookService() {
  const { user } = useAuth()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [services, setServices] = useState([])
  const [vehicles, setVehicles] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)

  const [form, setForm] = useState({
    serviceIds: searchParams.get('service') ? [searchParams.get('service')] : [],
    carBrand: '',
    carModel: '',
    carNumber: '',
    carType: 'Sedan',
    bookingDate: '',
    bookingTime: '10:00',
    address: '',
    paymentMethod: 'COD'
  })

  useEffect(() => {
    if (!user) {
      toast.info('Please login to book a service')
      navigate('/login')
      return
    }
    api.get('/api/services')
      .then(res => { setServices(res.data); setLoading(false) })
      .catch(() => setLoading(false))
    api.get('/api/vehicles/my')
      .then(res => setVehicles(res.data))
      .catch(() => { })
  }, [user, navigate])

  const selectedServices = services.filter(s => form.serviceIds.includes(s._id))
  const totalAmount = selectedServices.reduce((acc, s) => acc + s.price, 0)

  const updateForm = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  const toggleService = (id) => {
    setForm(prev => {
      const ids = prev.serviceIds.includes(id)
        ? prev.serviceIds.filter(i => i !== id)
        : [...prev.serviceIds, id]
      return { ...prev, serviceIds: ids }
    })
  }

  const canNext = () => {
    switch (step) {
      case 0: return form.serviceIds.length > 0
      case 1: return form.carModel && form.carNumber
      case 2: return form.bookingDate && form.address
      case 3: return !!form.paymentMethod
      default: return true
    }
  }

  const handleSubmit = async () => {
    setSubmitting(true)
    try {
      await api.post('/api/bookings', {
        serviceIds: form.serviceIds,
        bookingDate: new Date(`${form.bookingDate}T${form.bookingTime}`),
        carDetails: {
          model: form.carModel,
          number: form.carNumber,
          type: form.carType
        },
        address: form.address,
        paymentMethod: form.paymentMethod,
        totalAmount: totalAmount,
        status: 'Pending'
      })
      
      // Add reward points for the completed/paid booking
      if (totalAmount > 0) {
        await api.post('/api/rewards/add', {
          userId: user._id,
          amountSpent: totalAmount
        }).catch(err => console.error('Failed to add rewards', err));
      }

      setDone(true)
      toast.success('Booking confirmed! 🎉')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Booking failed')
    }
    setSubmitting(false)
  }

  if (loading) return <div className="booking-page"><div className="spinner-overlay"><div className="spinner"></div></div></div>

  if (done) {
    return (
      <div className="booking-page">
        <div className="glass-card confirmation-card">
          <div className="confirmation-icon">✅</div>
          <h2>Booking Confirmed!</h2>
          <p>Your service has been booked successfully. We'll send you a confirmation email shortly.</p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={() => navigate('/my-bookings')} className="btn btn-primary">View My Bookings</button>
            <button onClick={() => navigate('/')} className="btn btn-secondary">Back to Home</button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="booking-page">
      <div className="section-header" style={{ marginBottom: '2rem' }}>
        <div className="section-badge">Book a Service</div>
        <h1 className="section-title" style={{ fontSize: '2rem' }}>Schedule Your <span className="highlight">Service</span></h1>
      </div>

      {/* Stepper */}
      <div className="stepper">
        {steps.map((s, i) => (
          <div key={i} className={`stepper-step ${i === step ? 'active' : ''} ${i < step ? 'completed' : ''}`}>
            <div className="stepper-circle">{i < step ? '✓' : i + 1}</div>
            <div className="stepper-label">{s}</div>
            {i < steps.length - 1 && <div className="stepper-line"></div>}
          </div>
        ))}
      </div>

      <div className="glass-card" style={{ maxWidth: '600px', margin: '0 auto' }}>
        {/* Step 0: Select Service */}
        {step === 0 && (
          <div>
            <h3 style={{ marginBottom: '1rem' }}>Select a Service</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {services.map(s => (
                <div
                  key={s._id}
                  className={`payment-option ${form.serviceIds.includes(s._id) ? 'selected' : ''}`}
                  onClick={() => toggleService(s._id)}
                >
                  <div className={`payment-checkbox ${form.serviceIds.includes(s._id) ? 'checked' : ''}`}>
                    {form.serviceIds.includes(s._id) && '✓'}
                  </div>
                  <div className="payment-info" style={{ flex: 1 }}>
                    <h4>{s.title}</h4>
                    <p>{s.description?.slice(0, 60)}...</p>
                  </div>
                  <span className="service-price" style={{ fontSize: '1rem' }}>₹{s.price}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 1: Car Details */}
        {step === 1 && (
          <div>
            <h3 style={{ marginBottom: '1rem' }}>🚗 Select Your Car</h3>
            {vehicles.length > 0 && (
              <div className="form-group">
                <label className="form-label">💾 Saved Vehicles</label>
                <select className="form-control" onChange={e => {
                  const v = vehicles.find(v => v._id === e.target.value)
                  if (v) {
                    updateForm('carBrand', v.brand)
                    updateForm('carModel', `${v.brand} ${v.model}`)
                    updateForm('carNumber', v.registrationNo)
                    updateForm('carType', v.fuelType === 'Diesel' ? 'SUV' : 'Sedan')
                    updateForm('vehicleId', v._id)
                  }
                }}>
                  <option value="">Pick a saved vehicle or select below...</option>
                  {vehicles.map(v => (
                    <option key={v._id} value={v._id}>{v.brand} {v.model} — {v.registrationNo}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Brand Picker */}
            <div className="form-group">
              <label className="form-label">Car Brand</label>
              <div className="brand-grid">
                {carBrands.map(b => (
                  <div
                    key={b}
                    className={`brand-chip ${form.carBrand === b ? 'active' : ''}`}
                    onClick={() => {
                      updateForm('carBrand', b)
                      updateForm('carModel', '')
                      if (indianCars[b]) updateForm('carType', indianCars[b].type)
                    }}
                  >
                    {b}
                  </div>
                ))}
              </div>
            </div>

            {/* Model Picker */}
            {form.carBrand && (
              <div className="form-group" style={{ animation: 'fadeInUp 0.4s ease-out' }}>
                <label className="form-label">Model — <span style={{ color: 'var(--accent-blue-light)' }}>{form.carBrand}</span></label>
                <div className="model-grid">
                  {indianCars[form.carBrand]?.models.map(m => {
                    const fullName = `${form.carBrand} ${m}`
                    return (
                      <div
                        key={m}
                        className={`model-chip ${form.carModel === fullName ? 'active' : ''}`}
                        onClick={() => updateForm('carModel', fullName)}
                      >
                        <span className="model-chip-name">{m}</span>
                        {form.carModel === fullName && <span className="model-chip-check">✓</span>}
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Selected Car Preview */}
            {form.carModel && (
              <div style={{ background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.2)', borderRadius: 'var(--radius-md)', padding: '0.8rem 1.2rem', marginBottom: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.75rem', animation: 'fadeInUp 0.3s ease-out' }}>
                <span style={{ fontSize: '1.4rem' }}>🚘</span>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{form.carModel}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{form.carType}</div>
                </div>
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Registration Number</label>
              <input className="form-control" placeholder="e.g. MH 01 AB 1234" value={form.carNumber} onChange={e => updateForm('carNumber', e.target.value)} />
            </div>

            {/* Car Type Pills */}
            <div className="form-group">
              <label className="form-label">Car Type</label>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {['Sedan', 'SUV', 'Hatchback', 'Luxury', 'Sports'].map(t => (
                  <div
                    key={t}
                    className={`brand-chip ${form.carType === t ? 'active' : ''}`}
                    onClick={() => updateForm('carType', t)}
                    style={{ padding: '0.4rem 1rem' }}
                  >
                    {t === 'Sedan' && '🚗'} {t === 'SUV' && '🚙'} {t === 'Hatchback' && '🏎️'} {t === 'Luxury' && '✨'} {t === 'Sports' && '🏁'} {t}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Schedule */}
        {step === 2 && (
          <div>
            <h3 style={{ marginBottom: '1rem' }}>Schedule & Location</h3>
            <div className="form-group">
              <label className="form-label">Preferred Date</label>
              <input type="date" className="form-control" value={form.bookingDate} onChange={e => updateForm('bookingDate', e.target.value)} min={new Date().toISOString().split('T')[0]} />
            </div>
            <div className="form-group">
              <label className="form-label">Preferred Time</label>
              <select className="form-control" value={form.bookingTime} onChange={e => updateForm('bookingTime', e.target.value)}>
                <option value="08:00">08:00 AM</option>
                <option value="09:00">09:00 AM</option>
                <option value="10:00">10:00 AM</option>
                <option value="11:00">11:00 AM</option>
                <option value="12:00">12:00 PM</option>
                <option value="14:00">02:00 PM</option>
                <option value="15:00">03:00 PM</option>
                <option value="16:00">04:00 PM</option>
                <option value="17:00">05:00 PM</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Pickup/Service Address</label>
              <textarea className="form-control" rows="3" placeholder="Enter your full address" value={form.address} onChange={e => updateForm('address', e.target.value)} />
            </div>
          </div>
        )}

        {/* Step 3: Payment */}
        {step === 3 && (
          <div>
            <h3 style={{ marginBottom: '1rem' }}>Payment Method</h3>
            <div className={`payment-option ${form.paymentMethod === 'COD' ? 'selected' : ''}`} onClick={() => updateForm('paymentMethod', 'COD')}>
              <div className="payment-radio"></div>
              <div className="payment-info">
                <h4>💵 Cash on Delivery</h4>
                <p>Pay when the service is completed</p>
              </div>
            </div>
            <div className={`payment-option ${form.paymentMethod === 'Online' ? 'selected' : ''}`} onClick={() => updateForm('paymentMethod', 'Online')}>
              <div className="payment-radio"></div>
              <div className="payment-info">
                <h4>💳 Online Payment</h4>
                <p>Pay securely via UPI / Card / Net Banking</p>
              </div>
            </div>

            {form.paymentMethod === 'Online' && (
              <div className="glass-card" style={{ marginTop: '1rem', padding: '1.5rem', textAlign: 'center', border: '1px dashed var(--accent-blue)' }}>
                <p style={{ color: 'var(--accent-blue)', fontWeight: 600 }}>🏗️ Payment Gateway Integration</p>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>Demo mode — Razorpay/Stripe integration ready for production</p>
              </div>
            )}
          </div>
        )}

        {/* Step 4: Confirm */}
        {step === 4 && (
          <div>
            <h3 style={{ marginBottom: '1rem' }}>Booking Summary</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ padding: '0.75rem 0', borderBottom: '1px solid var(--border-glass)' }}>
                <div style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Selected Services</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  {selectedServices.map(s => (
                    <div key={s._id} style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600 }}>
                      <span>{s.title}</span>
                      <span>₹{s.price}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: '1px solid var(--border-glass)' }}>
                <span style={{ color: 'var(--text-muted)' }}>Car</span>
                <span style={{ fontWeight: 600 }}>{form.carModel} ({form.carNumber})</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: '1px solid var(--border-glass)' }}>
                <span style={{ color: 'var(--text-muted)' }}>Date & Time</span>
                <span style={{ fontWeight: 600 }}>{form.bookingDate} at {form.bookingTime}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: '1px solid var(--border-glass)' }}>
                <span style={{ color: 'var(--text-muted)' }}>Payment</span>
                <span style={{ fontWeight: 600 }}>{form.paymentMethod === 'COD' ? 'Cash on Delivery' : 'Online Payment'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem 0', background: 'rgba(59,130,246,0.08)', borderRadius: 'var(--radius-sm)', marginTop: '0.5rem', paddingLeft: '1rem', paddingRight: '1rem' }}>
                <span style={{ fontWeight: 700, fontSize: '1.1rem' }}>Total Amount</span>
                <span style={{ fontWeight: 800, fontSize: '1.3rem', color: 'var(--accent-orange)' }}>₹{totalAmount}</span>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem', gap: '1rem' }}>
          {step > 0 && (
            <button className="btn btn-secondary" onClick={() => setStep(step - 1)}>← Back</button>
          )}
          <div style={{ marginLeft: 'auto' }}>
            {step < 4 ? (
              <button className="btn btn-primary" onClick={() => setStep(step + 1)} disabled={!canNext()}>
                Next →
              </button>
            ) : (
              <button className="btn btn-orange btn-lg" onClick={handleSubmit} disabled={submitting}>
                {submitting ? 'Booking...' : '✅ Confirm Booking'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
