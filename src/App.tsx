import { useEffect } from 'react'
import type { ReactNode } from 'react'
import {
  Routes,
  Route,
  Navigate,
  useLocation,
  useSearchParams,
} from 'react-router-dom'
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
import { ROUTES, boothUrl } from './constants/routes'

// ── Auth helpers ─────────────────────────────────────────────────────────

function getTokenRole(): string | null {
  const token = localStorage.getItem('token')
  if (!token) return null
  try {
    return (
      (JSON.parse(atob(token.split('.')[1])) as { role?: string }).role ?? null
    )
  } catch {
    return null
  }
}

function RequireRole({
  roles,
  redirectTo,
  children,
}: {
  roles: string[]
  redirectTo: string
  children: ReactNode
}) {
  const role = getTokenRole()
  if (!role || !roles.includes(role))
    return <Navigate to={redirectTo} replace />
  return <>{children}</>
}

// ── Dark mode class sync ──────────────────────────────────────────────────

function DarkSync(): null {
  const { dark } = useUI()
  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
  }, [dark])
  return null
}

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
    <div className="min-h-screen overflow-hidden bg-bg md:flex md:items-start md:justify-center md:px-6 md:py-10">
      <div className="relative h-svh w-full overflow-hidden md:mt-0 md:h-211 md:w-97.5 md:shrink-0 md:rounded-3xl md:shadow-[0_24px_80px_rgba(0,0,0,0.2),0_0_0_1px_rgba(0,0,0,0.08)]">
        <div
          key={key}
          className="h-full w-full"
          style={{
            animation:
              'festi-page-in 0.26s cubic-bezier(0.25,0.46,0.45,0.94) backwards',
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
  return <div className="h-screen overflow-hidden bg-bg">{children}</div>
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
function getIdParam(params: URLSearchParams): string | undefined {
  const v = params.get('id')
  return v ?? undefined
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
  const { dark } = useUI()
  const [searchParams] = useSearchParams()
  const id = searchParams.get('id') ?? undefined
  const type = searchParams.get('type') ?? 'night'

  return (
    <UserLayout>
      <UserBoothDetail dark={dark} type={type} id={id} />
    </UserLayout>
  )
}

function BoothListRoute() {
  return (
    <UserTabLayout active="map">
      <UserBoothList />
    </UserTabLayout>
  )
}

function WaitingRegisterRoute() {
  const { dark } = useUI()
  const [searchParams] = useSearchParams()
  const id = searchParams.get('id') ?? undefined
  return (
    <UserLayout>
      <UserWaitingRegister dark={dark} id={id} />
    </UserLayout>
  )
}
function WaitingStatusRoute() {
  const { dark } = useUI()
  return (
    <UserTabLayout active="wait">
      <UserWaitingStatus dark={dark} />
    </UserTabLayout>
  )
}
function WaitingDetailRoute() {
  const { dark } = useUI()
  const [searchParams] = useSearchParams()
  const id = getIdParam(searchParams)
  return (
    <UserTabLayout active="wait">
      <UserWaitingDetail dark={dark} id={id} />
    </UserTabLayout>
  )
}
function MyRoute() {
  const { dark } = useUI()
  return (
    <UserTabLayout active="me">
      <UserMy dark={dark} />
    </UserTabLayout>
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
    <div className="fixed inset-0">
      <UserSplash dark={dark} />
    </div>
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
      <Routes>
        <Route
          path={ROUTES.ROOT}
          element={<Navigate to={ROUTES.SPLASH} replace />}
        />
        <Route path={ROUTES.SPLASH} element={<SplashRoute />} />
        <Route path={ROUTES.OFF_SEASON} element={<OffSeasonRoute />} />
        {/* ── 일반 사용자 (USER) ── */}
        <Route
          path={ROUTES.HOME}
          element={
            <RequireRole roles={['USER']} redirectTo={ROUTES.LOGIN}>
              <HomeRoute />
            </RequireRole>
          }
        />
        <Route
          path={ROUTES.MAP}
          element={
            <RequireRole roles={['USER']} redirectTo={ROUTES.LOGIN}>
              <MapRoute />
            </RequireRole>
          }
        />
        <Route
          path={ROUTES.BOOTH}
          element={
            <RequireRole roles={['USER']} redirectTo={ROUTES.LOGIN}>
              <BoothRoute />
            </RequireRole>
          }
        />
        <Route
          path={ROUTES.BOOTHS}
          element={
            <RequireRole roles={['USER']} redirectTo={ROUTES.LOGIN}>
              <BoothListRoute />
            </RequireRole>
          }
        />
        <Route
          path="/waitings"
          element={<Navigate to={ROUTES.WAITING} replace />}
        />
        <Route
          path={ROUTES.WAITING}
          element={
            <RequireRole roles={['USER']} redirectTo={ROUTES.LOGIN}>
              <WaitingStatusRoute />
            </RequireRole>
          }
        />
        <Route
          path={ROUTES.WAITING_REGISTER}
          element={
            <RequireRole roles={['USER']} redirectTo={ROUTES.LOGIN}>
              <WaitingRegisterRoute />
            </RequireRole>
          }
        />
        <Route
          path={ROUTES.WAITING_DETAIL}
          element={
            <RequireRole roles={['USER']} redirectTo={ROUTES.LOGIN}>
              <WaitingDetailRoute />
            </RequireRole>
          }
        />
        <Route
          path={ROUTES.TRUCK}
          element={<Navigate to={boothUrl('truck')} replace />}
        />
        <Route
          path={ROUTES.MY}
          element={
            <RequireRole roles={['USER']} redirectTo={ROUTES.LOGIN}>
              <MyRoute />
            </RequireRole>
          }
        />

        {/* ── Public ── */}
        <Route path={ROUTES.LOGIN} element={<LoginRoute />} />
        <Route path={ROUTES.ONBOARDING} element={<OnboardingRoute />} />

        {/* ── 총 관리자 (FESTIVAL_ADMIN) ── */}
        <Route
          path={ROUTES.ADMIN.FESTIVAL}
          element={
            <RequireRole
              roles={['FESTIVAL_ADMIN']}
              redirectTo={ROUTES.BOOTH_ADMIN.LOGIN}
            >
              <AdminFestivalRoute />
            </RequireRole>
          }
        />
        <Route
          path={ROUTES.ADMIN.BOOTHS}
          element={
            <RequireRole
              roles={['FESTIVAL_ADMIN']}
              redirectTo={ROUTES.BOOTH_ADMIN.LOGIN}
            >
              <AdminBoothsRoute />
            </RequireRole>
          }
        />
        <Route
          path={ROUTES.ADMIN.TRUCKS}
          element={
            <RequireRole
              roles={['FESTIVAL_ADMIN']}
              redirectTo={ROUTES.BOOTH_ADMIN.LOGIN}
            >
              <AdminFoodTrucksRoute />
            </RequireRole>
          }
        />
        <Route
          path={ROUTES.ADMIN.BOOTH_REQUESTS}
          element={
            <RequireRole
              roles={['FESTIVAL_ADMIN']}
              redirectTo={ROUTES.BOOTH_ADMIN.LOGIN}
            >
              <AdminBoothRequestsRoute />
            </RequireRole>
          }
        />
        <Route
          path={ROUTES.ADMIN.TIMETABLE}
          element={
            <RequireRole
              roles={['FESTIVAL_ADMIN']}
              redirectTo={ROUTES.BOOTH_ADMIN.LOGIN}
            >
              <AdminTimetableRoute />
            </RequireRole>
          }
        />
        <Route
          path={ROUTES.ADMIN.NOTICES}
          element={
            <RequireRole
              roles={['FESTIVAL_ADMIN']}
              redirectTo={ROUTES.BOOTH_ADMIN.LOGIN}
            >
              <AdminNoticesRoute />
            </RequireRole>
          }
        />

        {/* ── 부스 관리자 (BOOTH_MANAGER) ── */}
        <Route
          path={ROUTES.BOOTH_ADMIN.LOGIN}
          element={<BoothAdminLoginRoute />}
        />
        <Route
          path={ROUTES.BOOTH_ADMIN.REGISTER}
          element={<BoothAdminRegisterRoute />}
        />
        <Route
          path={ROUTES.BOOTH_ADMIN.DASHBOARD}
          element={
            <RequireRole
              roles={['BOOTH_MANAGER']}
              redirectTo={ROUTES.BOOTH_ADMIN.LOGIN}
            >
              <BoothAdminDashboardRoute />
            </RequireRole>
          }
        />
      </Routes>
    </>
  )
}
