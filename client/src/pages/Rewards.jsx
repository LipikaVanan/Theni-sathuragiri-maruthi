import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { toast } from 'react-toastify'
import api from '../api/axios'

export default function Rewards() {
  const { user } = useAuth()
  const [points, setPoints] = useState(0)
  const [loading, setLoading] = useState(true)
  const [rewards, setRewards] = useState([])

  useEffect(() => {
    // Fetch options simultaneously
    api.get('/api/rewards/options')
      .then(res => setRewards(res.data))
      .catch(console.error)

    if (user && user._id) {
      api.get(`/api/rewards/${user._id}`)
        .then(res => {
          setPoints(res.data.points)
          setLoading(false)
        })
        .catch(err => {
          console.error(err)
          setLoading(false)
        })
    }
  }, [user])

  const nextRewardPoints = rewards.length > 0 ? (rewards.find(r => r.points > points)?.points || rewards[rewards.length - 1].points) : 300
  const progressPercent = Math.min((points / nextRewardPoints) * 100, 100)

  const handleRedeem = async (reward) => {
    if (points >= reward.points) {
      try {
        const res = await api.post('/api/rewards/redeem', {
          userId: user._id,
          points: reward.points,
          rewardName: reward.title
        })
        setPoints(res.data.points)
        toast.success(`🎉 Successfully redeemed: ${reward.title}! Check your email.`)
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to redeem reward.')
      }
    } else {
      toast.error('Not enough points to redeem this reward.')
    }
  }

  if (loading) return <div className="spinner-overlay"><div className="spinner"></div></div>

  return (
    <div className="rewards-page" style={{ padding: '7rem 2rem 3rem', maxWidth: '1000px', margin: '0 auto', position: 'relative' }}>
      {/* Background glow effects */}
      <div className="glow-effect glow-blue" style={{ top: '10%', left: '0%' }}></div>
      <div className="glow-effect" style={{ background: 'var(--accent-purple)', bottom: '10%', right: '0%', position: 'absolute', width: '400px', height: '400px', borderRadius: '50%', filter: 'blur(150px)', opacity: '0.15', pointerEvents: 'none', zIndex: 0 }}></div>

      <div className="section-header" style={{ marginBottom: '2.5rem' }}>
        <div className="section-badge">AutoCare Rewards</div>
        <h1 className="section-title" style={{ fontSize: '2.5rem' }}>Your <span className="highlight">Reward Points</span></h1>
        <p className="section-subtitle">Earn points on every service and redeem them for exclusive benefits.</p>
      </div>

      {/* Points Balance Card */}
      <div className="glass-card" style={{ textAlign: 'center', marginBottom: '3.5rem', position: 'relative', overflow: 'hidden', padding: '3rem 2rem' }}>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h2 style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '1px' }}>Total Points Balance</h2>
          <div style={{ fontSize: '4.5rem', fontWeight: '900', background: 'var(--gradient-blue)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '2rem', lineHeight: '1' }}>
            {points} <span style={{ fontSize: '1.5rem', WebkitTextFillColor: 'var(--text-muted)', fontWeight: '600' }}>pts</span>
          </div>

          <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.8rem', fontSize: '0.9rem', color: 'var(--text-primary)', fontWeight: '600' }}>
              <span>0 pts</span>
              <span>{nextRewardPoints} pts for Free Car Wash</span>
            </div>
            <div style={{ height: '14px', background: 'rgba(0,0,0,0.3)', borderRadius: 'var(--radius-full)', overflow: 'hidden', border: '1px solid var(--border-glass)' }}>
              <div style={{
                width: `${progressPercent}%`,
                height: '100%',
                background: 'linear-gradient(90deg, var(--accent-blue-light), var(--accent-purple))',
                transition: 'width 1s cubic-bezier(0.4, 0, 0.2, 1)',
                borderRadius: 'var(--radius-full)',
                boxShadow: '0 0 10px rgba(168, 85, 247, 0.5)'
              }}></div>
            </div>
            <p style={{ marginTop: '0.8rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              {points >= nextRewardPoints ? 'You have enough points for a Free Car Wash!' : `Earn ${nextRewardPoints - points} more points to unlock a Free Car Wash.`}
            </p>
          </div>
        </div>
      </div>

      <h3 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '2rem', textAlign: 'center' }}>Available Rewards</h3>

      {/* Rewards Grid */}
      <div className="services-grid" style={{ marginBottom: '4rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
        {rewards.map(reward => {
          const canRedeem = points >= reward.points;
          return (
            <div key={reward.id} className="glass-card service-card" style={{
              padding: '2.5rem 2rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              border: canRedeem ? '1px solid rgba(59, 130, 246, 0.4)' : '1px solid var(--border-glass)',
              transform: canRedeem ? 'translateY(-4px)' : 'none',
              boxShadow: canRedeem ? '0 8px 30px rgba(59, 130, 246, 0.15)' : 'none'
            }}>
              <div className="feature-icon" style={{
                fontSize: '2.5rem',
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                background: canRedeem ? 'rgba(59, 130, 246, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                borderColor: canRedeem ? 'rgba(59, 130, 246, 0.3)' : 'var(--border-glass)',
                marginBottom: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: canRedeem ? '0 0 20px rgba(59, 130, 246, 0.2)' : 'none'
              }}>
                {reward.icon}
              </div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: '700', marginBottom: '0.8rem' }}>{reward.title}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '1.5rem', flex: 1, lineHeight: '1.6' }}>{reward.desc}</p>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', padding: '0.8rem', background: 'rgba(0,0,0,0.2)', borderRadius: 'var(--radius-sm)', marginBottom: '1.5rem', border: '1px solid rgba(255,255,255,0.02)' }}>
                <span style={{ fontWeight: '800', fontSize: '1.1rem', color: canRedeem ? 'var(--accent-blue-light)' : 'var(--text-muted)' }}>{reward.points} Points</span>
              </div>

              <button
                className={`btn ${canRedeem ? 'btn-primary' : 'btn-secondary'}`}
                style={{ width: '100%', padding: '0.85rem' }}
                onClick={() => handleRedeem(reward)}
                disabled={!canRedeem}
              >
                {canRedeem ? '✨ Redeem Now' : 'Lock'}
              </button>
            </div>
          )
        })}
      </div>

      {/* How to Earn Points Section */}
      <div className="glass-card" style={{ padding: '3rem 2.5rem', background: 'linear-gradient(145deg, rgba(26, 29, 39, 0.7), rgba(10, 14, 26, 0.9))', border: '1px solid rgba(168, 85, 247, 0.2)' }}>
        <h3 style={{ fontSize: '1.6rem', fontWeight: '800', marginBottom: '2rem', textAlign: 'center' }}>How to Earn Points?</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '2rem' }}>

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.2rem' }}>
            <div style={{ fontSize: '1.6rem', width: '50px', height: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(59, 130, 246, 0.1)', borderRadius: 'var(--radius-md)', color: 'var(--accent-blue)', flexShrink: 0, border: '1px solid rgba(59, 130, 246, 0.2)' }}>📅</div>
            <div>
              <h4 style={{ fontSize: '1.05rem', fontWeight: '700', margin: '0 0 0.4rem 0' }}>Book a Service</h4>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', margin: 0, lineHeight: '1.5' }}>Earn 50 points for every service booking completed.</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.2rem' }}>
            <div style={{ fontSize: '1.6rem', width: '50px', height: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(34, 197, 94, 0.1)', borderRadius: 'var(--radius-md)', color: 'var(--accent-green)', flexShrink: 0, border: '1px solid rgba(34, 197, 94, 0.2)' }}>⭐</div>
            <div>
              <h4 style={{ fontSize: '1.05rem', fontWeight: '700', margin: '0 0 0.4rem 0' }}>Leave a Review</h4>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', margin: 0, lineHeight: '1.5' }}>Get 20 points for reviewing our service.</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.2rem' }}>
            <div style={{ fontSize: '1.6rem', width: '50px', height: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(249, 115, 22, 0.1)', borderRadius: 'var(--radius-md)', color: 'var(--accent-orange)', flexShrink: 0, border: '1px solid rgba(249, 115, 22, 0.2)' }}>👥</div>
            <div>
              <h4 style={{ fontSize: '1.05rem', fontWeight: '700', margin: '0 0 0.4rem 0' }}>Refer a Friend</h4>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', margin: 0, lineHeight: '1.5' }}>Earn 100 points when a referred friend books a service.</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
