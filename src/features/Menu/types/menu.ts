export interface MenuItem {
  id: string
  boothId: string
  name: string
  price: number
  description: string | null
  imageUrl: string | null
  isSoldOut: boolean
  sortOrder: number
  createdAt: string
  updatedAt: string
}

export interface CreateMenuBody {
  name: string
  price: number
  description?: string
  imageUrl?: string
  sortOrder?: number
}

export interface UpdateMenuBody {
  name?: string
  price?: number
  description?: string
  imageUrl?: string
  isSoldOut?: boolean
  sortOrder?: number
}
