import { useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import {
  Routes,
  Route,
  Navigate,
  NavLink,
  useLocation,
  useSearchParams,
} from 'react-router-dom'
import { FestivMark, FestivWordmark } from './components/Logo'
import { useUI } from './stores/useUIStore'
import { UserNavBar } from './components/User/UserNavbar'

import { AdminBooths } from './pages/Admin/Booths'

import { AdminFoodTrucks } from './pages/Admin/FoodTrucks'
import { AdminBoothRequests } from './pages/Admin/BoothRequests'
import { AdminTimetable } from './pages/Admin/Timetable'
import { AdminNotices } from './pages/Admin/Notices'

import { UserHome } from './pages/User/Home'

import { UserMap } from './pages/User/Map'
import { UserMy } from './pages/User/My'

import { BoothAdminLogin } from './pages/BoothAdmin/Login'
import { BoothAdminRegister } from './pages/BoothAdmin/Register'
import { BoothAdminDashboard } from './pages/BoothAdmin/Dashboard'
import { useDayNightStore } from './stores/useDayNightStore'
import { UserWaitingRegister } from './pages/User/UserWaitingRegister'

import { UserOffSeason } from './pages/User/Auth/OffSeason'
import { AdminFestival } from './pages/Admin/AdminFestival'
import { UserSplash } from './pages/User/UserSplash'
import { UserOnboarding } from './pages/User/Auth/UserOnboarding'
import { UserLogin } from './pages/User/Auth/UserLogin'
import { UserWaitingDetail } from './pages/User/UserWaitingDetail'
import { UserWaitingStatus } from './pages/User/UserWaitingStatus'
import { UserBoothDetail } from './pages/User/Booth/UserBoothDetail'
import { UserBoothList } from './pages/User/Booth/UserBoothList'

// ── Standalone (PWA home screen) detection ────────────────────────────────

function isStandalone(): boolean {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as { standalone?: boolean }).standalone === true
  )
}

const IS_STANDALONE = isStandalone()

const STANDALONE_STYLE = IS_STANDALONE
  ? {
      marginTop: 'calc(3.5rem + env(safe-area-inset-top))',
      height: 'calc(100svh - 3.5rem - env(safe-area-inset-top))',
    }
  : undefined

// ── Dark mode class sync ──────────────────────────────────────────────────

function DarkSync(): null {
  const { dark } = useUI()
  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
  }, [dark])
  return null
}

