import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  fetchAdminCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../../api/admin/categories'
import type { Category } from '../../types/index'
import { notifySuccess, notifyError } from '../../lib/notify'
import { confirmDialog } from '../../lib/confirm'

export default function Categories() {
  const qc = useQueryClient()
  const [newName, setNewName] = useState('')
  const [editId, setEditId] = useState<number | null>(null)
  const [editName, setEditName] = useState('')

  const { data: categories, isLoading } = useQuery({
    queryKey: ['admin', 'categories'],
    queryFn: fetchAdminCategories,
    staleTime: 0,
  })

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ['admin', 'categories'] })
    qc.invalidateQueries({ queryKey: ['admin', 'stats'] })
  }

  const createMutation = useMutation({
    mutationFn: () => createCategory(newName.trim()),
    onSuccess: () => { setNewName(''); invalidate(); notifySuccess('Category added.') },
    onError: (err) => notifyError(err, 'Category already exists or is invalid.'),
  })

  const updateMutation = useMutation({
    mutationFn: () => updateCategory(editId!, editName.trim()),
    onSuccess: () => { setEditId(null); setEditName(''); invalidate(); notifySuccess('Category updated.') },
    onError: (err) => notifyError(err, 'Could not update category.'),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteCategory(id),
    onSuccess: () => { invalidate(); notifySuccess('Category deleted.') },
    onError: (err) => notifyError(err, 'Cannot delete a category that has vehicles.'),
  })

  const startEdit = (c: Category) => { setEditId(c.id); setEditName(c.name) }

  const handleDelete = async (c: Category) => {
    const ok = await confirmDialog({
      title: 'Delete this category?',
      text: `"${c.name}" will be permanently removed.`,
      confirmText: 'Delete',
      danger: true,
    })
    if (ok) deleteMutation.mutate(c.id)
  }

  return (
    <div className="p-6 lg:p-8 max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
        <p className="text-gray-500 text-sm mt-0.5">{categories?.length ?? 0} categories</p>
      </div>

      {/* Add category */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 mb-5">
        <h2 className="text-sm font-bold text-gray-900 mb-3">Add Category</h2>
        <form
          onSubmit={e => { e.preventDefault(); if (newName.trim()) createMutation.mutate() }}
          className="flex gap-3"
        >
          <input
            type="text"
            value={newName}
            onChange={e => setNewName(e.target.value)}
            placeholder="e.g. SUV, Sedan, Pickup"
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

      {/* Category list */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="divide-y divide-gray-50">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 p-4 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/3" />
              </div>
            ))}
          </div>
        ) : categories?.length === 0 ? (
          <div className="text-center py-16 text-gray-400 text-sm">No categories yet. Add one above.</div>
        ) : (
          <ul className="divide-y divide-gray-50">
            {categories?.map((c) => (
              <li key={c.id} className="flex items-center gap-4 px-5 py-3.5">
                <div className="w-8 h-8 rounded-lg bg-maroon-50 flex items-center justify-center shrink-0">
                  <svg className="w-4 h-4 text-maroon-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                </div>

                {editId === c.id ? (
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
                  <span className="flex-1 text-sm font-semibold text-gray-900">{c.name}</span>
                )}

                {editId !== c.id && (
                  <div className="flex items-center gap-2 shrink-0">
                    <button onClick={() => startEdit(c)} className="text-xs text-gray-500 hover:text-gray-700 font-medium px-2 py-1">
                      Edit
                    </button>
                    <button onClick={() => handleDelete(c)} disabled={deleteMutation.isPending} className="text-xs text-red-500 hover:text-red-700 font-medium px-2 py-1 disabled:opacity-60">
                      Delete
                    </button>
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
