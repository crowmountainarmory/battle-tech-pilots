import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { Pilot, SpecialAbilityDisplayMode } from '../components/PilotCard'

const CARD_STATE_STORAGE_KEY = 'battle-tech-pilot-card-state-v1'

export interface PersistedCardState {
  pilot: Pilot
  hidePilotSkill: boolean
  specialAbilityDisplayMode: SpecialAbilityDisplayMode
  showDefinitions: boolean
}

export const persistedCardStateQueryKey = ['persisted-card-state'] as const

const loadPersistedCardState = (): Partial<PersistedCardState> | null => {
  const stored = localStorage.getItem(CARD_STATE_STORAGE_KEY)

  if (!stored) {
    return null
  }

  return JSON.parse(stored) as Partial<PersistedCardState>
}

const savePersistedCardState = (state: PersistedCardState): string => {
  localStorage.setItem(CARD_STATE_STORAGE_KEY, JSON.stringify(state))
  return new Date().toLocaleTimeString()
}

const clearPersistedCardState = (): void => {
  localStorage.removeItem(CARD_STATE_STORAGE_KEY)
}

export const usePersistedCardStateQuery = () =>
  useQuery({
    queryKey: persistedCardStateQueryKey,
    queryFn: async () => loadPersistedCardState(),
    staleTime: Infinity
  })

export const useSavePersistedCardStateMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (state: PersistedCardState) => ({
      savedAt: savePersistedCardState(state),
      state
    }),
    onSuccess: ({ state }) => {
      queryClient.setQueryData(persistedCardStateQueryKey, state)
    }
  })
}

export const useClearPersistedCardStateMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      clearPersistedCardState()
    },
    onSuccess: () => {
      queryClient.setQueryData(persistedCardStateQueryKey, null)
    }
  })
}
