import { uploadClient } from '../../../lib/axios'
import { ENDPOINTS } from '../../../constants/endpoints'

export async function putMenuImage(
  boothId: string,
  menuId: string,
  file: File
): Promise<void> {
  const form = new FormData()
  form.append('image', file)
  await uploadClient.put(ENDPOINTS.IMAGES.MENU(boothId, menuId), form)
}
