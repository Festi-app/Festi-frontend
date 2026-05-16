import { useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import { Routes, Route, Navigate, NavLink, useLocation } from 'react-router-dom'
import { create } from 'zustand'
import { FestHeaderLogo } from './components/FestLogo'

import { AdminBooths } from './pages/Admin/Booths'
import { AdminFestival } from './pages/Admin/Festival'
import { AdminFoodTrucks } from './pages/Admin/FoodTrucks'
import { AdminBoothRequests } from './pages/Admin/BoothRequests'
import {
  MobileWaitingRegister,
  MobileWaitingStatus,
  MobileWaitingDetail,
} from './pages/User/Waiting'
import {
  MobileBoothDetail,
  MobileFoodTrucks,
  MobileTruckDetail,
} from './pages/User/Detail'
import { MobileHome } from './pages/User/Home'
import { MobileLogin } from './pages/User/Login'
import { MobileMap } from './pages/User/Map'
import { MobileMy } from './pages/User/My'
import { MobileOnboarding } from './pages/User/Onboarding'
import { MobileSplash } from './pages/User/Splash'
import { BoothAdminLogin } from './pages/BoothAdmin/Login'
import { BoothAdminRegister } from './pages/BoothAdmin/Register'
import { BoothAdminDashboard } from './pages/BoothAdmin/Dashboard'
import { useDayNightStore } from './stores/useDayNightStore'

// ── Global UI state ───────────────────────────────────────────────────────

interface UIState {
  dark: boolean
  setDark: (v: boolean) => void
}

const useUI = create<UIState>((set) => ({
  dark: false,
  setDark: (dark) => {
    document.documentElement.classList.toggle('dark', dark)
    set({ dark })
  },
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
  const { dark, setDark } = useUI()
  const { isDay, toggleDayNight } = useDayNightStore()
  return (
    <div className="fixed top-3 right-3 z-9999 flex items-center gap-1.5 rounded-xl border border-border bg-white/90 px-2.5 py-1.5 font-festi backdrop-blur-xl dark:bg-[#1A1E23]/90">
      <button
        onClick={() => setDark(!dark)}
        className={`cursor-pointer rounded-lg border border-border px-2.5 py-1 text-xs font-semibold ${
          dark ? 'bg-coral text-white' : 'bg-surface text-ink'
        }`}
      >
        {dark ? '다크' : '라이트'}
      </button>
      <button
        onClick={toggleDayNight}
        className="cursor-pointer rounded-lg border border-border bg-surface px-2.5 py-1 text-xs font-semibold text-ink"
      >
        {isDay ? '주간' : '야간'}
      </button>
    </div>
  )
}

// ── Nav ───────────────────────────────────────────────────────────────────

const NAV_SECTIONS = [
  {
    title: '유저',
    links: [
      { to: '/splash', label: '로딩 화면' },
      { to: '/login', label: '로그인' },
      { to: '/onboarding', label: '회원가입' },
      { to: '/home', label: '홈' },
      { to: '/map', label: '배치도' },
      { to: '/booth', label: '부스 상세' },
      { to: '/trucks', label: '푸드트럭' },
      { to: '/waiting/register', label: '웨이팅 등록' },
      { to: '/waiting', label: '내 웨이팅' },
      { to: '/waiting/detail', label: '웨이팅 상세' },
      { to: '/truck', label: '푸드트럭 상세' },
      { to: '/me', label: '마이 · 즐겨찾기' },
    ],
  },
  {
    title: '관리자',
    links: [
      { to: '/admin/festival', label: '축제 설정' },
      { to: '/admin/booths', label: '부스 배치' },
      { to: '/admin/trucks', label: '푸드트럭' },
      { to: '/admin/booth-requests', label: '부스 신청 관리' },
    ],
  },
  {
    title: '부스 관리자',
    links: [
      { to: '/booth-admin/login', label: '로그인' },
      { to: '/booth-admin/register', label: '회원가입' },
      { to: '/booth-admin', label: '대시보드' },
    ],
  },
]

const ALL_NAV_LINKS = NAV_SECTIONS.flatMap((s) => s.links)

function NavLinks({
  onClick,
  mobile,
}: {
  onClick?: () => void
  mobile?: boolean
}) {
  return (
    <>
      {NAV_SECTIONS.map((section) => (
        <div key={section.title} className={mobile ? 'mb-2' : 'mb-3'}>
          <div
            className={`px-2.5 font-bold tracking-wider text-ink-40 ${
              mobile ? 'pb-1 pt-2 text-[10px]' : 'pb-1.5 text-[9px]'
            }`}
          >
            {section.title.toUpperCase()}
          </div>
          {section.links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end
              onClick={onClick}
              className={({ isActive }) =>
                `block rounded-lg no-underline ${
                  mobile ? 'px-3 py-2.5 text-sm' : 'px-2.5 py-2 text-xs'
                } ${
                  isActive
                    ? 'bg-mint font-bold text-[#141A1F]'
                    : 'font-medium text-ink-60'
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </div>
      ))}
    </>
  )
}

function Nav() {
  const [open, setOpen] = useState(false)
  return (
    <>
      {/* Desktop sidebar */}
      <nav className="fixed top-0 bottom-0 left-0 z-50 hidden w-45 flex-col overflow-y-auto border-r border-border bg-surface px-2.5 py-4 font-festi md:flex">
        <div className="px-2 pb-3">
          <FestHeaderLogo size={18} />
        </div>
        <NavLinks />
      </nav>

      {/* Mobile top bar */}
      <div className="fixed top-0 right-0 left-0 z-50 flex h-14 items-center border-b border-border bg-surface px-4 font-festi md:hidden">
        <FestHeaderLogo size={18} />
        <div className="flex-1" />
        <button
          onClick={() => setOpen((o) => !o)}
          className="flex h-9 w-9 cursor-pointer items-center justify-center text-ink"
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
        <div className="fixed top-14 right-0 left-0 z-50 max-h-[70vh] overflow-y-auto border-b border-border bg-surface px-3 py-2 font-festi shadow-xl md:hidden">
          <NavLinks mobile onClick={() => setOpen(false)} />
        </div>
      )}
    </>
  )
}

// tree-shake unused export
export { ALL_NAV_LINKS }

// ── Layout wrappers ───────────────────────────────────────────────────────

function MobileLayout({ children }: { children: ReactNode }) {
  const { key } = useLocation()
  return (
    <div className="min-h-screen bg-bg md:ml-45 md:flex md:items-start md:justify-center md:px-6 md:py-10">
      <div className="relative mt-14 h-[calc(100dvh-3.5rem)] w-full overflow-hidden md:mt-0 md:h-211 md:w-97.5 md:shrink-0 md:rounded-3xl md:shadow-[0_24px_80px_rgba(0,0,0,0.2),0_0_0_1px_rgba(0,0,0,0.08)]">
        <div
          key={key}
          className="h-full w-full"
          style={{
            animation:
              'festi-page-in 0.26s cubic-bezier(0.25,0.46,0.45,0.94) both',
          }}
        >
          {children}
        </div>
      </div>
    </div>
  )
}

function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="h-screen overflow-hidden bg-bg pt-14 md:ml-45 md:pt-0">
      {children}
    </div>
  )
}

// ── Route components ──────────────────────────────────────────────────────

function HomeRoute() {
  const { dark } = useUI()
  return (
    <MobileLayout>
      <MobileHome dark={dark} />
    </MobileLayout>
  )
}
function MapRoute() {
  const { dark } = useUI()
  return (
    <MobileLayout>
      <MobileMap dark={dark} />
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
  return (
    <MobileLayout>
      <MobileFoodTrucks />
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
function WaitingDetailRoute() {
  const { dark } = useUI()
  return (
    <MobileLayout>
      <MobileWaitingDetail dark={dark} />
    </MobileLayout>
  )
}
function TruckRoute() {
  const { dark } = useUI()
  return (
    <MobileLayout>
      <MobileTruckDetail dark={dark} />
    </MobileLayout>
  )
}
function MyRoute() {
  const { dark } = useUI()
  return (
    <MobileLayout>
      <MobileMy dark={dark} />
    </MobileLayout>
  )
}
function LoginRoute() {
  const { dark } = useUI()
  return (
    <MobileLayout>
      <MobileLogin dark={dark} />
    </MobileLayout>
  )
}
function OnboardingRoute() {
  const { dark } = useUI()
  return (
    <MobileLayout>
      <MobileOnboarding dark={dark} />
    </MobileLayout>
  )
}
function SplashRoute() {
  const { dark } = useUI()
  return (
    <MobileLayout>
      <MobileSplash dark={dark} />
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

function AdminFoodTrucksRoute() {
  return (
    <AdminLayout>
      <AdminFoodTrucks />
    </AdminLayout>
  )
}
function AdminBoothRequestsRoute() {
  const { dark } = useUI()
  return (
    <AdminLayout>
      <AdminBoothRequests dark={dark} />
    </AdminLayout>
  )
}
function BoothAdminLoginRoute() {
  return (
    <AdminLayout>
      <BoothAdminLogin />
    </AdminLayout>
  )
}
function BoothAdminRegisterRoute() {
  return (
    <AdminLayout>
      <BoothAdminRegister />
    </AdminLayout>
  )
}
function BoothAdminDashboardRoute() {
  return (
    <AdminLayout>
      <BoothAdminDashboard />
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
        <Route path="/" element={<Navigate to="/splash" replace />} />
        <Route path="/splash" element={<SplashRoute />} />
        <Route path="/home" element={<HomeRoute />} />
        <Route path="/map" element={<MapRoute />} />
        <Route path="/booth" element={<BoothRoute />} />
        <Route path="/trucks" element={<TrucksRoute />} />
        <Route path="/waiting/register" element={<WaitingRegisterRoute />} />
        <Route path="/waiting/detail" element={<WaitingDetailRoute />} />
        <Route path="/waiting" element={<WaitingStatusRoute />} />
        <Route path="/truck" element={<TruckRoute />} />
        <Route path="/me" element={<MyRoute />} />
        <Route path="/login" element={<LoginRoute />} />
        <Route path="/onboarding" element={<OnboardingRoute />} />
        <Route path="/admin/festival" element={<AdminFestivalRoute />} />
        <Route path="/admin/booths" element={<AdminBoothsRoute />} />
        <Route path="/admin/trucks" element={<AdminFoodTrucksRoute />} />
        <Route
          path="/admin/booth-requests"
          element={<AdminBoothRequestsRoute />}
        />
        <Route path="/booth-admin/login" element={<BoothAdminLoginRoute />} />
        <Route
          path="/booth-admin/register"
          element={<BoothAdminRegisterRoute />}
        />
        <Route path="/booth-admin" element={<BoothAdminDashboardRoute />} />
      </Routes>
    </>
  )
}
