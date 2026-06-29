import { forwardRef } from 'react'
import FactionIndicator, { Faction } from './common/FactionIndicator'
import GunnerySkill from './common/GunnerySkill'
import PilotSkill from './common/PilotSkill'
import PilotImage from './common/PilotImage'
import type { SpecialAbilityRecord } from '../data/specialAbilitiesDb'
import { getPortraitById, PilotGender } from '../data/pilotPortraits'

export enum Rank {
  Rookie = 'Rookie',
  Lieutenant = 'Lieutenant',
  Captain = 'Captain',
  Major = 'Major',
  Colonel = 'Colonel',
  General = 'General'
}

export enum SkillTier {
  Rookie = 6,
  Green = 5,
  Regular = 4,
  Veteran = 3,
  Elite = 2,
  Ace = 1
}

export enum SpecialAbilities {
  Lucky1 = 'Lucky (1)',
  Lucky2 = 'Lucky (2)',
  Lucky3 = 'Lucky (3)',
  Lucky4 = 'Lucky (4)',
}

export interface Pilot {
  firstName: string
  lastName: string
  gender: PilotGender
  portraitId: string
  faction: Faction
  gunnerySkill: SkillTier
  pilotingSkill: SkillTier
  rank: Rank
  specialAbilities: string[]
}

export type SpecialAbilityDisplayMode = 'nameOnly' | 'nameAndDescription' | 'nameAndRuleDescription'

interface PilotCardProps {
  pilot: Pilot
  hidePilotSkill?: boolean
  specialAbilityRecords?: SpecialAbilityRecord[]
  specialAbilityDisplayMode?: SpecialAbilityDisplayMode
}



const PilotCard = forwardRef<HTMLDivElement, PilotCardProps>(({ pilot, hidePilotSkill = false, specialAbilityRecords = [], specialAbilityDisplayMode = 'nameOnly' }, ref) => {
  const selectedPortrait = getPortraitById(pilot.portraitId)

  const renderSpecialAbility = (abilityName: string) => {
    const abilityRecord = specialAbilityRecords.find((record) => record.name === abilityName)

    if (specialAbilityDisplayMode === 'nameOnly' || !abilityRecord) {
      return <span className="rounded border-2 border-gray-400 px-3 py-2">{abilityName}</span>
    }

    return (
      <div className="rounded border-2 border-gray-400 px-3 py-2">
        <div className="font-semibold">{abilityRecord.name}</div>
        <div className="text-sm text-gray-600">{specialAbilityDisplayMode === 'nameAndDescription' ? abilityRecord.shortDescritpion : abilityRecord.ruleDescription}</div>
      </div>
    )
  }

  const getCardColorByFaction = (faction: Faction) => {
    switch (faction) {
      case Faction.Davion:
        return 'bg-yellow-600'
      case Faction.Kurita:
        return 'bg-red-600'
      case Faction.Liao:
        return 'bg-green-600'
      case Faction.Marik:
        return 'bg-purple-600'
      case Faction.Steiner:
        return 'bg-blue-600'
      default:
        return 'bg-gray-600'
    }
  }
  return (
    <div
      ref={ref}
      data-card-ref
      className={`border-30 rounded-[30px] px-6 relative border-black bg-gray-500`}
      style={{
        width: '750px',
        height: '1050px',
        backgroundColor: '#6B7280'
      }}
    >
      {/* Pilot Heading Section */}
      <div className={`flex items-center justify-between gap-6 ${getCardColorByFaction(pilot.faction)} absolute top-10 left-0 right-0 h-18`}>

        {/* Faction indicator */}
        <div
          className="flex h-40 w-40 items-center justify-center border-4 bg-gray-700"
          style={{ clipPath: 'polygon(25% 6%, 75% 6%, 100% 50%, 75% 94%, 25% 94%, 0% 50%)' }}
        >
          <FactionIndicator faction={pilot.faction} size="xl" />
        </div>
        {/* Pilot Name and Rank Section */}
        <div className="p-2">
          <div className="text-lg font-semibold tracking-[0.3em]">{pilot.rank}</div>
          <div className="text-4xl font-bold leading-none">{pilot.firstName} {pilot.lastName}</div>
        </div>

        {/* Pilot Skills Section */}
        <div className={`grid ${hidePilotSkill ? 'grid-cols-1' : 'grid-cols-2'} gap-6 text-2xl font-semibold bg-gray-700 size-18 pb-1`}>
          <div className="flex flex-col items-center justify-center text-white">
            <div>{hidePilotSkill ? 'Skill' : 'Gunnery'}</div>
            <GunnerySkill skill={pilot.gunnerySkill} className="text-3xl" />
          </div>
          {!hidePilotSkill && (
            <div className="flex flex-col items-center justify-center text-white">
              <div>Piloting</div>
              <PilotSkill skill={pilot.pilotingSkill} className="text-3xl" />
            </div>
          )}
        </div>
      </div>
      <div className="flex h-full flex-col">
        {/* Pilot Image Section */}
        <div className="flex items-center justify-center pb-4">
          {selectedPortrait ? (
            <PilotImage src={selectedPortrait.src} alt={selectedPortrait.label} className="h-auto w-auto" />
          ) : (
            <div className="flex h-72 w-56 items-center justify-center rounded-md border-2 border-dashed border-gray-300 text-gray-400">
              No portrait selected
            </div>
          )}
        </div>

        {/* Special Abilities and Flavor Text Section */}
        <div className="p-4 bg-white  border-t-8 border-l-8 border-b-2 border-r-2 border-t-gray-300 border-l-gray-300 border-b-black border-r-black mb-4 grow overflow-clip">
          <div className="mb-3 text-sm uppercase tracking-[0.2em] text-gray-500">Special Abilities</div>
          {pilot.specialAbilities.length > 0 ? ( 
            <div className="flex flex-col gap-3 text-xl font-medium">
              {pilot.specialAbilities.map((abilityName) => (
                <div key={abilityName}>
                  {renderSpecialAbility(abilityName)}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-lg text-gray-400">No special abilities</div>
          )}
        </div>
      </div>
    </div>
  )
})

PilotCard.displayName = 'PilotCard'

export default PilotCard
