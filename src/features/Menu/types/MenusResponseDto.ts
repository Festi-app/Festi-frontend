export interface MenusResponseDto {
  id: string
  name: string
  price: number
  description: string | null
  imageUrl: string | null
  isSoldOut: boolean
  sortOrder: number
}
