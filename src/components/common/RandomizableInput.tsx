import DiceIcon from './DiceIcon'

type RandomizableInputProps<T, K extends keyof T> = {
  label: string
  fieldName: K
  value: string
  onFieldChange: (field: K, value: T[K]) => void
  randomizeValue: () => T[K]
}

function RandomizableInput<T, K extends keyof T>({
  label,
  fieldName,
  value,
  onFieldChange,
  randomizeValue
}: RandomizableInputProps<T, K>) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>
      <div className="relative">
        <input
          type="text"
          value={value}
          onChange={(e) => onFieldChange(fieldName, e.target.value as T[K])}
          className="w-full px-3 py-2 pr-20 border border-gray-300 rounded-md"
        />
        <button
          type="button"
          onClick={() => onFieldChange(fieldName, randomizeValue())}
          className="absolute right-1 top-1/2 -translate-y-1/2 p-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
        >
          <DiceIcon pips={6} />
        </button>
      </div>
    </div>
  )
}

export default RandomizableInput
