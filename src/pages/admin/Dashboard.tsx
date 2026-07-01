import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { fetchStats } from '../../api/admin/stats'
import { useAuth } from '../../contexts/AuthContext'

function StatCard({
  label,
  value,
  sub,
  color,
}: {
  label: string
  value: number | undefined
  sub?: string
  color: string
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">{label}</p>
      <p className={`text-3xl font-bold ${color}`}>{value ?? '—'}</p>
      {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
    </div>
  )
}

export default function Dashboard() {
  const { user } = useAuth()
  const { data: stats, isLoading } = useQuery({
    queryKey: ['admin', 'stats'],
    queryFn: fetchStats,
    staleTime: 1000 * 60,
  })

  return (
    <div className="p-6 lg:p-8 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="mb-8">
        <p className="text-xs font-semibold text-maroon-700 uppercase tracking-wider mb-1">
          Welcome back
        </p>
        <h1 className="text-2xl font-bold text-gray-900">{user?.name}</h1>
        <p className="text-gray-500 text-sm mt-1">Here's what's happening in your dealership.</p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 animate-pulse">
              <div className="h-3 bg-gray-200 rounded w-2/3 mb-3" />
              <div className="h-8 bg-gray-200 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : (
        <>
          {/* Vehicles */}
          <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Inventory</h2>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            <StatCard label="Total Vehicles" value={stats?.total_vehicles} color="text-gray-900" />
            <StatCard label="Available" value={stats?.available_vehicles} color="text-emerald-600" sub="For sale" />
            <StatCard label="Sold" value={stats?.sold_vehicles} color="text-gray-500" sub="Marked sold" />
          </div>

          {/* Inquiries */}
          <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Inquiries</h2>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            <StatCard label="Total Inquiries" value={stats?.total_inquiries} color="text-gray-900" />
            <StatCard label="Unread" value={stats?.unread_inquiries} color="text-orange-600" sub="Needs attention" />
            <StatCard label="Resolved" value={stats?.resolved_inquiries} color="text-emerald-600" />
          </div>

          {/* Catalog */}
          <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Catalog</h2>
          <div className="grid grid-cols-2 gap-4 mb-10">
            <StatCard label="Brands" value={stats?.total_brands} color="text-gray-900" />
            <StatCard label="Categories" value={stats?.total_categories} color="text-gray-900" />
          </div>
        </>
      )}

      {/* Quick actions */}
      <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Quick Actions</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {[
          { to: '/admin/vehicles/new', label: 'Add New Vehicle', desc: 'List a new car in inventory', icon: '+' },
          { to: '/admin/inquiries', label: 'View Inquiries', desc: `${stats?.unread_inquiries ?? 0} unread`, icon: '✉' },
          { to: '/admin/brands', label: 'Manage Brands', desc: `${stats?.total_brands ?? 0} brands`, icon: '★' },
        ].map(({ to, label, desc, icon }) => (
          <Link
            key={to}
            to={to}
            className="flex items-center gap-4 bg-white border border-gray-100 rounded-xl p-4 hover:border-maroon-300 hover:shadow-sm transition-all group"
          >
            <div className="w-10 h-10 rounded-lg bg-maroon-50 text-maroon-800 flex items-center justify-center text-lg font-bold shrink-0 group-hover:bg-maroon-100 transition-colors">
              {icon}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-gray-900 group-hover:text-maroon-800 transition-colors">{label}</p>
              <p className="text-xs text-gray-400 mt-0.5">{desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
