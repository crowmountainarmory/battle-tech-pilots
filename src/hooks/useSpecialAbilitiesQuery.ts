import { useQuery } from '@tanstack/react-query'
import { loadSpecialAbilities } from '../data/specialAbilitiesDb'

export const specialAbilitiesQueryKey = ['special-abilities'] as const

export const useSpecialAbilitiesQuery = () =>
  useQuery({
    queryKey: specialAbilitiesQueryKey,
    queryFn: loadSpecialAbilities
  })
