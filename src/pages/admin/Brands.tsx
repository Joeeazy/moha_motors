import { useState, useRef } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  fetchAdminBrands,
  createBrand,
  updateBrand,
  deleteBrand,
  uploadBrandLogo,
} from '../../api/admin/brands'
import type { Brand } from '../../types/index'

export default function Brands() {
  const qc = useQueryClient()
  const [newName, setNewName] = useState('')
  const [editId, setEditId] = useState<number | null>(null)
  const [editName, setEditName] = useState('')
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null)
  const [error, setError] = useState('')
  const logoRefs = useRef<Record<number, HTMLInputElement | null>>({})

  const { data: brands, isLoading } = useQuery({
    queryKey: ['admin', 'brands'],
    queryFn: fetchAdminBrands,
    staleTime: 0,
  })

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ['admin', 'brands'] })
    qc.invalidateQueries({ queryKey: ['admin', 'stats'] })
  }

  const createMutation = useMutation({
    mutationFn: () => createBrand(newName.trim()),
    onSuccess: () => { setNewName(''); invalidate() },
    onError: () => setError('Brand name already exists or is invalid.'),
  })

  const updateMutation = useMutation({
    mutationFn: () => updateBrand(editId!, editName.trim()),
    onSuccess: () => { setEditId(null); setEditName(''); invalidate() },
    onError: () => setError('Could not update brand.'),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteBrand(id),
    onSuccess: () => { setConfirmDelete(null); invalidate() },
    onError: () => setError('Cannot delete a brand that has vehicles.'),
  })

  const logoMutation = useMutation({
    mutationFn: ({ id, file }: { id: number; file: File }) => uploadBrandLogo(id, file),
    onSuccess: () => invalidate(),
    onError: () => setError('Logo upload failed. Use JPEG/PNG/WebP under 5MB.'),
  })

  const handleLogoUpload = (brand: Brand, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    logoMutation.mutate({ id: brand.id, file })
    e.target.value = ''
  }

  const startEdit = (b: Brand) => { setEditId(b.id); setEditName(b.name); setError('') }

  return (
    <div className="p-6 lg:p-8 max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Brands</h1>
        <p className="text-gray-500 text-sm mt-0.5">{brands?.length ?? 0} brands</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 mb-5">
          {error}
          <button onClick={() => setError('')} className="ml-3 font-semibold underline text-xs">Dismiss</button>
        </div>
      )}

      {/* Add brand */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 mb-5">
        <h2 className="text-sm font-bold text-gray-900 mb-3">Add Brand</h2>
        <form
          onSubmit={e => { e.preventDefault(); if (newName.trim()) createMutation.mutate() }}
          className="flex gap-3"
        >
          <input
            type="text"
            value={newName}
            onChange={e => setNewName(e.target.value)}
            placeholder="Brand name"
            className="flex-1 border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-maroon-700/30 focus:border-maroon-700 transition-colors"
          />
          <button
            type="submit"
            disabled={!newName.trim() || createMutation.isPending}
            className="px-4 py-2.5 bg-maroon-800 text-white rounded-xl text-sm font-semibold hover:bg-maroon-900 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
          >
            {createMutation.isPending ? '...' : 'Add'}
          </button>
        </form>
      </div>

      {/* Brand list */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="divide-y divide-gray-50">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 p-4 animate-pulse">
                <div className="w-10 h-10 bg-gray-200 rounded-xl shrink-0" />
                <div className="h-4 bg-gray-200 rounded w-1/3" />
              </div>
            ))}
          </div>
        ) : brands?.length === 0 ? (
          <div className="text-center py-16 text-gray-400 text-sm">No brands yet. Add one above.</div>
        ) : (
          <ul className="divide-y divide-gray-50">
            {brands?.map((b) => (
              <li key={b.id} className="flex items-center gap-4 px-5 py-3">
                {/* Logo */}
                <div
                  className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center shrink-0 overflow-hidden cursor-pointer group relative"
                  onClick={() => logoRefs.current[b.id]?.click()}
                  title="Click to upload logo"
                >
                  {b.logo_url ? (
                    <img src={b.logo_url} alt={b.name} className="w-full h-full object-contain p-1" />
                  ) : (
                    <span className="text-sm font-bold text-gray-400">{b.name.charAt(0)}</span>
                  )}
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <input
                    ref={el => { logoRefs.current[b.id] = el }}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                    onChange={e => handleLogoUpload(b, e)}
                  />
                </div>

                {/* Name (editable) */}
                {editId === b.id ? (
                  <form
                    onSubmit={e => { e.preventDefault(); updateMutation.mutate() }}
                    className="flex-1 flex gap-2"
                  >
                    <input
                      autoFocus
                      type="text"
                      value={editName}
                      onChange={e => setEditName(e.target.value)}
                      className="flex-1 border border-maroon-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-maroon-700/30"
                    />
                    <button type="submit" disabled={updateMutation.isPending} className="text-xs font-bold text-maroon-800 hover:text-maroon-900 px-2">
                      {updateMutation.isPending ? '...' : 'Save'}
                    </button>
                    <button type="button" onClick={() => setEditId(null)} className="text-xs text-gray-400 hover:text-gray-600 px-1">
                      Cancel
                    </button>
                  </form>
                ) : (
                  <span className="flex-1 text-sm font-semibold text-gray-900">{b.name}</span>
                )}

                {/* Actions */}
                {editId !== b.id && (
                  <div className="flex items-center gap-2 shrink-0">
                    <button onClick={() => startEdit(b)} className="text-xs text-gray-500 hover:text-gray-700 font-medium px-2 py-1">
                      Edit
                    </button>
                    {confirmDelete === b.id ? (
                      <>
                        <button
                          onClick={() => deleteMutation.mutate(b.id)}
                          disabled={deleteMutation.isPending}
                          className="text-xs font-bold text-white bg-red-600 hover:bg-red-700 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-60"
                        >
                          {deleteMutation.isPending ? '...' : 'Confirm'}
                        </button>
                        <button onClick={() => setConfirmDelete(null)} className="text-xs text-gray-400 hover:text-gray-600 px-1">
                          Cancel
                        </button>
                      </>
                    ) : (
                      <button onClick={() => setConfirmDelete(b.id)} className="text-xs text-red-500 hover:text-red-700 font-medium px-2 py-1">
                        Delete
                      </button>
                    )}
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
