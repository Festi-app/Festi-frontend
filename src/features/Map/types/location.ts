export interface Location {
  id: number
  boothId: string | null
  index: number | null
  day: string
  zoneLabel: string | null
  updatedAt: string
  createdAt: string | null
}

export interface GetLocationsParams {
  day?: string
  type?: 'day' | 'night' | 'truck'
}

export interface CreateLocationBody {
  boothId: string
  index: number
  day: string
  zoneLabel: string
}

export interface UpdateLocationBody {
  boothId?: string
  index?: number
  day?: string
  zoneLabel?: string
}
