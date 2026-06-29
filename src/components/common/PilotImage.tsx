import classNames from 'classnames'

interface PilotImageProps {
  src: string
  alt: string
  className?: string
  selected?: boolean
}

function PilotImage({ src, alt, className, selected = false }: PilotImageProps) {
  return (
    <img
      src={src}
      alt={alt}
      className={classNames(
        'rounded-md border-2 border-gray-300 object-cover bg-gray-100',
        selected && 'border-blue-600 ring-2 ring-blue-200',
        className
      )}
    />
  )
}

export default PilotImage
