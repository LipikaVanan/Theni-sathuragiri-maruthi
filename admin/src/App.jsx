import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import AdminLayout from './components/AdminLayout'
import AdminLogin from './pages/AdminLogin'
import Dashboard from './pages/Dashboard'
import ManageServices from './pages/ManageServices'
import ManageBookings from './pages/ManageBookings'
import ManageUsers from './pages/ManageUsers'
import ManageTechnicians from './pages/ManageTechnicians'
import ManagePayments from './pages/ManagePayments'
import ManageInventory from './pages/ManageInventory'
import ManageVehicles from './pages/ManageVehicles'
import ManageRewards from './pages/ManageRewards'

function ProtectedAdmin({ children }) {
    const token = localStorage.getItem('adminToken')
    if (!token) return <Navigate to="/login" replace />
    return <AdminLayout>{children}</AdminLayout>
}

export default function App() {
    return (
        <div>
            <Routes>
                <Route path="/login" element={<AdminLogin />} />
                <Route path="/" element={<ProtectedAdmin><Dashboard /></ProtectedAdmin>} />
                <Route path="/services" element={<ProtectedAdmin><ManageServices /></ProtectedAdmin>} />
                <Route path="/bookings" element={<ProtectedAdmin><ManageBookings /></ProtectedAdmin>} />
                <Route path="/users" element={<ProtectedAdmin><ManageUsers /></ProtectedAdmin>} />
                <Route path="/technicians" element={<ProtectedAdmin><ManageTechnicians /></ProtectedAdmin>} />
                <Route path="/payments" element={<ProtectedAdmin><ManagePayments /></ProtectedAdmin>} />
                <Route path="/inventory" element={<ProtectedAdmin><ManageInventory /></ProtectedAdmin>} />
                <Route path="/vehicles" element={<ProtectedAdmin><ManageVehicles /></ProtectedAdmin>} />
                <Route path="/rewards" element={<ProtectedAdmin><ManageRewards /></ProtectedAdmin>} />
            </Routes>
            <ToastContainer position="top-right" autoClose={3000} theme="dark" />
        </div>
    )
}
