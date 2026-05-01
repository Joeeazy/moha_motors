import { useState, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useVehicle } from '../hooks/useVehicle'
import { submitInquiry } from '../api/inquiries'
import { fetchWhatsAppNumber } from '../api/inquiries'
import { fetchVehicles } from '../api/vehicles'
import { formatPrice, formatMileage, capitalize, buildWhatsAppUrl } from '../utils/format'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import WhatsAppButton from '../components/ui/WhatsAppButton'
import CarCard from '../components/ui/CarCard'
import type { InquiryCreate } from '../types'

const FALLBACK = 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=80'

const WhatsAppIcon = () => (
  <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 24 24">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
)

export default function CarDetail() {
  const { id } = useParams<{ id: string }>()
  const { data: vehicle, isLoading, isError } = useVehicle(Number(id))
  const [activeImg, setActiveImg] = useState(0)
  const [formSuccess, setFormSuccess] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' })
  const formRef = useRef<HTMLDivElement>(null)

  const { data: whatsappNumber } = useQuery({
    queryKey: ['whatsapp'],
    queryFn: fetchWhatsAppNumber,
    staleTime: Infinity,
  })

  const { data: similarData } = useQuery({
    queryKey: ['vehicles', 'similar', vehicle?.brand?.id],
    queryFn: () => fetchVehicles({ brand_id: String(vehicle!.brand.id) }),
    enabled: !!vehicle,
    staleTime: 1000 * 60 * 5,
  })

  const similarVehicles = (similarData?.items ?? [])
    .filter(v => v.id !== vehicle?.id)
    .slice(0, 4)

  const mutation = useMutation({
    mutationFn: (data: InquiryCreate) => submitInquiry(data),
    onSuccess: () => {
      setFormSuccess(true)
      setForm({ name: '', email: '', phone: '', message: '' })
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!vehicle) return
    mutation.mutate({ ...form, vehicle_id: vehicle.id })
  }

  if (isLoading) {
    return (
      <div className="pt-32 pb-20">
        <LoadingSpinner size="lg" label="Loading vehicle details..." />
      </div>
    )
  }

  if (isError || !vehicle) {
    return (
      <div className="pt-32 pb-20 text-center max-w-md mx-auto px-4">
        <p className="text-gray-700 font-medium text-lg">Vehicle not found</p>
        <p className="text-gray-400 text-sm mt-2">This listing may have been removed.</p>
        <Link
          to="/inventory"
          className="mt-6 inline-block px-6 py-3 bg-maroon-800 text-white rounded-xl text-sm font-semibold hover:bg-maroon-900 transition-colors"
        >
          Back to Inventory
        </Link>
      </div>
    )
  }

  const images = vehicle.images.length > 0
    ? vehicle.images
    : [{ id: 0, url: FALLBACK, is_primary: true }]

  const currentImage = images[activeImg]?.url || FALLBACK

  const specs = [
    { label: 'Brand', value: vehicle.brand.name },
    { label: 'Model', value: vehicle.model },
    { label: 'Year', value: vehicle.year },
    { label: 'Condition', value: capitalize(vehicle.condition) },
    { label: 'Mileage', value: formatMileage(vehicle.mileage) },
    { label: 'Engine', value: `${capitalize(vehicle.engine_type)}${vehicle.engine_size ? ` ${vehicle.engine_size}L` : ''}` },
    { label: 'Horsepower', value: vehicle.horsepower ? `${vehicle.horsepower} hp` : '—' },
    { label: 'Transmission', value: capitalize(vehicle.transmission) },
    { label: 'Drive Type', value: vehicle.drive_type },
    { label: 'Fuel Efficiency', value: vehicle.fuel_efficiency ? `${vehicle.fuel_efficiency} L/100km` : '—' },
    { label: 'Color', value: vehicle.color },
    { label: 'Category', value: vehicle.category.name },
  ]

  const whatsappHref = whatsappNumber ? buildWhatsAppUrl(whatsappNumber, vehicle.title) : undefined

  return (
    <>
      {/* ── Breadcrumb bar ── */}
      <div className="bg-gray-950 pt-20 sm:pt-24 pb-4 sm:pb-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-1.5 text-xs text-gray-500 overflow-x-auto whitespace-nowrap pb-1">
            <Link to="/" className="hover:text-white transition-colors shrink-0">Home</Link>
            <span className="text-gray-700">/</span>
            <Link to="/inventory" className="hover:text-white transition-colors shrink-0">Inventory</Link>
            <span className="text-gray-700">/</span>
            <span className="text-gray-300 truncate">{vehicle.title}</span>
          </nav>
        </div>
      </div>

      {/* ── Main content ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">

        {/* Two-column grid: stacked on mobile, side-by-side from md */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-10 xl:gap-14">

          {/* ── Left: Image gallery ── */}
          <div className="min-w-0">
            {/* Main image */}
            <div className="rounded-2xl overflow-hidden bg-gray-100 aspect-[4/3] shadow-md">
              <img
                src={currentImage}
                alt={vehicle.title}
                className="w-full h-full object-cover"
                onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK }}
              />
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="mt-3 flex gap-2 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-thin">
                {images.map((img, i) => (
                  <button
                    key={img.id}
                    onClick={() => setActiveImg(i)}
                    className={`shrink-0 snap-start w-16 h-12 sm:w-20 sm:h-16 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                      i === activeImg
                        ? 'border-maroon-700 shadow-sm scale-105'
                        : 'border-transparent opacity-55 hover:opacity-90'
                    }`}
                  >
                    <img
                      src={img.url}
                      alt=""
                      className="w-full h-full object-cover"
                      onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK }}
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Dot indicator on mobile when multiple images */}
            {images.length > 1 && (
              <div className="flex justify-center gap-1.5 mt-3 md:hidden">
                {images.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    className={`rounded-full transition-all duration-200 ${
                      i === activeImg ? 'w-4 h-2 bg-maroon-700' : 'w-2 h-2 bg-gray-300'
                    }`}
                    aria-label={`Image ${i + 1}`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* ── Right: Vehicle details ── */}
          <div className="min-w-0">
            {/* Brand + availability */}
            <div className="flex items-center justify-between gap-3 mb-2">
              <span className="text-xs font-bold text-maroon-700 uppercase tracking-widest">
                {vehicle.brand.name}
              </span>
              <span
                className={`text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wide ${
                  vehicle.is_available
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-gray-100 text-gray-500'
                }`}
              >
                {vehicle.is_available ? 'Available' : 'Sold'}
              </span>
            </div>

            {/* Title */}
            <h1
              className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 leading-tight"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {vehicle.title}
            </h1>

            {/* Price */}
            <div className="flex items-baseline gap-2 mb-5">
              <p className="text-3xl sm:text-4xl font-extrabold text-maroon-800">
                {formatPrice(vehicle.price)}
              </p>
            </div>

            {/* Quick spec chips */}
            <div className="flex flex-wrap gap-2 mb-6">
              {[
                { icon: '📅', val: vehicle.year },
                { icon: '⚙️', val: capitalize(vehicle.transmission) },
                { icon: '✨', val: capitalize(vehicle.condition) },
                { icon: '🚗', val: vehicle.drive_type },
              ].map(({ icon, val }) => (
                <span
                  key={String(val)}
                  className="inline-flex items-center gap-1.5 text-xs text-gray-600 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-full font-medium transition-colors"
                >
                  <span>{icon}</span>
                  {val}
                </span>
              ))}
            </div>

            {/* Description */}
            {vehicle.description && (
              <div className="mb-6">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Overview</h3>
                <p className="text-gray-600 text-sm sm:text-base leading-relaxed">{vehicle.description}</p>
              </div>
            )}

            {/* Specs grid */}
            <div className="bg-gray-50 rounded-2xl p-4 sm:p-5 mb-6 border border-gray-100">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Specifications</h3>
              <dl className="grid grid-cols-2 sm:grid-cols-2 gap-x-4 gap-y-4">
                {specs.map(({ label, value }) => (
                  <div key={label} className="min-w-0">
                    <dt className="text-xs text-gray-400 uppercase tracking-wider mb-0.5">{label}</dt>
                    <dd className="text-sm font-semibold text-gray-900 truncate">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>

            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              {whatsappHref && (
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 bg-[#25D366] text-white py-3.5 rounded-xl font-semibold text-sm hover:bg-[#22bf5c] active:scale-95 transition-all shadow-sm"
                >
                  <WhatsAppIcon />
                  Chat on WhatsApp
                </a>
              )}
              <button
                onClick={() => formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                className="flex-1 flex items-center justify-center gap-2 border-2 border-maroon-800 text-maroon-800 py-3.5 rounded-xl font-semibold text-sm hover:bg-maroon-800 hover:text-white active:scale-95 transition-all"
              >
                <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Send Inquiry
              </button>
            </div>
          </div>
        </div>

        {/* ── Inquiry form ── */}
        <div ref={formRef} className="mt-12 sm:mt-16 scroll-mt-24">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-6 sm:mb-8">
              <h2
                className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Send an Inquiry
              </h2>
              <p className="text-gray-500 text-sm sm:text-base">
                Interested in the <span className="font-medium text-gray-700">{vehicle.title}</span>? We'll get back to you within 24 hours.
              </p>
            </div>

            {formSuccess ? (
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-8 text-center">
                <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-7 h-7 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="font-bold text-emerald-800 text-lg">Inquiry sent!</p>
                <p className="text-emerald-600 text-sm mt-1">Our team will contact you shortly.</p>
                <button
                  onClick={() => setFormSuccess(false)}
                  className="mt-5 text-xs font-semibold text-emerald-700 hover:underline"
                >
                  Send another inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5 sm:p-8 space-y-4 sm:space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Full Name</label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="John Kamau"
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-maroon-700/30 focus:border-maroon-700 text-gray-900 placeholder-gray-400 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Phone</label>
                    <input
                      type="tel"
                      required
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      placeholder="+254 700 000 000"
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-maroon-700/30 focus:border-maroon-700 text-gray-900 placeholder-gray-400 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Email</label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="john@example.com"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-maroon-700/30 focus:border-maroon-700 text-gray-900 placeholder-gray-400 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Message</label>
                  <textarea
                    required
                    rows={4}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder={`I'm interested in the ${vehicle.title}. Please send me more details.`}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-maroon-700/30 focus:border-maroon-700 text-gray-900 placeholder-gray-400 resize-none transition-colors"
                  />
                </div>

                {mutation.isError && (
                  <p className="text-red-600 text-sm bg-red-50 rounded-lg px-4 py-2.5">
                    Failed to send inquiry. Please try again.
                  </p>
                )}

                <button
                  type="submit"
                  disabled={mutation.isPending}
                  className="w-full bg-maroon-800 text-white py-3.5 rounded-xl font-bold text-sm hover:bg-maroon-900 disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.99] transition-all shadow-sm"
                >
                  {mutation.isPending ? 'Sending...' : 'Send Inquiry'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* ── Similar Vehicles ── */}
      {similarVehicles.length > 0 && (
        <div className="mt-12 sm:mt-16 pb-8 sm:pb-16 border-t border-gray-100 pt-10 sm:pt-14">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-6 sm:mb-8 gap-4">
              <h2
                className="text-xl sm:text-2xl font-bold text-gray-900"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Similar Vehicles
              </h2>
              <Link
                to={`/inventory?brand_id=${vehicle.brand.id}`}
                className="shrink-0 text-sm font-semibold text-maroon-700 hover:text-maroon-900 transition-colors inline-flex items-center gap-1"
              >
                View all
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
              {similarVehicles.map(v => (
                <CarCard key={v.id} vehicle={v} />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Mobile sticky CTA bar ── */}
      {vehicle.is_available && (
        <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-white border-t border-gray-200 shadow-2xl px-4 py-3 safe-area-inset-bottom">
          <div className="flex items-center gap-3 max-w-lg mx-auto">
            <div className="min-w-0">
              <p className="text-xs text-gray-400 leading-none mb-0.5">Price</p>
              <p className="text-base font-extrabold text-maroon-800 truncate">{formatPrice(vehicle.price)}</p>
            </div>
            <div className="flex gap-2 ml-auto shrink-0">
              {whatsappHref && (
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 bg-[#25D366] text-white px-4 py-2.5 rounded-xl font-semibold text-sm hover:bg-[#22bf5c] active:scale-95 transition-all"
                >
                  <WhatsAppIcon />
                  <span className="hidden xs:inline">WhatsApp</span>
                </a>
              )}
              <button
                onClick={() => formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                className="flex items-center gap-1.5 bg-maroon-800 text-white px-4 py-2.5 rounded-xl font-semibold text-sm hover:bg-maroon-900 active:scale-95 transition-all"
              >
                Inquire
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom padding so content isn't hidden behind sticky bar on mobile */}
      <div className="h-20 md:hidden" />

      <WhatsAppButton carTitle={vehicle.title} />
    </>
  )
}
