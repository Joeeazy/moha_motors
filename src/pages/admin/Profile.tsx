import { useState, type FormEvent, useEffect } from 'react'
import { useMutation } from '@tanstack/react-query'
import { updateMe, changePassword } from '../../api/admin/auth'
import { useAuth } from '../../contexts/AuthContext'
import PasswordInput from '../../components/ui/PasswordInput'
import { notifySuccess, notifyError } from '../../lib/notify'

export default function Profile() {
  const { user } = useAuth()

  const [profileForm, setProfileForm] = useState({ name: '', email: '' })
  const [pwForm, setPwForm] = useState({ current_password: '', new_password: '', confirm_password: '' })

  useEffect(() => {
    if (user) setProfileForm({ name: user.name, email: user.email })
  }, [user])

  const profileMutation = useMutation({
    mutationFn: () => updateMe({ name: profileForm.name, email: profileForm.email }),
    onSuccess: () => notifySuccess('Profile updated.'),
    onError: (err) => notifyError(err, 'Failed to update. Email may already be in use.'),
  })

  const pwMutation = useMutation({
    mutationFn: () => changePassword(pwForm.current_password, pwForm.new_password),
    onSuccess: () => {
      notifySuccess('Password changed successfully.')
      setPwForm({ current_password: '', new_password: '', confirm_password: '' })
    },
    onError: (err) => notifyError(err, 'Incorrect current password.'),
  })

  const handleProfileSubmit = (e: FormEvent) => {
    e.preventDefault()
    profileMutation.mutate()
  }

  const handlePwSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (pwForm.new_password !== pwForm.confirm_password) {
      return notifyError(null, 'New passwords do not match.')
    }
    if (pwForm.new_password.length < 6) {
      return notifyError(null, 'Password must be at least 6 characters.')
    }
    pwMutation.mutate()
  }

  const inputCls = 'w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-maroon-700/30 focus:border-maroon-700 transition-colors'
  const labelCls = 'block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5'

  return (
    <div className="p-6 lg:p-8 max-w-2xl mx-auto">
      <div className="mb-7">
        <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
        <p className="text-gray-500 text-sm mt-0.5">Manage your account details</p>
      </div>

      {/* Profile details */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 sm:p-6 mb-6">
        <h2 className="text-sm font-bold text-gray-900 mb-5">Account Details</h2>

        <form onSubmit={handleProfileSubmit} className="space-y-4">
          <div>
            <label className={labelCls}>Name</label>
            <input
              type="text"
              required
              value={profileForm.name}
              onChange={e => setProfileForm(prev => ({ ...prev, name: e.target.value }))}
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>Email</label>
            <input
              type="email"
              required
              value={profileForm.email}
              onChange={e => setProfileForm(prev => ({ ...prev, email: e.target.value }))}
              className={inputCls}
            />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={profileMutation.isPending}
              className="px-5 py-2.5 bg-maroon-800 text-white rounded-xl text-sm font-bold hover:bg-maroon-900 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
            >
              {profileMutation.isPending ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>

      {/* Password change */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 sm:p-6">
        <h2 className="text-sm font-bold text-gray-900 mb-5">Change Password</h2>

        <form onSubmit={handlePwSubmit} className="space-y-4">
          <div>
            <label className={labelCls}>Current Password</label>
            <PasswordInput
              required
              value={pwForm.current_password}
              onChange={e => setPwForm(prev => ({ ...prev, current_password: e.target.value }))}
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>New Password</label>
            <PasswordInput
              required
              minLength={6}
              value={pwForm.new_password}
              onChange={e => setPwForm(prev => ({ ...prev, new_password: e.target.value }))}
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>Confirm New Password</label>
            <PasswordInput
              required
              value={pwForm.confirm_password}
              onChange={e => setPwForm(prev => ({ ...prev, confirm_password: e.target.value }))}
              className={inputCls}
            />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={pwMutation.isPending}
              className="px-5 py-2.5 bg-maroon-800 text-white rounded-xl text-sm font-bold hover:bg-maroon-900 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
            >
              {pwMutation.isPending ? 'Updating...' : 'Update Password'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
