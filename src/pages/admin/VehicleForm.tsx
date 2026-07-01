import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  fetchAdminVehicle,
  createVehicle,
  updateVehicle,
  uploadVehicleImage,
  deleteVehicleImage,
} from '../../api/admin/vehicles'
import { fetchAdminBrands } from '../../api/admin/brands'
import { fetchAdminCategories } from '../../api/admin/categories'
import type { VehicleCreatePayload, AdminVehicleImage } from '../../types/admin'
import { notifySuccess, notifyError } from '../../lib/notify'

interface FormState {
  title: string
  brand_id: string
  category_id: string
  model: string
  year: string
  price: string
  color: string
  seats: string
  mileage: string
  condition: '' | 'new' | 'used'
  engine_type: '' | 'petrol' | 'diesel' | 'electric' | 'hybrid'
  engine_size: string
  horsepower: string
  transmission: '' | 'automatic' | 'manual' | 'semi-automatic'
  drive_type: '' | 'FWD' | 'RWD' | 'AWD' | '4WD'
  fuel_efficiency: string
  description: string
  is_available: boolean
}

const EMPTY_FORM: FormState = {
  title: '', brand_id: '', category_id: '', model: '',
  year: String(new Date().getFullYear()), price: '', color: '',
  seats: '', mileage: '0', condition: '', engine_type: '',
  engine_size: '', horsepower: '', transmission: '',
  drive_type: '', fuel_efficiency: '', description: '',
  is_available: true,
}

function toPayload(f: FormState): VehicleCreatePayload {
  return {
    // Required
    title: f.title,
    brand_id: Number(f.brand_id),
    category_id: Number(f.category_id),
    year: Number(f.year),
    price: Number(f.price),
    color: f.color,
    engine_type: f.engine_type as Exclude<FormState['engine_type'], ''>,
    engine_size: Number(f.engine_size),
    seats: Number(f.seats),
    transmission: f.transmission as Exclude<FormState['transmission'], ''>,
    // Optional
    is_available: f.is_available,
    model: f.model || null,
    mileage: Number(f.mileage),
    condition: f.condition || null,
    drive_type: f.drive_type || null,
    horsepower: f.horsepower ? Number(f.horsepower) : null,
    fuel_efficiency: f.fuel_efficiency ? Number(f.fuel_efficiency) : null,
    description: f.description || null,
  }
}

