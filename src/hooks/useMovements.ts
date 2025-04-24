import { getMovements } from '@/http/get-movements'
import { useQuery } from '@tanstack/react-query'

export const useMovements = () => {
  return useQuery({
    queryKey: ['movements'],
    queryFn: getMovements,
    staleTime: 1000 * 60 * 1, // 1 minute
  })
}
