import PilotImage from './PilotImage'
import type { PilotPortrait } from '../../data/pilotPortraits'

interface PilotImageGalleryProps {
  portraits: PilotPortrait[]
  selectedPortraitId: string
  onSelect: (portraitId: string) => void
}

function PilotImageGallery({ portraits, selectedPortraitId, onSelect }: PilotImageGalleryProps) {
  return (
    <div className="space-y-2 rounded-md border border-gray-300 bg-white p-3">
      <div className="text-sm font-medium">Pilot Image Gallery</div>
      <div className="flex max-h-20 gap-2 overflow-x-auto overflow-y-hidden pb-1">
        {portraits.map((portrait) => (
          <button
            key={portrait.id}
            type="button"
            onClick={() => onSelect(portrait.id)}
            className="h-20 w-20 flex-none rounded-md text-left"
            title={portrait.label}
          >
            <PilotImage
              src={portrait.src}
              alt={portrait.label}
              selected={selectedPortraitId === portrait.id}
              className="h-20 w-20"
            />
          </button>
        ))}
      </div>
    </div>
  )
}

export default PilotImageGallery
