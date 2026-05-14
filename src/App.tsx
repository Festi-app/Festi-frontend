import { useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import { Routes, Route, Navigate, NavLink } from 'react-router-dom'
import { create } from 'zustand'
import { SPOT_TOKENS, SPOT_FONT } from './tokens'


import { AdminBooths } from './pages/Admin/Booths'
import { AdminFestival } from './pages/Admin/Festival'
import { AdminWaiting } from './pages/Admin/Waiting'
import { MobileWaitingRegister, MobileWaitingStatus } from './pages/User/Waiting'
import { MobileBoothDetail, MobileFoodTrucks } from './pages/User/Detail'
import { MobileHome } from './pages/User/Home'
import { MobileMap } from './pages/User/Map'

// ── Global UI state ───────────────────────────────────────────────────────

interface UIState {
  dark: boolean
  period: 'day' | 'night'
  setDark: (v: boolean) => void
  setPeriod: (v: 'day' | 'night') => void
}

const useUI = create<UIState>((set) => ({
  dark: false,
  period: 'day',
  setDark: (dark) => set({ dark }),
  setPeriod: (period) => set({ period }),
}))

// ── Dark mode class sync ──────────────────────────────────────────────────

function DarkSync(): null {
  const { dark } = useUI()
  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
  }, [dark])
  return null
}

// ── Dev toolbar ───────────────────────────────────────────────────────────

function DevToolbar() {
  const { dark, period, setDark, setPeriod } = useUI()
  return (
    <div
      className="fixed top-3 right-3 z-[9999] flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border backdrop-blur-xl"
      style={{
        background: dark ? 'rgba(26,30,35,0.92)' : 'rgba(255,255,255,0.92)',
        borderColor: 'var(--border-color)',
        fontFamily: SPOT_FONT,
      }}
    >
      <button
        onClick={() => setDark(!dark)}
        className="rounded-lg px-2.5 py-1 text-xs font-semibold cursor-pointer border"
        style={{
          borderColor: 'var(--border-color)',
          background: dark ? SPOT_TOKENS.coral : 'var(--surface)',
          color: dark ? '#fff' : 'var(--ink)',
        }}
      >
        {dark ? '다크' : '라이트'}
      </button>
      <button
        onClick={() => setPeriod(period === 'day' ? 'night' : 'day')}
        className="rounded-lg px-2.5 py-1 text-xs font-semibold cursor-pointer border"
        style={{
          borderColor: 'var(--border-color)',
          background: 'var(--surface)',
          color: 'var(--ink)',
        }}
      >
        {period === 'day' ? '주간' : '야간'}
      </button>
    </div>
  )
}

// ── Nav ───────────────────────────────────────────────────────────────────

const NAV_LINKS = [
  { to: '/home', label: '홈' },
  { to: '/map', label: '배치도' },
  { to: '/booth', label: '부스 상세' },
  { to: '/trucks', label: '푸드트럭' },
  { to: '/waiting/register', label: '웨이팅 등록' },
  { to: '/waiting', label: '내 웨이팅' },
  { to: '/admin/festival', label: '관리 · 축제 설정' },
  { to: '/admin/booths', label: '관리 · 부스 배치' },
  { to: '/admin/waiting', label: '관리 · 웨이팅 관리' },
]

function Nav() {
  const [open, setOpen] = useState(false)
  return (
    <>
      {/* Desktop sidebar */}
      <nav
        className="hidden md:flex fixed top-0 left-0 bottom-0 w-[180px] flex-col gap-0.5 py-4 px-2.5 overflow-y-auto z-50"
        style={{
          background: 'var(--surface)',
          borderRight: '1px solid var(--border-color)',
          fontFamily: SPOT_FONT,
        }}
      >
        <div
          className="text-[10px] font-bold tracking-wider px-2 pb-2.5"
          style={{ color: 'var(--ink-60)' }}
        >
          SPOTTER
        </div>
        {NAV_LINKS.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            style={({ isActive }) => ({
              display: 'block',
              padding: '8px 10px',
              borderRadius: 8,
              textDecoration: 'none',
              fontSize: 12,
              background: isActive ? SPOT_TOKENS.mint : 'transparent',
              color: isActive ? SPOT_TOKENS.ink : 'var(--ink-60)',
              fontWeight: isActive ? 700 : 500,
            })}
          >
            {l.label}
          </NavLink>
        ))}
      </nav>

      {/* Mobile top bar */}
      <div
        className="md:hidden fixed top-0 left-0 right-0 z-50 flex items-center px-4 h-14"
        style={{
          background: 'var(--surface)',
          borderBottom: '1px solid var(--border-color)',
          fontFamily: SPOT_FONT,
        }}
      >
        <span
          className="text-[11px] font-bold tracking-wider"
          style={{ color: 'var(--ink-60)' }}
        >
          SPOTTER
        </span>
        <div className="flex-1" />
        <button
          onClick={() => setOpen((o) => !o)}
          className="w-9 h-9 flex items-center justify-center"
          style={{
            color: 'var(--ink)',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          <svg viewBox="0 0 24 24" fill="none" width="20" height="20">
            <line
              x1="3"
              y1="7"
              x2="21"
              y2="7"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
            <line
              x1="3"
              y1="12"
              x2="21"
              y2="12"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
            <line
              x1="3"
              y1="17"
              x2="21"
              y2="17"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <div
          className="md:hidden fixed top-14 left-0 right-0 z-50 py-2 px-3 shadow-xl"
          style={{
            background: 'var(--surface)',
            borderBottom: '1px solid var(--border-color)',
            fontFamily: SPOT_FONT,
          }}
        >
          {NAV_LINKS.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              onClick={() => setOpen(false)}
              className="block px-3 py-2.5 rounded-lg text-sm no-underline"
              style={({ isActive }) => ({
                background: isActive ? SPOT_TOKENS.mint : 'transparent',
                color: isActive ? SPOT_TOKENS.ink : 'var(--ink-60)',
                fontWeight: isActive ? 700 : 500,
              })}
            >
              {l.label}
            </NavLink>
          ))}
        </div>
      )}
    </>
  )
}

