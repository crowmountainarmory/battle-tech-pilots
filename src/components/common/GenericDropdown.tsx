type DropdownOption<T extends string | number> = {
  value: T
  label: string
}

type GenericDropdownProps<T extends string | number> = {
  label: string
  value: T
  options: DropdownOption<T>[]
  onChange: (value: T) => void
  className?: string
}

function GenericDropdown<T extends string | number>({
  label,
  value,
  options,
  onChange,
  className = 'w-full px-3 py-2 border border-gray-300 rounded-md'
}: GenericDropdownProps<T>) {
  const handleChange = (nextValue: string) => {
    const selectedOption = options.find((option) => String(option.value) === nextValue)

    if (!selectedOption) {
      return
    }

    onChange(selectedOption.value)
  }

  return (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>
      <select
        value={String(value)}
        onChange={(e) => handleChange(e.target.value)}
        className={className}
      >
        {options.map((option) => (
          <option key={String(option.value)} value={String(option.value)}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}

export default GenericDropdown
