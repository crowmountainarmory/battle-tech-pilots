import { useQuery } from '@tanstack/react-query'
import {
  getSpecialAbilities,
  initializeSpecialAbilitiesDatabase,
  seedSpecialAbilitiesDatabase
} from '../data/specialAbilitiesDb'

export const specialAbilitiesQueryKey = ['special-abilities'] as const

export const useSpecialAbilitiesQuery = () =>
  useQuery({
    queryKey: specialAbilitiesQueryKey,
    queryFn: async () => {
      const { database, hasSourceUpdates } = await initializeSpecialAbilitiesDatabase()

      try {
        let shouldRefresh = false
        if (hasSourceUpdates) {
          shouldRefresh = window.confirm(
            'Special abilities data has changed. Refreshing will update the database and remove unavailable abilities from your card. Refresh now?'
          )
        }

        if (hasSourceUpdates && shouldRefresh) {
          await seedSpecialAbilitiesDatabase(database)
        }

        return await getSpecialAbilities(database)
      } finally {
        database.close()
      }
    }
  })