// ── Layout wrappers ───────────────────────────────────────────────────────

function MobileLayout({ children }: { children: ReactNode }) {
  return (
    <div
      className="md:ml-45 min-h-screen md:flex md:items-start md:justify-center md:py-10 md:px-6"
      style={{ background: 'var(--bg)' }}
    >
      <div className="w-full overflow-hidden relative mt-14 h-[calc(100dvh-3.5rem)] md:mt-0 md:h-211 md:w-97.5 md:rounded-3xl md:shrink-0 md:shadow-[0_24px_80px_rgba(0,0,0,0.2),0_0_0_1px_rgba(0,0,0,0.08)]">
        {children}
      </div>
    </div>
  )
}

function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div
      className="md:ml-45 min-h-screen pt-14 md:pt-0"
      style={{ background: 'var(--bg)' }}
    >
      {children}
    </div>
  )
}

// ── Route components ──────────────────────────────────────────────────────

function HomeRoute() {
  const { dark, period } = useUI()
  return (
    <MobileLayout>
      <MobileHome dark={dark} period={period} />
    </MobileLayout>
  )
}
function MapRoute() {
  const { dark, period } = useUI()
  return (
    <MobileLayout>
      <MobileMap dark={dark} period={period} />
    </MobileLayout>
  )
}
function BoothRoute() {
  const { dark } = useUI()
  return (
    <MobileLayout>
      <MobileBoothDetail dark={dark} />
    </MobileLayout>
  )
}
function TrucksRoute() {
  const { dark } = useUI()
  return (
    <MobileLayout>
      <MobileFoodTrucks dark={dark} />
    </MobileLayout>
  )
}
function WaitingRegisterRoute() {
  const { dark } = useUI()
  return (
    <MobileLayout>
      <MobileWaitingRegister dark={dark} />
    </MobileLayout>
  )
}
function WaitingStatusRoute() {
  const { dark } = useUI()
  return (
    <MobileLayout>
      <MobileWaitingStatus dark={dark} />
    </MobileLayout>
  )
}
function AdminFestivalRoute() {
  const { dark } = useUI()
  return (
    <AdminLayout>
      <AdminFestival dark={dark} />
    </AdminLayout>
  )
}
function AdminBoothsRoute() {
  const { dark } = useUI()
  return (
    <AdminLayout>
      <AdminBooths dark={dark} />
    </AdminLayout>
  )
}
function AdminWaitingRoute() {
  const { dark } = useUI()
  return (
    <AdminLayout>
      <AdminWaiting dark={dark} />
    </AdminLayout>
  )
}

// ── App ───────────────────────────────────────────────────────────────────

export default function App() {
  return (
    <>
      <DarkSync />
      <Nav />
      <DevToolbar />
      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/home" element={<HomeRoute />} />
        <Route path="/map" element={<MapRoute />} />
        <Route path="/booth" element={<BoothRoute />} />
        <Route path="/trucks" element={<TrucksRoute />} />
        <Route path="/waiting/register" element={<WaitingRegisterRoute />} />
        <Route path="/waiting" element={<WaitingStatusRoute />} />
        <Route path="/admin/festival" element={<AdminFestivalRoute />} />
        <Route path="/admin/booths" element={<AdminBoothsRoute />} />
        <Route path="/admin/waiting" element={<AdminWaitingRoute />} />
      </Routes>
    </>
  )
}
