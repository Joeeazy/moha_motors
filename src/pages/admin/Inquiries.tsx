import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchAdminInquiries, updateInquiryStatus, deleteInquiry } from '../../api/admin/inquiries'
import type { AdminInquiry } from '../../types/admin'

const PAGE_SIZE = 25

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-KE', {
    day: '2-digit', month: 'short', year: 'numeric',
  })
}

export default function Inquiries() {
  const qc = useQueryClient()
  const [page, setPage] = useState(0)
  const [filterRead, setFilterRead] = useState<boolean | undefined>(undefined)
  const [filterResolved, setFilterResolved] = useState<boolean | undefined>(undefined)
  const [expanded, setExpanded] = useState<number | null>(null)
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null)

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'inquiries', page, filterRead, filterResolved],
    queryFn: () => fetchAdminInquiries({
      skip: page * PAGE_SIZE, limit: PAGE_SIZE,
      is_read: filterRead, is_resolved: filterResolved,
    }),
    staleTime: 0,
  })

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ['admin', 'inquiries'] })
    qc.invalidateQueries({ queryKey: ['admin', 'stats'] })
  }

  const statusMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: { is_read?: boolean; is_resolved?: boolean } }) =>
      updateInquiryStatus(id, payload),
    onSuccess: () => invalidate(),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteInquiry(id),
    onSuccess: () => { setConfirmDelete(null); invalidate() },
  })

  const totalPages = data ? Math.ceil(data.total / PAGE_SIZE) : 1

  return (
    <div className="p-6 lg:p-8 max-w-[1400px] mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Inquiries</h1>
        <p className="text-gray-500 text-sm mt-0.5">
          {data ? `${data.total} total` : 'Loading...'}
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-5">
        <select
          value={filterRead === undefined ? '' : String(filterRead)}
          onChange={e => { setPage(0); setFilterRead(e.target.value === '' ? undefined : e.target.value === 'true') }}
          className="text-sm border border-gray-200 rounded-xl px-3 py-2 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-maroon-700/30"
        >
          <option value="">All (read/unread)</option>
          <option value="false">Unread</option>
          <option value="true">Read</option>
        </select>

        <select
          value={filterResolved === undefined ? '' : String(filterResolved)}
          onChange={e => { setPage(0); setFilterResolved(e.target.value === '' ? undefined : e.target.value === 'true') }}
          className="text-sm border border-gray-200 rounded-xl px-3 py-2 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-maroon-700/30"
        >
          <option value="">All (resolved/open)</option>
          <option value="false">Open</option>
          <option value="true">Resolved</option>
        </select>
      </div>

      {/* Inquiry list */}
      <div className="space-y-3">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/3 mb-2" />
              <div className="h-3 bg-gray-100 rounded w-2/3" />
            </div>
          ))
        ) : data?.items.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm text-center py-20 text-gray-400 text-sm">
            No inquiries found.
          </div>
        ) : (
          data?.items.map((inquiry: AdminInquiry) => (
            <div
              key={inquiry.id}
              className={`bg-white rounded-xl border shadow-sm transition-colors ${
                !inquiry.is_read ? 'border-maroon-200 bg-maroon-50/30' : 'border-gray-100'
              }`}
            >
              {/* Header row */}
              <div
                className="flex items-start gap-4 p-4 sm:p-5 cursor-pointer"
                onClick={() => {
                  setExpanded(expanded === inquiry.id ? null : inquiry.id)
                  if (!inquiry.is_read) {
                    statusMutation.mutate({ id: inquiry.id, payload: { is_read: true } })
                  }
                }}
              >
                {/* Unread dot */}
                <div className="mt-1.5 shrink-0">
                  {!inquiry.is_read ? (
                    <div className="w-2.5 h-2.5 rounded-full bg-maroon-600" />
                  ) : (
                    <div className="w-2.5 h-2.5 rounded-full bg-gray-200" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                    <p className="font-semibold text-gray-900 text-sm">{inquiry.name}</p>
                    <span className="text-gray-400 text-xs">{inquiry.email}</span>
                    <span className="text-gray-400 text-xs hidden sm:inline">·</span>
                    <span className="text-gray-400 text-xs hidden sm:inline">{inquiry.phone}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Re: <span className="font-medium text-gray-700">
                      {inquiry.vehicle ? inquiry.vehicle.title : 'General Inquiry'}
                    </span>
                    <span className="mx-1.5">·</span>
                    {formatDate(inquiry.created_at)}
                  </p>
                  {expanded !== inquiry.id && (
                    <p className="text-sm text-gray-600 mt-1.5 line-clamp-1">{inquiry.message}</p>
                  )}
                </div>

                {/* Badges */}
                <div className="flex items-center gap-2 shrink-0">
                  {inquiry.is_resolved && (
                    <span className="text-xs font-semibold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">
                      Resolved
                    </span>
                  )}
                  <svg
                    className={`w-4 h-4 text-gray-400 transition-transform ${expanded === inquiry.id ? 'rotate-180' : ''}`}
                    fill="none" stroke="currentColor" viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              {/* Expanded */}
              {expanded === inquiry.id && (
                <div className="px-4 sm:px-5 pb-4 sm:pb-5 border-t border-gray-100 pt-4">
                  <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap mb-4">
                    {inquiry.message}
                  </p>

                  <div className="flex flex-wrap items-center gap-3">
                    <a
                      href={`mailto:${inquiry.email}`}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-white bg-maroon-800 hover:bg-maroon-900 px-3 py-1.5 rounded-lg transition-colors"
                    >
                      Reply by email
                    </a>
                    <a
                      href={`tel:${inquiry.phone}`}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-700 border border-gray-200 hover:border-gray-300 px-3 py-1.5 rounded-lg transition-colors"
                    >
                      Call {inquiry.phone}
                    </a>

                    <button
                      onClick={() => statusMutation.mutate({ id: inquiry.id, payload: { is_resolved: !inquiry.is_resolved } })}
                      disabled={statusMutation.isPending}
                      className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-colors disabled:opacity-60 ${
                        inquiry.is_resolved
                          ? 'border-gray-200 text-gray-500 hover:border-gray-300'
                          : 'border-emerald-200 text-emerald-700 hover:bg-emerald-50'
                      }`}
                    >
                      {inquiry.is_resolved ? 'Mark as open' : 'Mark as resolved'}
                    </button>

                    <div className="ml-auto">
                      {confirmDelete === inquiry.id ? (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => deleteMutation.mutate(inquiry.id)}
                            disabled={deleteMutation.isPending}
                            className="text-xs font-bold text-white bg-red-600 hover:bg-red-700 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-60"
                          >
                            {deleteMutation.isPending ? '...' : 'Delete'}
                          </button>
                          <button onClick={() => setConfirmDelete(null)} className="text-xs text-gray-400 hover:text-gray-600">
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setConfirmDelete(inquiry.id)}
                          className="text-xs text-red-500 hover:text-red-700 font-medium"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-5 text-sm">
          <p className="text-gray-500">Page {page + 1} of {totalPages}</p>
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
