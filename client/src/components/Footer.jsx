import React from 'react'
import { Link } from 'react-router-dom'

export default function Footer() {
    return (
        <footer className="footer">
            <div className="footer-inner">
                <div className="footer-grid">
                    <div className="footer-brand">
                        <h3>🚗 <span>SATHURAGIRI MOTORS </span><p>MARUTHI SUZUKI </p></h3>
                        <p>
                            Your trusted partner for premium car services and maintenance.
                            Expert mechanics, quality parts, and transparent pricing — since 2015.
                        </p>
                        <div className="footer-social">
                            <a href="#" aria-label="Facebook">📘</a>
                            <a href="#" aria-label="Twitter">🐦</a>
                            <a href="#" aria-label="Instagram">📷</a>
                            <a href="#" aria-label="YouTube">🎬</a>
                        </div>
                    </div>

                    <div className="footer-col">
                        <h4>Quick Links</h4>
                        <ul>
                            <li><Link to="/">Home</Link></li>
                            <li><Link to="/about">About Us</Link></li>
                            <li><Link to="/services">Services</Link></li>
                            <li><Link to="/contact">Contact</Link></li>
                        </ul>
                    </div>

                    <div className="footer-col">
                        <h4>Services</h4>
                        <ul>
                            <li><Link to="/services">General Service</Link></li>
                            <li><Link to="/services">Oil Change</Link></li>
                            <li><Link to="/services">Engine Repair</Link></li>
                            <li><Link to="/services">Car Wash</Link></li>
                        </ul>
                    </div>

                    <div className="footer-col">
                        <h4>Contact Info</h4>
                        <ul>
                            <li>📍 21/5, Raventhira Oil Mill Compound,Cumbum Road,</li><li>Theni - 625531.</li>
                            <li>📞 +91 9047033678</li>
                            <li>✉️sathuragirimotorworks@gmail.com</li>
                            <li>🕐 Mon-Sat: 8:45 AM - 6:30 PM</li>
                        </ul>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p>© {new Date().getFullYear()} Sathuragiri Motors . All rights reserved. Built with ❤️</p>
                </div>
            </div>
        </footer>
    )
}
