import { useQuery } from '@tanstack/react-query'
import { getBoothApplications } from '../apis/getBoothApplications'
import { boothApplicationKeys } from './boothApplicationKeys'

export function useBoothApplications() {
  return useQuery({
    queryKey: boothApplicationKeys.adminList(),
    queryFn: getBoothApplications,
  })
}
