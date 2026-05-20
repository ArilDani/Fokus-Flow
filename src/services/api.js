/**
 * api.js – Centralized API service layer for Fokus Flow
 * -------------------------------------------------------
 * All HTTP calls go through this module.
 * Set VITE_API_BASE_URL in your .env file to point at your backend.
 * When VITE_API_BASE_URL is empty, functions run in mock/demo mode.
 */

const BASE = import.meta.env.VITE_API_BASE_URL || ''

/** Generic request helper */
async function request(endpoint, options = {}) {
  const url = `${BASE}${endpoint}`
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  })
  if (!res.ok) {
    const errorText = await res.text().catch(() => res.statusText)
    throw new Error(errorText || `HTTP ${res.status}`)
  }
  return res.json()
}

// ─── Auth ────────────────────────────────────────────────────────────────────

/** Register a new user */
export async function register({ name, email, password }) {
  if (!BASE) return { mock: true, message: 'Mock register success' }
  return request('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, password }),
  })
}

/** Login */
export async function login({ email, password }) {
  if (!BASE) return { mock: true, token: 'mock-jwt-token' }
  return request('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })
}

// ─── Contact ─────────────────────────────────────────────────────────────────

/** Submit a contact form message */
export async function sendContactMessage({ name, email, message }) {
  if (!BASE) {
    await new Promise(r => setTimeout(r, 800))
    return { mock: true, message: 'Contact form submitted (mock)' }
  }
  return request('/api/contact', {
    method: 'POST',
    body: JSON.stringify({ name, email, message }),
  })
}

// ─── Plans ───────────────────────────────────────────────────────────────────

/** Fetch available subscription plans */
export async function getPlans() {
  if (!BASE) {
    return [
      { id: 'free', name: 'Free Plan', price: 0, currency: 'IDR', features: ['Basic To-Do List', 'Habit Tracker', 'Standard Reminders'] },
      { id: 'premium', name: 'Premium Plan', price: 99000, currency: 'IDR', features: ['AI Productivity Assistant', 'Customizable Dashboards', 'Focus Music & Alerts'] },
    ]
  }
  return request('/api/plans')
}

/** Subscribe to a plan */
export async function subscribeToPlan({ planId, token }) {
  if (!BASE) return { mock: true, message: `Subscribed to plan ${planId} (mock)` }
  return request('/api/subscriptions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify({ planId }),
  })
}
