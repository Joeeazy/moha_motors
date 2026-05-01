import api from './axios'
import type { InquiryCreate } from '../types'

export async function submitInquiry(data: InquiryCreate): Promise<void> {
  await api.post('/inquiries', data)
}

export async function fetchWhatsAppNumber(): Promise<string> {
  const { data } = await api.get<{ whatsapp_number: string }>('/inquiries/whatsapp-number')
  return data.whatsapp_number
}
