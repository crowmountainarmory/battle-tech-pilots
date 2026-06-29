import davionLogo from '../../assets/Davion.png?url'
import kuritaLogo from '../../assets/Kurita.png?url'
import liaoLogo from '../../assets/Liao.png?url'
import marikLogo from '../../assets/Marik.png?url'
import steinerLogo from '../../assets/Steiner.png?url'

export enum Faction {
	Davion = 'Davion',
	Kurita = 'Kurita',
	Liao = 'Liao',
	Marik = 'Marik',
	Steiner = 'Steiner'
}

type FactionAssetMap = Partial<Record<Faction, string>>

const factionAssets: FactionAssetMap = {
	[Faction.Davion]: davionLogo,
	[Faction.Kurita]: kuritaLogo,
	[Faction.Liao]: liaoLogo,
	[Faction.Marik]: marikLogo,
	[Faction.Steiner]: steinerLogo
}

export const getFactionAsset = (faction: Faction): string => factionAssets[faction] ?? davionLogo

export type FactionIconSize = 'sm' | 'md' | 'lg' | 'xl'

const sizeClassByIconSize: Record<FactionIconSize, string> = {
	sm: 'size-8',
	md: 'size-10',
	lg: 'size-12',
	xl: 'size-20'
}

interface FactionIndicatorProps {
	faction: Faction
	size?: FactionIconSize
}

function FactionIndicator({ faction, size = 'xl' }: FactionIndicatorProps) {
	return (
		<img
			src={getFactionAsset(faction)}
			alt={`${faction} faction icon`}
			className={`${sizeClassByIconSize[size]} shrink-0 aspect-square object-contain`}
		/>
	)
}

export default FactionIndicator
