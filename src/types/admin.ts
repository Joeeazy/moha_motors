import type { Brand, Category } from './index'

export interface AdminUser {
  id: number
  name: string
  email: string
  is_admin: boolean
  is_active?: boolean
  created_at?: string
}

export interface Stats {
  total_vehicles: number
  available_vehicles: number
  sold_vehicles: number
  total_inquiries: number
  unread_inquiries: number
  resolved_inquiries: number
  total_brands: number
  total_categories: number
}

export interface AdminVehicleImage {
  id: number
  url: string
  is_primary: boolean
}

export interface AdminVehicleListItem {
  id: number
  title: string
  brand: Brand
  category: Category
  year: number
  price: number
  color: string
  seats: number | null
  condition: 'new' | 'used' | null
  transmission: 'automatic' | 'manual' | 'semi-automatic'
  is_available: boolean
  images: AdminVehicleImage[]
  created_at: string
}

export interface AdminVehicle extends AdminVehicleListItem {
  model: string | null
  mileage: number
  engine_type: 'petrol' | 'diesel' | 'electric' | 'hybrid'
  engine_size: number | null
  horsepower: number | null
  drive_type: 'FWD' | 'RWD' | 'AWD' | '4WD' | null
  fuel_efficiency: number | null
  description: string | null
  updated_at: string
}

export interface VehicleCreatePayload {
  // Required
  title: string
  brand_id: number
  category_id: number
  year: number
  price: number
  color: string
  engine_type: 'petrol' | 'diesel' | 'electric' | 'hybrid'  // Fuel Type
  engine_size: number                                        // Engine capacity
  seats: number                                              // No. of seats
  transmission: 'automatic' | 'manual' | 'semi-automatic'
  // Optional
  model?: string | null
  mileage?: number
  condition?: 'new' | 'used' | null
  horsepower?: number | null
  drive_type?: 'FWD' | 'RWD' | 'AWD' | '4WD' | null
  fuel_efficiency?: number | null
  description?: string | null
  is_available: boolean
}

export interface AdminInquiry {
  id: number
  vehicle: AdminVehicleListItem | null
  name: string
  email: string
  phone: string
  message: string
  is_read: boolean
  is_resolved: boolean
  created_at: string
}

export interface Paginated<T> {
  items: T[]
  total: number
}
