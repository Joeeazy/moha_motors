import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

import { AuthProvider } from './contexts/AuthContext'
import { FavoritesProvider } from './contexts/FavoritesContext'
import ProtectedRoute from './components/admin/ProtectedRoute'

import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import InventorySkeleton from './components/ui/InventorySkeleton'
import CarDetailSkeleton from './components/ui/CarDetailSkeleton'
import ContactSkeleton from './components/ui/ContactSkeleton'
import AdminSkeleton from './components/ui/AdminSkeleton'

import Home from './pages/Home'

// Lazy-loaded routes — keep the landing bundle lean
const Inventory = lazy(() => import('./pages/Inventory'))
const CarDetail = lazy(() => import('./pages/CarDetail'))
const Contact = lazy(() => import('./pages/Contact'))
const Favorites = lazy(() => import('./pages/Favorites'))
const NotFound = lazy(() => import('./pages/NotFound'))

const AdminLayout = lazy(() => import('./components/admin/AdminLayout'))
const Login = lazy(() => import('./pages/admin/Login'))
const Dashboard = lazy(() => import('./pages/admin/Dashboard'))
const Vehicles = lazy(() => import('./pages/admin/Vehicles'))
const VehicleForm = lazy(() => import('./pages/admin/VehicleForm'))
const Brands = lazy(() => import('./pages/admin/Brands'))
const Categories = lazy(() => import('./pages/admin/Categories'))
const Inquiries = lazy(() => import('./pages/admin/Inquiries'))
const Profile = lazy(() => import('./pages/admin/Profile'))
const Admins = lazy(() => import('./pages/admin/Admins'))

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
})

function PageFallback() {
  return (
    <div className="min-h-[60vh] max-w-[1600px] mx-auto w-full px-4 sm:px-6 lg:px-8 py-16">
      <div className="skeleton h-8 w-1/3 rounded mb-4" />
      <div className="skeleton h-4 w-2/3 rounded mb-2" />
      <div className="skeleton h-4 w-1/2 rounded" />
    </div>
  )
}

function BuyerLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-1">
        <Outlet />
      </div>
      <Footer />
    </div>
  )
}

/** Wrap a lazy page in a Suspense boundary with a layout-matched skeleton. */
function withSkeleton(node: React.ReactNode, fallback: React.ReactNode) {
  return <Suspense fallback={fallback}>{node}</Suspense>
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <FavoritesProvider>
        <BrowserRouter>
          <Routes>
            {/* Buyer-facing routes */}
            <Route element={<BuyerLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/inventory" element={withSkeleton(<Inventory />, <InventorySkeleton />)} />
              <Route path="/inventory/:id" element={withSkeleton(<CarDetail />, <CarDetailSkeleton />)} />
              <Route path="/contact" element={withSkeleton(<Contact />, <ContactSkeleton />)} />
              <Route path="/favorites" element={withSkeleton(<Favorites />, <PageFallback />)} />
              <Route path="*" element={withSkeleton(<NotFound />, <PageFallback />)} />
            </Route>

            {/* Admin routes */}
            <Route
              path="/admin/login"
              element={
                <Suspense fallback={<PageFallback />}>
                  <Login />
                </Suspense>
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <Suspense fallback={<AdminSkeleton />}>
                    <AdminLayout />
                  </Suspense>
                </ProtectedRoute>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="vehicles" element={<Vehicles />} />
              <Route path="vehicles/new" element={<VehicleForm />} />
              <Route path="vehicles/:id/edit" element={<VehicleForm />} />
              <Route path="brands" element={<Brands />} />
              <Route path="categories" element={<Categories />} />
              <Route path="inquiries" element={<Inquiries />} />
              <Route path="profile" element={<Profile />} />
              <Route path="admins" element={<Admins />} />
              {/* Unknown /admin/* subpaths */}
              <Route path="*" element={withSkeleton(<NotFound />, <PageFallback />)} />
            </Route>
          </Routes>
        </BrowserRouter>
        </FavoritesProvider>
      </AuthProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}
