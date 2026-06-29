import classNames from 'classnames'
import FactionIndicator, { Faction } from './FactionIndicator'

export { Faction } from './FactionIndicator'

interface FactionSelectorProps {
  selectedFaction: Faction
  onChange: (faction: Faction) => void
  options?: Faction[]
  name?: string
  className?: string
}

function FactionSelector({
  selectedFaction,
  onChange,
  options = Object.values(Faction),
  name = 'faction-selector',
  className
}: FactionSelectorProps) {
  return (
    <fieldset className={classNames('grid grid-cols-2 gap-2', className)}>
      <legend className="mb-2 block text-sm font-medium">Faction</legend>
      {options.map((faction) => (
        <label key={faction} className="cursor-pointer">
          <input
            type="radio"
            name={name}
            value={faction}
            checked={selectedFaction === faction}
            onChange={() => onChange(faction)}
            className="peer sr-only"
          />
          <span className="flex items-center gap-2 rounded-md border border-gray-300 bg-white p-2 text-sm transition-colors peer-checked:border-blue-600 peer-checked:bg-blue-50">
            <FactionIndicator faction={faction} size="md" />
            <span className="font-medium">{faction}</span>
          </span>
        </label>
      ))}
    </fieldset>
  )
}

export default FactionSelector