export default function VehicleForm() {
  const { id } = useParams<{ id?: string }>()
  const vehicleId = id ? Number(id) : undefined
  const isEdit = vehicleId !== undefined
  const navigate = useNavigate()
  const qc = useQueryClient()

  const [form, setForm] = useState<FormState>(EMPTY_FORM)
  const [imageUploading, setImageUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState('')

  // Saved images (edit mode)
  const [images, setImages] = useState<AdminVehicleImage[]>([])

  // Queued files (create mode — picked before vehicle exists)
  const [queuedFiles, setQueuedFiles] = useState<File[]>([])
  const [previewUrls, setPreviewUrls] = useState<string[]>([])

  const fileRef = useRef<HTMLInputElement>(null)

  // Keep preview blob URLs in sync with queued files; revoke on change
  useEffect(() => {
    const urls = queuedFiles.map(f => URL.createObjectURL(f))
    setPreviewUrls(urls)
    return () => urls.forEach(u => URL.revokeObjectURL(u))
  }, [queuedFiles])

  const { data: vehicle, isLoading: vehicleLoading } = useQuery({
    queryKey: ['admin', 'vehicle', vehicleId],
    queryFn: () => fetchAdminVehicle(vehicleId!),
    enabled: isEdit,
    staleTime: 0,
  })

  const { data: brands } = useQuery({
    queryKey: ['admin', 'brands'],
    queryFn: fetchAdminBrands,
    staleTime: 1000 * 60 * 10,
  })

  const { data: categories } = useQuery({
    queryKey: ['admin', 'categories'],
    queryFn: fetchAdminCategories,
    staleTime: 1000 * 60 * 10,
  })

  useEffect(() => {
    if (vehicle) {
      setForm({
        title: vehicle.title,
        brand_id: String(vehicle.brand.id),
        category_id: String(vehicle.category.id),
        model: vehicle.model ?? '',
        year: String(vehicle.year),
        price: String(vehicle.price),
        color: vehicle.color,
        seats: vehicle.seats != null ? String(vehicle.seats) : '',
        mileage: String(vehicle.mileage),
        condition: vehicle.condition ?? '',
        engine_type: vehicle.engine_type,
        engine_size: vehicle.engine_size != null ? String(vehicle.engine_size) : '',
        horsepower: vehicle.horsepower != null ? String(vehicle.horsepower) : '',
        transmission: vehicle.transmission,
        drive_type: vehicle.drive_type ?? '',
        fuel_efficiency: vehicle.fuel_efficiency != null ? String(vehicle.fuel_efficiency) : '',
        description: vehicle.description ?? '',
        is_available: vehicle.is_available,
      })
      setImages(vehicle.images)
    }
  }, [vehicle])

  const saveMutation = useMutation({
    mutationFn: (payload: VehicleCreatePayload) =>
      isEdit ? updateVehicle(vehicleId!, payload) : createVehicle(payload),
  })

  const deleteImageMutation = useMutation({
    mutationFn: (imageId: number) => deleteVehicleImage(vehicleId!, imageId),
    onSuccess: (_, imageId) => {
      setImages(prev => prev.filter(img => img.id !== imageId))
      qc.invalidateQueries({ queryKey: ['admin', 'vehicle', vehicleId] })
      notifySuccess('Image removed.')
    },
    onError: (err) => notifyError(err, 'Could not remove the image.'),
  })

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (saveMutation.isPending || imageUploading) return  // guard against double-submit
    if (!form.brand_id || !form.category_id) return notifyError(null, 'Please select a brand and category.')
    if (!form.engine_type) return notifyError(null, 'Please select a fuel type.')
    if (!form.transmission) return notifyError(null, 'Please select a transmission.')

    try {
      const saved = await saveMutation.mutateAsync(toPayload(form))
      qc.invalidateQueries({ queryKey: ['admin', 'vehicles'] })
      qc.invalidateQueries({ queryKey: ['admin', 'stats'] })

      if (isEdit) {
        setImages(saved.images)
        notifySuccess('Changes saved.')
        return
      }

      // Create mode: upload queued images, then leave the form so it can't be resubmitted
      let failed = 0
      if (queuedFiles.length > 0) {
        setImageUploading(true)
        for (let i = 0; i < queuedFiles.length; i++) {
          setUploadProgress(`Uploading image ${i + 1} of ${queuedFiles.length}...`)
          try {
            await uploadVehicleImage(saved.id, queuedFiles[i], i === 0)
          } catch {
            failed++
          }
        }
        setImageUploading(false)
        setUploadProgress('')
      }

      if (failed > 0) {
        notifyError(null, `Vehicle created, but ${failed} image(s) failed to upload. Add them from the edit page.`)
      } else {
        notifySuccess('Vehicle created successfully.')
      }
      // Redirect to the list (replace) so the create form isn't shown again → no duplicate entries
      navigate('/admin/vehicles', { replace: true })
    } catch (err) {
      notifyError(err, 'Failed to save. Please check the form and try again.')
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? [])
    if (!files.length) return

    if (isEdit) {
      // Edit mode: upload immediately
      handleEditImageUpload(files)
    } else {
      // Create mode: queue locally
      setQueuedFiles(prev => [...prev, ...files])
    }
    e.target.value = ''
  }

  const handleEditImageUpload = async (files: File[]) => {
    if (!vehicleId) return
    setImageUploading(true)
    try {
      let result = { images: [] as AdminVehicleImage[] }
      for (let i = 0; i < files.length; i++) {
        setUploadProgress(`Uploading ${i + 1} of ${files.length}...`)
        const isPrimary = images.length === 0 && i === 0
        result = await uploadVehicleImage(vehicleId, files[i], isPrimary)
      }
      setImages(result.images)
      qc.invalidateQueries({ queryKey: ['admin', 'vehicle', vehicleId] })
      notifySuccess('Image uploaded.')
    } catch (err) {
      notifyError(err, 'Image upload failed. Check file type (JPEG/PNG/WebP) and size (max 5MB).')
    } finally {
      setImageUploading(false)
      setUploadProgress('')
    }
  }

  const removeQueued = (index: number) =>
    setQueuedFiles(prev => prev.filter((_, i) => i !== index))

  const f = (key: keyof FormState, value: string | boolean) =>
    setForm(prev => ({ ...prev, [key]: value }))

  const inputCls = 'w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-maroon-700/30 focus:border-maroon-700 transition-colors'
  const selectCls = inputCls + ' bg-white'
  const labelCls = 'block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5'

  if (isEdit && vehicleLoading) {
    return (
      <div className="p-6 lg:p-8 max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-7">
          <div className="skeleton w-9 h-9 rounded-lg" />
          <div className="skeleton h-6 w-48 rounded" />
        </div>
        {/* Form fields */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 sm:p-6 space-y-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i}>
              <div className="skeleton h-2.5 w-28 rounded mb-2" />
              <div className="skeleton h-11 w-full rounded-xl" />
            </div>
          ))}
          <div className="grid grid-cols-2 gap-4">
            <div className="skeleton h-11 rounded-xl" />
            <div className="skeleton h-11 rounded-xl" />
          </div>
          <div className="skeleton h-28 w-full rounded-xl" />
        </div>
      </div>
    )
  }

  const isBusy = saveMutation.isPending || imageUploading

  return (
    <div className="p-6 lg:p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-7">
        <Link to="/admin/vehicles" className="text-gray-400 hover:text-gray-600 transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">
          {isEdit ? 'Edit Vehicle' : 'Add New Vehicle'}
        </h1>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Basic info */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 sm:p-6">
          <h2 className="text-sm font-bold text-gray-900 mb-5">Basic Information</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className={labelCls}>Title</label>
              <input type="text" required value={form.title} onChange={e => f('title', e.target.value)} placeholder="e.g. 2022 Toyota RAV4" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Brand</label>
              <select required value={form.brand_id} onChange={e => f('brand_id', e.target.value)} className={selectCls}>
                <option value="">Select brand</option>
                {brands?.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>Category</label>
              <select required value={form.category_id} onChange={e => f('category_id', e.target.value)} className={selectCls}>
                <option value="">Select category</option>
                {categories?.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>Year</label>
              <input type="number" required min={1990} max={2030} value={form.year} onChange={e => f('year', e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Price (KES)</label>
              <input type="number" required min={0} value={form.price} onChange={e => f('price', e.target.value)} placeholder="e.g. 2500000" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Color</label>
              <input type="text" required value={form.color} onChange={e => f('color', e.target.value)} placeholder="e.g. Pearl White" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>No. of Seats</label>
              <input type="number" required min={1} max={50} value={form.seats} onChange={e => f('seats', e.target.value)} placeholder="e.g. 5" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Model <span className="font-normal normal-case text-gray-300">optional</span></label>
              <input type="text" value={form.model} onChange={e => f('model', e.target.value)} placeholder="e.g. RAV4" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Condition <span className="font-normal normal-case text-gray-300">optional</span></label>
              <select value={form.condition} onChange={e => f('condition', e.target.value as FormState['condition'])} className={selectCls}>
                <option value="">Not specified</option>
                <option value="new">New</option>
                <option value="used">Used</option>
              </select>
            </div>
            <div>
              <label className={labelCls}>Mileage (km) <span className="font-normal normal-case text-gray-300">optional</span></label>
              <input type="number" min={0} value={form.mileage} onChange={e => f('mileage', e.target.value)} className={inputCls} />
            </div>
          </div>
        </div>

        {/* Specs */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 sm:p-6">
          <h2 className="text-sm font-bold text-gray-900 mb-5">Specifications</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Transmission</label>
              <select required value={form.transmission} onChange={e => f('transmission', e.target.value as typeof form.transmission)} className={selectCls}>
                <option value="" disabled>Select transmission</option>
                <option value="automatic">Automatic</option>
                <option value="manual">Manual</option>
                <option value="semi-automatic">Semi-Automatic</option>
              </select>
            </div>
            <div>
              <label className={labelCls}>Drive Type <span className="font-normal normal-case text-gray-300">optional</span></label>
              <select value={form.drive_type} onChange={e => f('drive_type', e.target.value as FormState['drive_type'])} className={selectCls}>
                <option value="">Not specified</option>
                <option value="FWD">FWD</option>
                <option value="RWD">RWD</option>
                <option value="AWD">AWD</option>
                <option value="4WD">4WD</option>
              </select>
            </div>
            <div>
              <label className={labelCls}>Fuel Type</label>
              <select required value={form.engine_type} onChange={e => f('engine_type', e.target.value as typeof form.engine_type)} className={selectCls}>
                <option value="" disabled>Select fuel type</option>
                <option value="petrol">Petrol</option>
                <option value="diesel">Diesel</option>
                <option value="electric">Electric</option>
                <option value="hybrid">Hybrid</option>
              </select>
            </div>
            <div>
              <label className={labelCls}>Engine Capacity (L)</label>
              <input type="number" required min={0} step={0.1} value={form.engine_size} onChange={e => f('engine_size', e.target.value)} placeholder="e.g. 2.5" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Horsepower <span className="font-normal normal-case text-gray-300">optional</span></label>
              <input type="number" min={0} value={form.horsepower} onChange={e => f('horsepower', e.target.value)} placeholder="e.g. 203" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Fuel Efficiency (L/100km) <span className="font-normal normal-case text-gray-300">optional</span></label>
              <input type="number" min={0} step={0.1} value={form.fuel_efficiency} onChange={e => f('fuel_efficiency', e.target.value)} placeholder="e.g. 8.5" className={inputCls} />
            </div>
          </div>
        </div>

        {/* Description + availability */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 sm:p-6">
          <h2 className="text-sm font-bold text-gray-900 mb-5">Details</h2>
          <div className="space-y-4">
            <div>
              <label className={labelCls}>Description <span className="font-normal normal-case text-gray-300">optional</span></label>
              <textarea
                rows={4}
                value={form.description}
                onChange={e => f('description', e.target.value)}
                placeholder="Describe the vehicle condition, features, history..."
                className={inputCls + ' resize-none'}
              />
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => f('is_available', !form.is_available)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${form.is_available ? 'bg-emerald-500' : 'bg-gray-300'}`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${form.is_available ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
              <div>
                <p className="text-sm font-semibold text-gray-900">{form.is_available ? 'Available for sale' : 'Marked as sold'}</p>
                <p className="text-xs text-gray-400">Toggle to mark vehicle as sold without deleting it</p>
              </div>
            </div>
          </div>
        </div>

        {/* Images — works in both create and edit mode */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 sm:p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-sm font-bold text-gray-900">Images</h2>
              {!isEdit && (
                <p className="text-xs text-gray-400 mt-0.5">Selected images will be uploaded when you create the vehicle</p>
              )}
            </div>
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={imageUploading}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-maroon-800 hover:text-maroon-900 disabled:opacity-60 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              {imageUploading ? uploadProgress || 'Uploading...' : 'Add Images'}
            </button>
            <input
              ref={fileRef}
              type="file"
              multiple
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={handleFileSelect}
            />
          </div>

          {/* Create mode: local previews */}
          {!isEdit && (
            queuedFiles.length === 0 ? (
              <div
                className="border-2 border-dashed border-gray-200 rounded-xl p-10 text-center cursor-pointer hover:border-maroon-300 transition-colors"
                onClick={() => fileRef.current?.click()}
              >
                <svg className="w-8 h-8 text-gray-300 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-sm text-gray-400">Click to select images (JPEG, PNG, WebP · max 5MB each)</p>
                <p className="text-xs text-gray-300 mt-1">First image will be set as primary</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {previewUrls.map((url, i) => (
                  <div key={i} className="relative group rounded-xl overflow-hidden bg-gray-100 aspect-[4/3]">
                    <img src={url} alt="" className="w-full h-full object-cover" />
                    {i === 0 && (
                      <span className="absolute top-1.5 left-1.5 bg-maroon-800 text-white text-xs font-bold px-2 py-0.5 rounded-md">
                        Primary
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => removeQueued(i)}
                      className="absolute top-1.5 right-1.5 w-7 h-7 bg-red-600 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center hover:bg-red-700"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="aspect-[4/3] rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-1 text-gray-400 hover:border-maroon-300 hover:text-maroon-600 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <span className="text-xs font-medium">Add</span>
                </button>
              </div>
            )
          )}

          {/* Edit mode: saved images from server */}
          {isEdit && (
            images.length === 0 ? (
              <div
                className="border-2 border-dashed border-gray-200 rounded-xl p-10 text-center cursor-pointer hover:border-maroon-300 transition-colors"
                onClick={() => fileRef.current?.click()}
              >
                <svg className="w-8 h-8 text-gray-300 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-sm text-gray-400">Click to upload images (JPEG, PNG, WebP · max 5MB each)</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {images.map((img) => (
                  <div key={img.id} className="relative group rounded-xl overflow-hidden bg-gray-100 aspect-[4/3]">
                    <img src={img.url} alt="" className="w-full h-full object-cover" />
                    {img.is_primary && (
                      <span className="absolute top-1.5 left-1.5 bg-maroon-800 text-white text-xs font-bold px-2 py-0.5 rounded-md">
                        Primary
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => deleteImageMutation.mutate(img.id)}
                      disabled={deleteImageMutation.isPending}
                      className="absolute top-1.5 right-1.5 w-7 h-7 bg-red-600 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center hover:bg-red-700"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  disabled={imageUploading}
                  className="aspect-[4/3] rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-1 text-gray-400 hover:border-maroon-300 hover:text-maroon-600 disabled:opacity-50 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <span className="text-xs font-medium">{imageUploading ? uploadProgress : 'Add'}</span>
                </button>
              </div>
            )
          )}
        </div>

        {/* Save button */}
        <div className="flex justify-end gap-3 pb-6">
          <Link to="/admin/vehicles" className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isBusy}
            className="px-6 py-2.5 bg-maroon-800 text-white rounded-xl text-sm font-bold hover:bg-maroon-900 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
          >
            {saveMutation.isPending
              ? 'Creating...'
              : imageUploading
              ? uploadProgress || 'Uploading...'
              : isEdit
              ? 'Save Changes'
              : `Create Vehicle${queuedFiles.length > 0 ? ` & Upload ${queuedFiles.length} Image${queuedFiles.length > 1 ? 's' : ''}` : ''}`}
          </button>
        </div>
      </form>
    </div>
  )
}
