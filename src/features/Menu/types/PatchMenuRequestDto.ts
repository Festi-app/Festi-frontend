export interface PatchMenuRequestDto {
  name: string
  price: number
  description?: string | null
  imageUrl?: string | null
  sortOrder: number
}
