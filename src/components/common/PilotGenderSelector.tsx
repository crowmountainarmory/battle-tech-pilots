import { PilotGender } from '../../data/pilotPortraits'

interface PilotGenderSelectorProps {
  selectedGender: PilotGender
  onSelect: (gender: PilotGender) => void
}

function PilotGenderSelector({ selectedGender, onSelect }: PilotGenderSelectorProps) {
  return (
    <div className="space-y-2 rounded-md border border-gray-300 bg-white p-3">
      <div className="text-sm font-medium">Pilot Gender</div>
      <div className="flex gap-3">
        {Object.values(PilotGender).map((gender) => (
          <label key={gender} className="inline-flex items-center gap-2 text-sm">
            <input
              type="radio"
              name="pilot-gender"
              value={gender}
              checked={selectedGender === gender}
              onChange={() => onSelect(gender)}
            />
            <span>{gender}</span>
          </label>
        ))}
      </div>
    </div>
  )
}

export default PilotGenderSelector
