const sidebarBg = { backgroundColor: '#2a2a2e' }

/** Content-area skeleton — used inside AdminLayout while a child page loads. */
export function AdminContentSkeleton() {
  return (
    <div className="p-6 lg:p-8 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="skeleton h-3 w-28 rounded mb-3" />
        <div className="skeleton h-7 w-56 rounded mb-2" />
        <div className="skeleton h-4 w-72 rounded" />
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <div className="skeleton h-3 w-2/3 rounded mb-3" />
            <div className="skeleton h-8 w-1/2 rounded" />
          </div>
        ))}
      </div>

      {/* Rows */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm divide-y divide-gray-100">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 p-4">
            <div className="skeleton w-14 h-14 rounded-lg shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="skeleton h-4 w-1/3 rounded mb-2" />
              <div className="skeleton h-3 w-1/4 rounded" />
            </div>
            <div className="skeleton h-8 w-20 rounded-lg shrink-0" />
          </div>
        ))}
      </div>
    </div>
  )
}

/** Full admin shell skeleton — sidebar + content. Used during auth check / initial layout load. */
export default function AdminSkeleton() {
  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-60 lg:shrink-0 bg-gray-900">
        <div className="flex items-center gap-3 px-5 py-5 border-b border-gray-800">
          <div className="skeleton w-8 h-8 rounded-lg" style={sidebarBg} />
          <div className="flex-1">
            <div className="skeleton h-3 w-24 rounded mb-1.5" style={sidebarBg} />
            <div className="skeleton h-2.5 w-16 rounded" style={sidebarBg} />
          </div>
        </div>
        <div className="flex-1 px-3 py-4 space-y-2">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="skeleton h-10 w-full rounded-lg" style={sidebarBg} />
          ))}
        </div>
        <div className="px-3 py-4 border-t border-gray-800">
          <div className="skeleton h-10 w-full rounded-lg" style={sidebarBg} />
        </div>
      </aside>

      {/* Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile header */}
        <div className="lg:hidden flex items-center gap-3 px-4 py-3 bg-white border-b border-gray-200">
          <div className="skeleton w-9 h-9 rounded-lg" />
          <div className="skeleton h-4 w-40 rounded" />
        </div>
        <main className="flex-1 overflow-y-auto">
          <AdminContentSkeleton />
        </main>
      </div>
    </div>
  )
}
