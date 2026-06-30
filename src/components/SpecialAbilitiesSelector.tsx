import { useEffect } from 'react'
import { type SpecialAbilityRecord } from '../data/specialAbilitiesDb'
import { useSpecialAbilitiesQuery } from '../hooks/useSpecialAbilitiesQuery'

type SpecialAbilitiesSelectorProps = {
  selectedAbilities: string[]
  onSelectedAbilitiesChange: (abilities: string[]) => void
  onOptionsChange?: (options: SpecialAbilityRecord[]) => void
  maxSelected?: number
  disabled?: boolean
  disabledMessage?: string
}

const DEFAULT_MAX_SPECIAL_ABILITIES = 3

function SpecialAbilitiesSelector({
  selectedAbilities,
  onSelectedAbilitiesChange,
  onOptionsChange,
  maxSelected = DEFAULT_MAX_SPECIAL_ABILITIES,
  disabled = false,
  disabledMessage = 'Special abilities are disabled when skill is 5+'
}: SpecialAbilitiesSelectorProps) {
  const { data: specialAbilityOptions = [], isLoading, isError } = useSpecialAbilitiesQuery()

  useEffect(() => {
    if (!onOptionsChange) {
      return
    }

    onOptionsChange(specialAbilityOptions)
  }, [onOptionsChange, specialAbilityOptions])

  const toggleSpecialAbility = (ability: SpecialAbilityRecord) => {
    if (disabled) {
      return
    }

    if (selectedAbilities.includes(ability.name)) {
      onSelectedAbilitiesChange(selectedAbilities.filter((currentAbility) => currentAbility !== ability.name))
      return
    }

    if (selectedAbilities.length >= maxSelected) {
      return
    }

    onSelectedAbilitiesChange([...selectedAbilities, ability.name])
  }

  const clearSpecialAbilities = () => {
    onSelectedAbilitiesChange([])
  }

  return (
    <>
      <div>
        <label className="block text-sm font-medium mb-2">Special Abilities</label>
        <div className="space-y-2 rounded-md border border-gray-300 bg-white p-3 h-48 overflow-y-auto">
          {isLoading && <div className="text-sm text-gray-500">Loading special abilities...</div>}
          {isError && <div className="text-sm text-red-600">Failed to load special abilities.</div>}
          {disabled && <div className="text-sm text-gray-500">{disabledMessage}</div>}
          {!isLoading && !isError && specialAbilityOptions.map((ability) => (
            <label
              key={ability.name}
              className={`flex items-center gap-2 text-sm ${
                disabled || (!selectedAbilities.includes(ability.name) && selectedAbilities.length >= maxSelected)
                  ? 'text-gray-400'
                  : ''
              }`}
            >
              <input
                type="checkbox"
                checked={selectedAbilities.includes(ability.name)}
                disabled={disabled || (!selectedAbilities.includes(ability.name) && selectedAbilities.length >= maxSelected)}
                onChange={() => toggleSpecialAbility(ability)}
              />
              <span>{ability.name}</span>
            </label>
          ))}
          <div className="text-xs text-gray-500">
            {selectedAbilities.length}/{maxSelected} selected
          </div>
        </div>
      </div>

      <button
        disabled={disabled || selectedAbilities.length === 0}
        className={`bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 ${
          disabled || selectedAbilities.length === 0 ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        onClick={clearSpecialAbilities}
      >
        Clear Special Abilities
      </button>
    </>
  )
}

export default SpecialAbilitiesSelector
