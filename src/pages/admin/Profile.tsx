import { useState, type FormEvent, useEffect } from 'react'
import { useMutation } from '@tanstack/react-query'
import { updateMe, changePassword } from '../../api/admin/auth'
import { useAuth } from '../../contexts/AuthContext'
import PasswordInput from '../../components/ui/PasswordInput'

export default function Profile() {
  const { user } = useAuth()

  const [profileForm, setProfileForm] = useState({ name: '', email: '' })
  const [profileMsg, setProfileMsg] = useState({ text: '', ok: true })

  const [pwForm, setPwForm] = useState({ current_password: '', new_password: '', confirm_password: '' })
  const [pwMsg, setPwMsg] = useState({ text: '', ok: true })

  useEffect(() => {
    if (user) setProfileForm({ name: user.name, email: user.email })
  }, [user])

  const profileMutation = useMutation({
    mutationFn: () => updateMe({ name: profileForm.name, email: profileForm.email }),
    onSuccess: () => setProfileMsg({ text: 'Profile updated.', ok: true }),
    onError: () => setProfileMsg({ text: 'Failed to update. Email may already be in use.', ok: false }),
  })

  const pwMutation = useMutation({
    mutationFn: () => changePassword(pwForm.current_password, pwForm.new_password),
    onSuccess: () => {
      setPwMsg({ text: 'Password changed successfully.', ok: true })
      setPwForm({ current_password: '', new_password: '', confirm_password: '' })
    },
    onError: () => setPwMsg({ text: 'Incorrect current password.', ok: false }),
  })

  const handleProfileSubmit = (e: FormEvent) => {
    e.preventDefault()
    setProfileMsg({ text: '', ok: true })
    profileMutation.mutate()
  }

  const handlePwSubmit = (e: FormEvent) => {
    e.preventDefault()
    setPwMsg({ text: '', ok: true })
    if (pwForm.new_password !== pwForm.confirm_password) {
      setPwMsg({ text: 'New passwords do not match.', ok: false })
      return
    }
    if (pwForm.new_password.length < 6) {
      setPwMsg({ text: 'Password must be at least 6 characters.', ok: false })
      return
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

        {profileMsg.text && (
          <div className={`text-sm rounded-xl px-4 py-3 mb-4 ${profileMsg.ok ? 'bg-emerald-50 border border-emerald-200 text-emerald-700' : 'bg-red-50 border border-red-200 text-red-700'}`}>
            {profileMsg.text}
          </div>
        )}

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

        {pwMsg.text && (
          <div className={`text-sm rounded-xl px-4 py-3 mb-4 ${pwMsg.ok ? 'bg-emerald-50 border border-emerald-200 text-emerald-700' : 'bg-red-50 border border-red-200 text-red-700'}`}>
            {pwMsg.text}
          </div>
        )}

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
