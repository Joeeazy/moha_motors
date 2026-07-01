import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { listAdmins, createAdmin, deleteAdmin } from '../../api/admin/auth'
import { useAuth } from '../../contexts/AuthContext'
import PasswordInput from '../../components/ui/PasswordInput'

export default function Admins() {
  const qc = useQueryClient()
  const { user } = useAuth()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null)
  const [error, setError] = useState('')

  const { data: admins, isLoading } = useQuery({
    queryKey: ['admin', 'admins'],
    queryFn: listAdmins,
    staleTime: 0,
  })

  const invalidate = () => qc.invalidateQueries({ queryKey: ['admin', 'admins'] })

  const createMutation = useMutation({
    mutationFn: () => createAdmin({ name: name.trim(), email: email.trim(), password }),
    onSuccess: () => {
      setName(''); setEmail(''); setPassword(''); setError('')
      invalidate()
    },
    onError: (err) => {
      const detail = (err as AxiosError<{ detail?: string }>).response?.data?.detail
      setError(detail || 'Could not create admin. Check the details and try again.')
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteAdmin(id),
    onSuccess: () => { setConfirmDelete(null); invalidate() },
    onError: (err) => {
      const detail = (err as AxiosError<{ detail?: string }>).response?.data?.detail
      setError(detail || 'Could not delete admin.')
    },
  })

  const canSubmit = name.trim() && email.trim() && password.length >= 8

  return (
    <div className="p-6 lg:p-8 max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Admins</h1>
        <p className="text-gray-500 text-sm mt-0.5">{admins?.length ?? 0} admin accounts</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 mb-5">
          {error}
          <button onClick={() => setError('')} className="ml-3 font-semibold underline text-xs">Dismiss</button>
        </div>
      )}

      {/* Add admin */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 mb-5">
        <h2 className="text-sm font-bold text-gray-900 mb-3">Add Admin</h2>
        <form
          onSubmit={e => { e.preventDefault(); if (canSubmit) createMutation.mutate() }}
          className="space-y-3"
        >
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Full name"
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-maroon-700/30 focus:border-maroon-700 transition-colors"
          />
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Email address"
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-maroon-700/30 focus:border-maroon-700 transition-colors"
          />
          <PasswordInput
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Password (min 8 characters)"
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-maroon-700/30 focus:border-maroon-700 transition-colors"
          />
          <button
            type="submit"
            disabled={!canSubmit || createMutation.isPending}
            className="px-4 py-2.5 bg-maroon-800 text-white rounded-xl text-sm font-semibold hover:bg-maroon-900 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
          >
            {createMutation.isPending ? 'Creating...' : 'Create Admin'}
          </button>
        </form>
      </div>

      {/* Admin list */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="divide-y divide-gray-50">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 p-4 animate-pulse">
                <div className="w-10 h-10 bg-gray-200 rounded-full shrink-0" />
                <div className="h-4 bg-gray-200 rounded w-1/3" />
              </div>
            ))}
          </div>
        ) : admins?.length === 0 ? (
          <div className="text-center py-16 text-gray-400 text-sm">No admins yet.</div>
        ) : (
          <ul className="divide-y divide-gray-50">
            {admins?.map((a) => (
              <li key={a.id} className="flex items-center gap-4 px-5 py-3">
                <div className="w-10 h-10 rounded-full bg-maroon-800 flex items-center justify-center text-white text-sm font-bold shrink-0">
                  {a.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">
                    {a.name}
                    {a.id === user?.id && (
                      <span className="ml-2 text-xs font-medium text-maroon-700">(you)</span>
                    )}
                  </p>
                  <p className="text-xs text-gray-500 truncate">{a.email}</p>
                </div>

                {a.id !== user?.id && (
                  <div className="flex items-center gap-2 shrink-0">
                    {confirmDelete === a.id ? (
                      <>
                        <button
                          onClick={() => deleteMutation.mutate(a.id)}
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
                      <button onClick={() => setConfirmDelete(a.id)} className="text-xs text-red-500 hover:text-red-700 font-medium px-2 py-1">
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
