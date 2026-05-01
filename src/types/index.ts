export interface Brand {
  id: number
  name: string
  logo_url: string | null
  created_at: string
}

export interface Category {
  id: number
  name: string
  created_at: string
}

export interface VehicleImage {
  id: number
  url: string
  is_primary: boolean
}

export interface VehicleListItem {
  id: number
  title: string
  brand: Brand
  category: Category
  year: number
  price: number
  color: string
  condition: 'new' | 'used'
  transmission: 'automatic' | 'manual' | 'semi-automatic'
  is_available: boolean
  images: VehicleImage[]
  created_at: string
}

export interface Vehicle extends VehicleListItem {
  model: string
  mileage: number
  engine_type: 'petrol' | 'diesel' | 'electric' | 'hybrid'
  engine_size: number | null
  horsepower: number | null
  drive_type: 'FWD' | 'RWD' | 'AWD' | '4WD'
  fuel_efficiency: number | null
  description: string | null
  updated_at: string
}

export interface InquiryCreate {
  vehicle_id: number
  name: string
  email: string
  phone: string
  message: string
}

export interface Options {
  conditions: string[]
  engine_types: string[]
  transmissions: string[]
  drive_types: string[]
  colors: string[]
  years: number[]
}

export interface VehicleFilters {
  brand_id?: string
  category_id?: string
  condition?: string
  transmission?: string
  min_price?: string
  max_price?: string
  min_year?: string
  max_year?: string
  page?: string
}