function AdminOnly({ children }: { children: ReactNode }) {
  const { pathname } = useLocation()
  if (!pathname.startsWith('/admin') && !pathname.startsWith('/booth-admin'))
    return null
  return <>{children}</>
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

function FestivLogo({ large }: { large?: boolean }) {
  return (
    <div className="flex items-center gap-1">
      <FestivMark size={large ? 24 : 18} color="currentColor" />
      <FestivWordmark size={large ? 18 : 14} color="currentColor" />
    </div>
  )
}

// ── Nav ───────────────────────────────────────────────────────────────────

const NAV_SECTIONS = [
  {
    title: '유저',
    links: [
      { to: '/splash', label: '로딩 화면' },
      { to: '/off-season', label: '비축제 기간' },
      { to: '/login', label: '로그인' },
      { to: '/onboarding', label: '회원가입' },
      { to: '/home', label: '홈' },
      { to: '/map', label: '배치도' },
      { to: '/waiting', label: '웨이팅' },
      { to: '/me', label: '마이' },
      { to: '/waiting/register', label: '웨이팅 등록' },
      { to: '/waiting/detail', label: '웨이팅 상세' },
      { to: '/booths?type=day', label: '주간 부스 목록' },
      { to: '/booths?type=night', label: '야간 부스 목록' },
      { to: '/booths?type=truck', label: '푸드트럭 목록' },
      { to: '/booth?type=day', label: '주간 부스 상세' },
      { to: '/booth', label: '야간 부스 상세' },
      { to: '/booth?type=truck', label: '푸드트럭 상세' },
    ],
  },
  {
    title: '관리자',
    links: [
      { to: '/admin/festival', label: '축제 설정' },
      { to: '/admin/booths', label: '부스 배치' },
      { to: '/admin/trucks', label: '푸드트럭' },
      { to: '/admin/booth-requests', label: '부스 신청 관리' },
      { to: '/admin/timetable', label: '공연 타임테이블' },
      { to: '/admin/notices', label: '공지 관리' },
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

function NavLinks({ onClick, User }: { onClick?: () => void; User?: boolean }) {
  return (
    <>
      {NAV_SECTIONS.map((section) => (
        <div key={section.title} className={User ? 'mb-2' : 'mb-3'}>
          <div
            className={`px-2.5 font-bold tracking-wider text-ink-40 ${
              User ? 'pb-1 pt-2 text-[10px]' : 'pb-1.5 text-[9px]'
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
                  User ? 'px-3 py-2.5 text-sm' : 'px-2.5 py-2 text-xs'
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
  const { pathname } = useLocation()
  const isAdmin =
    pathname.startsWith('/admin') || pathname.startsWith('/booth-admin')
  if (IS_STANDALONE) {
    return (
      <div
        className="fixed top-0 right-0 left-0 z-50 bg-surface font-festi"
        style={{ paddingTop: 'env(safe-area-inset-top)' }}
      >
        <div className="flex h-14 items-center px-4 text-ink">
          <FestivLogo large />
        </div>
      </div>
    )
  }
  return (
    <>
      {/* Desktop sidebar */}
      <nav className="fixed top-0 bottom-0 left-0 z-50 hidden w-45 flex-col overflow-y-auto border-r border-border bg-surface px-2.5 py-4 font-festi md:flex">
        <div className="px-2 pb-3 text-[#141A1F] dark:text-white">
          <FestivLogo />
        </div>
        <NavLinks />
      </nav>

      {/* User top bar */}
      <div className="fixed top-0 right-0 left-0 z-50 flex h-14 items-center bg-surface px-4 font-festi md:hidden">
        <div className="text-[#141A1F] dark:text-white">
          <FestivLogo large />
        </div>
        <div className="flex-1" />
        {isAdmin && (
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
        )}
      </div>

      {/* User dropdown */}
      {isAdmin && open && (
        <div className="fixed top-14 right-0 left-0 z-50 max-h-[70vh] overflow-y-auto border-b border-border bg-surface px-3 py-2 font-festi shadow-xl md:hidden">
          <NavLinks User onClick={() => setOpen(false)} />
        </div>
      )}
    </>
  )
}

// tree-shake unused export
export { ALL_NAV_LINKS }

// ── Layout wrappers ───────────────────────────────────────────────────────

function UserLayout({
  children,
  footer,
}: {
  children: ReactNode
  footer?: ReactNode
}) {
  const { key } = useLocation()
  return (
    <div className="min-h-screen overflow-hidden bg-bg md:ml-45 md:flex md:items-start md:justify-center md:px-6 md:py-10">
      <div
        className="relative mt-14 h-[calc(100svh-3.5rem)] w-full overflow-hidden md:mt-0 md:h-211 md:w-97.5 md:shrink-0 md:rounded-3xl md:shadow-[0_24px_80px_rgba(0,0,0,0.2),0_0_0_1px_rgba(0,0,0,0.08)]"
        style={STANDALONE_STYLE}
      >
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
        {footer}
      </div>
    </div>
  )
}

function UserTabLayout({
  children,
  active,
}: {
  children: ReactNode
  active: string
}) {
  const { dark } = useUI()
  return (
    <UserLayout footer={<UserNavBar active={active} dark={dark} />}>
      {children}
    </UserLayout>
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
    <UserTabLayout active="home">
      <UserHome dark={dark} />
    </UserTabLayout>
  )
}
function getIdParam(params: URLSearchParams): number | undefined {
  const v = params.get('id')
  return v ? Number(v) : undefined
}

function MapRoute() {
  const { dark } = useUI()
  return (
    <UserTabLayout active="map">
      <UserMap dark={dark} />
    </UserTabLayout>
  )
}

function BoothRoute() {
  return (
    <UserLayout>
      <UserBoothDetail />
    </UserLayout>
  )
}

function BoothListRoute() {
  return (
    <UserLayout>
      <UserBoothList />
    </UserLayout>
  )
}

function WaitingRegisterRoute() {
  const { dark } = useUI()
  const [searchParams] = useSearchParams()
  const id = getIdParam(searchParams)
  return (
    <UserLayout>
      <UserWaitingRegister dark={dark} id={id} />
    </UserLayout>
  )
}
function WaitingStatusRoute() {
  const { dark } = useUI()
  return (
    <UserLayout>
      <UserWaitingStatus dark={dark} />
    </UserLayout>
  )
}
function WaitingDetailRoute() {
  const { dark } = useUI()
  const [searchParams] = useSearchParams()
  const id = getIdParam(searchParams)
  return (
    <UserLayout>
      <UserWaitingDetail dark={dark} id={id} />
    </UserLayout>
  )
}
function MyRoute() {
  const { dark } = useUI()
  return (
    <UserLayout>
      <UserMy dark={dark} />
    </UserLayout>
  )
}
function LoginRoute() {
  const { dark } = useUI()
  return (
    <UserLayout>
      <UserLogin dark={dark} />
    </UserLayout>
  )
}
function OnboardingRoute() {
  const { dark } = useUI()
  return (
    <UserLayout>
      <UserOnboarding dark={dark} />
    </UserLayout>
  )
}
function SplashRoute() {
  const { dark } = useUI()
  return (
    <UserLayout>
      <UserSplash dark={dark} />
    </UserLayout>
  )
}
function OffSeasonRoute() {
  const { dark } = useUI()
  return (
    <UserLayout>
      <UserOffSeason dark={dark} />
    </UserLayout>
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
  return (
    <AdminLayout>
      <AdminBooths />
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
  return (
    <AdminLayout>
      <AdminBoothRequests />
    </AdminLayout>
  )
}
function AdminTimetableRoute() {
  return (
    <AdminLayout>
      <AdminTimetable />
    </AdminLayout>
  )
}
function AdminNoticesRoute() {
  return (
    <AdminLayout>
      <AdminNotices />
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
      <AdminOnly>
        <DevToolbar />
      </AdminOnly>
      <Routes>
        <Route path="/" element={<Navigate to="/splash" replace />} />
        <Route path="/splash" element={<SplashRoute />} />
        <Route path="/off-season" element={<OffSeasonRoute />} />
        <Route path="/home" element={<HomeRoute />} />
        <Route path="/map" element={<MapRoute />} />
        <Route path="/booth" element={<BoothRoute />} />
        <Route path="/booths" element={<BoothListRoute />} />

        <Route path="/waiting" element={<WaitingStatusRoute />} />
        <Route path="/waiting/register" element={<WaitingRegisterRoute />} />
        <Route path="/waiting/detail" element={<WaitingDetailRoute />} />
        <Route
          path="/truck"
          element={<Navigate to="/booth?type=truck" replace />}
        />
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
        <Route path="/admin/timetable" element={<AdminTimetableRoute />} />
        <Route path="/admin/notices" element={<AdminNoticesRoute />} />
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
