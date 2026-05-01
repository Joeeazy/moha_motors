export function formatPrice(price: number): string {
  if (!price || price === 0) return 'Price on Request'
  return `KES ${price.toLocaleString('en-KE')}`
}

export function formatMileage(km: number): string {
  return `${km.toLocaleString('en-KE')} km`
}

export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export function getPrimaryImage(images: { url: string; is_primary: boolean }[]): string {
  if (!images || images.length === 0) return 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80'
  const primary = images.find((img) => img.is_primary)
  return primary ? primary.url : images[0].url
}

export function buildWhatsAppUrl(phone: string, carTitle: string): string {
  const text = encodeURIComponent(`Hello Moha Motors, I'm interested in the ${carTitle}. Could you please provide more details?`)
  const clean = phone.replace(/\D/g, '')
  return `https://wa.me/${clean}?text=${text}`
}
