import { Navigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import AdminSkeleton from '../ui/AdminSkeleton'

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return <AdminSkeleton />
  }

  if (!user) return <Navigate to="/admin/login" replace />

  return <>{children}</>
}
