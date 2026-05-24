import { useQuery } from '@tanstack/react-query'
import { getBoothApplication } from '../apis/getBoothApplication'
import { boothApplicationKeys } from './boothApplicationKeys'

export function useBoothApplication(applicationId: string | null) {
  return useQuery({
    queryKey: boothApplicationKeys.adminDetail(applicationId ?? ''),
    queryFn: () => getBoothApplication(applicationId!),
    enabled: !!applicationId,
  })
}
