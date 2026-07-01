import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchAdminVehicles, deleteVehicle } from '../../api/admin/vehicles'
import { fetchAdminBrands } from '../../api/admin/brands'
import { formatPrice, getPrimaryImage } from '../../utils/format'
import { notifySuccess, notifyError } from '../../lib/notify'
import { confirmDialog } from '../../lib/confirm'
import type { AdminVehicleListItem } from '../../types/admin'

const PAGE_SIZE = 20

export default function Vehicles() {
  const qc = useQueryClient()
  const [page, setPage] = useState(0)
  const [isAvailable, setIsAvailable] = useState<boolean | undefined>(undefined)
  const [brandId, setBrandId] = useState<number | undefined>(undefined)

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'vehicles', page, isAvailable, brandId],
    queryFn: () => fetchAdminVehicles({ skip: page * PAGE_SIZE, limit: PAGE_SIZE, is_available: isAvailable, brand_id: brandId }),
    staleTime: 0,
  })

  const { data: brands } = useQuery({
    queryKey: ['admin', 'brands'],
    queryFn: fetchAdminBrands,
    staleTime: 1000 * 60 * 10,
  })

  const deleteMutation = useMutation({
    mutationFn: deleteVehicle,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'vehicles'] })
      qc.invalidateQueries({ queryKey: ['admin', 'stats'] })
      notifySuccess('Vehicle deleted.')
    },
    onError: (err) => notifyError(err, 'Could not delete the vehicle.'),
  })

  const handleDelete = async (v: AdminVehicleListItem) => {
    const ok = await confirmDialog({
      title: 'Delete this vehicle?',
      text: `"${v.title}" and its images will be permanently removed. This cannot be undone.`,
      confirmText: 'Delete',
      danger: true,
    })
    if (ok) deleteMutation.mutate(v.id)
  }

  const totalPages = data ? Math.ceil(data.total / PAGE_SIZE) : 1

  return (
    <div className="p-6 lg:p-8 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Inventory</h1>
          <p className="text-gray-500 text-sm mt-0.5">
            {data ? `${data.total} vehicles` : 'Loading...'}
          </p>
        </div>
        <Link
          to="/admin/vehicles/new"
          className="inline-flex items-center gap-2 bg-maroon-800 text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-maroon-900 transition-colors shadow-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Vehicle
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-5">
        <select
          value={isAvailable === undefined ? '' : String(isAvailable)}
          onChange={(e) => {
            setPage(0)
            setIsAvailable(e.target.value === '' ? undefined : e.target.value === 'true')
          }}
          className="text-sm border border-gray-200 rounded-xl px-3 py-2 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-maroon-700/30"
        >
          <option value="">All Status</option>
          <option value="true">Available</option>
          <option value="false">Sold</option>
        </select>

        <select
          value={brandId ?? ''}
          onChange={(e) => { setPage(0); setBrandId(e.target.value ? Number(e.target.value) : undefined) }}
          className="text-sm border border-gray-200 rounded-xl px-3 py-2 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-maroon-700/30"
        >
          <option value="">All Brands</option>
          {brands?.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="divide-y divide-gray-50">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 p-4 animate-pulse">
                <div className="w-14 h-10 bg-gray-200 rounded-lg shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-3.5 bg-gray-200 rounded w-1/3" />
                  <div className="h-3 bg-gray-100 rounded w-1/4" />
                </div>
              </div>
            ))}
          </div>
        ) : data?.items.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <p className="text-sm font-medium">No vehicles found</p>
            <Link to="/admin/vehicles/new" className="text-maroon-700 text-sm font-semibold mt-2 inline-block hover:underline">
              Add your first vehicle
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider px-4 py-3">Vehicle</th>
                  <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider px-4 py-3 hidden sm:table-cell">Brand</th>
                  <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider px-4 py-3 hidden md:table-cell">Year</th>
                  <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider px-4 py-3">Price</th>
                  <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider px-4 py-3">Status</th>
                  <th className="text-right text-xs font-semibold text-gray-400 uppercase tracking-wider px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {data?.items.map((v) => (
                  <tr key={v.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={getPrimaryImage(v.images)}
                          alt=""
                          className="w-14 h-10 rounded-lg object-cover shrink-0 bg-gray-100"
                          onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=200&q=60' }}
                        />
                        <div className="min-w-0">
                          <p className="font-semibold text-gray-900 truncate">{v.title}</p>
                          <p className="text-xs text-gray-400 sm:hidden">{v.brand.name} · {v.year}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell text-gray-600">{v.brand.name}</td>
                    <td className="px-4 py-3 hidden md:table-cell text-gray-600">{v.year}</td>
                    <td className="px-4 py-3 font-semibold text-gray-900">{formatPrice(v.price)}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                        v.is_available
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-gray-100 text-gray-500'
                      }`}>
                        {v.is_available ? 'Available' : 'Sold'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/admin/vehicles/${v.id}/edit`}
                          className="text-xs font-semibold text-gray-600 hover:text-maroon-700 px-3 py-1.5 rounded-lg border border-gray-200 hover:border-maroon-300 transition-colors"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(v)}
                          disabled={deleteMutation.isPending}
                          className="text-xs font-semibold text-red-600 hover:text-red-700 px-3 py-1.5 rounded-lg border border-red-100 hover:border-red-300 transition-colors disabled:opacity-60"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4 text-sm">
          <p className="text-gray-500">
            Page {page + 1} of {totalPages}
          </p>
          <div className="flex gap-2">
            <button
              disabled={page === 0}
              onClick={() => setPage(p => p - 1)}
              className="px-4 py-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            <button
              disabled={page >= totalPages - 1}
              onClick={() => setPage(p => p + 1)}
              className="px-4 py-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
