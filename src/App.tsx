import { useEffect, useRef, useState } from 'react'
import { domToPng } from 'modern-screenshot'
import GenericDropdown from './components/common/GenericDropdown'
import RandomizableInput from './components/common/RandomizableInput'
import FactionSelector, { Faction } from './components/common/FactionSelector'
import PilotGenderSelector from './components/common/PilotGenderSelector'
import PilotImageGallery from './components/common/PilotImageGallery'
import SpecialAbilitiesSelector from './components/SpecialAbilitiesSelector'
import PilotCard, { Pilot, Rank, SkillTier, type SpecialAbilityDisplayMode } from './components/PilotCard'
import {
  getDefaultPortraitIdByGender,
  getPortraitById,
  getPortraitsByGender,
  getRandomPilotGender,
  getRandomPortraitIdByGender,
  PILOT_PORTRAITS,
  PilotGender
} from './data/pilotPortraits'
import { type SpecialAbilityRecord } from './data/specialAbilitiesDb'
import {
  getRandomCallsign,
  getRandomFirstName,
  getRandomLastName
} from './lib/pilotIdentity'
import {
  type PersistedCardState,
  useClearPersistedCardStateMutation,
  usePersistedCardStateQuery,
  useSavePersistedCardStateMutation
} from './hooks/usePersistedCardStateQuery'


const createDefaultPilot = (): Pilot => ({
  firstName: getRandomFirstName(PilotGender.Male),
  lastName: getRandomLastName(PilotGender.Male),
  callsign: getRandomCallsign(),
  useCallsign: false,
  gender: PilotGender.Male,
  portraitId: getDefaultPortraitIdByGender(PilotGender.Male),
  faction: Faction.Davion,
  gunnerySkill: SkillTier.Regular,
  pilotingSkill: SkillTier.Regular,
  rank: Rank.Rookie,
  specialAbilities: []
})

const defaultPilot = createDefaultPilot()

const getMaxSpecialAbilitiesBySkill = (skill: number): number => {
  if (skill >= 4) {
    return 1
  }

  if (skill === 3 || skill === 2) {
    return 2
  }

  return 3
}

function App() {
  const cardRef = useRef<HTMLDivElement>(null)
  const [specialAbilityOptions, setSpecialAbilityOptions] = useState<SpecialAbilityRecord[]>([])
  const [pilot, setPilot] = useState<Pilot>(createDefaultPilot)
  const [hidePilotSkill, setHidePilotSkill] = useState(true)
  const [specialAbilityDisplayMode, setSpecialAbilityDisplayMode] = useState<SpecialAbilityDisplayMode>('nameOnly')
  const [showDefinitions, setShowDefinitions] = useState(true)
  const [isHydrated, setIsHydrated] = useState(false)
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null)
  const { data: persistedCardState, isSuccess: isPersistedCardStateLoaded } = usePersistedCardStateQuery()
  const { mutate: savePersistedCardState } = useSavePersistedCardStateMutation()
  const { mutate: clearPersistedCardState } = useClearPersistedCardStateMutation()

  useEffect(() => {
    if (!isPersistedCardStateLoaded) {
      return
    }

    if (isHydrated) {
      return
    }

    try {
      if (!persistedCardState) {
        setIsHydrated(true)
        return
      }

      const parsed = persistedCardState
      const parsedHidePilotSkill = typeof parsed.hidePilotSkill === 'boolean' ? parsed.hidePilotSkill : true
      const parsedSpecialAbilityDisplayMode =
        parsed.specialAbilityDisplayMode === 'nameAndDescription' || parsed.specialAbilityDisplayMode === 'nameAndRuleDescription'
          ? parsed.specialAbilityDisplayMode
          : 'nameOnly'

      if (parsed.pilot) {
        const legacyPilot = parsed.pilot as Partial<Pilot> & { name?: unknown }
        const hydratedGender = Object.values(PilotGender).includes(parsed.pilot.gender as PilotGender)
          ? (parsed.pilot.gender as PilotGender)
          : PilotGender.Male
        const hydratedPortrait = typeof parsed.pilot.portraitId === 'string' ? getPortraitById(parsed.pilot.portraitId) : undefined

        setPilot({
          firstName: typeof parsed.pilot.firstName === 'string' ? parsed.pilot.firstName : defaultPilot.firstName,
          lastName: typeof parsed.pilot.lastName === 'string'
            ? parsed.pilot.lastName
            : typeof legacyPilot.name === 'string'
            ? legacyPilot.name
            : defaultPilot.lastName,
          callsign: typeof parsed.pilot.callsign === 'string' ? parsed.pilot.callsign : defaultPilot.callsign,
          useCallsign: typeof parsed.pilot.useCallsign === 'boolean' ? parsed.pilot.useCallsign : defaultPilot.useCallsign,
          gender: hydratedGender,
          portraitId: hydratedPortrait && hydratedPortrait.gender === hydratedGender
            ? hydratedPortrait.id
            : getDefaultPortraitIdByGender(hydratedGender),
          faction: Object.values(Faction).includes(parsed.pilot.faction as Faction)
            ? (parsed.pilot.faction as Faction)
            : Faction.Davion,
          gunnerySkill: Object.values(SkillTier).includes(parsed.pilot.gunnerySkill as SkillTier)
            ? (parsed.pilot.gunnerySkill as SkillTier)
            : SkillTier.Regular,
          pilotingSkill: parsedHidePilotSkill
            ? SkillTier.Regular
            : Object.values(SkillTier).includes(parsed.pilot.pilotingSkill as SkillTier)
            ? (parsed.pilot.pilotingSkill as SkillTier)
            : SkillTier.Green,
          rank: Object.values(Rank).includes(parsed.pilot.rank as Rank)
            ? (parsed.pilot.rank as Rank)
            : Rank.Rookie,
          specialAbilities: Array.isArray(parsed.pilot.specialAbilities)
            ? parsed.pilot.specialAbilities.filter((ability) => typeof ability === 'string')
            : []
        })
      }

      setHidePilotSkill(parsedHidePilotSkill)
      setSpecialAbilityDisplayMode(parsedSpecialAbilityDisplayMode)

      if (typeof parsed.showDefinitions === 'boolean') {
        setShowDefinitions(parsed.showDefinitions)
      }
    } catch (error) {
      console.error('Failed to restore card state from local storage:', error)
    } finally {
      setIsHydrated(true)
    }
  }, [isPersistedCardStateLoaded, persistedCardState, isHydrated])

  useEffect(() => {
    if (!isHydrated) return

    const stateToPersist: PersistedCardState = {
      pilot,
      hidePilotSkill,
      specialAbilityDisplayMode,
      showDefinitions
    }

    savePersistedCardState(stateToPersist, {
      onSuccess: ({ savedAt }) => {
        setLastSavedAt(savedAt)
      },
      onError: (error) => {
        console.error('Failed to save card state to local storage:', error)
      }
    })
  }, [
    isHydrated,
    pilot,
    hidePilotSkill,
    specialAbilityDisplayMode,
    showDefinitions,
    savePersistedCardState
  ])
  
  useEffect(() => {
    if (specialAbilityOptions.length === 0) {
      return
    }

    const abilityNames = new Set(specialAbilityOptions.map((ability) => ability.name))
    setPilot((currentPilot) => {
      const filteredAbilities = currentPilot.specialAbilities.filter((abilityName) => abilityNames.has(abilityName))
      if (filteredAbilities.length === currentPilot.specialAbilities.length) {
        return currentPilot
      }

      return {
        ...currentPilot,
        specialAbilities: filteredAbilities
      }
    })
  }, [specialAbilityOptions])

  const rankOptions = Object.values(Rank).map((rank) => ({ value: rank, label: rank }))
  const skillOptions = Object.values(SkillTier)
    .filter((value): value is SkillTier => typeof value === 'number')
    .map((skill) => ({ value: skill, label: `${skill}+` }))
  const areSpecialAbilitiesDisabled =
    pilot.gunnerySkill >= SkillTier.Green || pilot.pilotingSkill >= SkillTier.Green
  const pilotSkillForSpecialAbilities = Math.min(pilot.gunnerySkill, pilot.pilotingSkill)
  const maxSpecialAbilities = getMaxSpecialAbilitiesBySkill(pilotSkillForSpecialAbilities)
  const specialAbilitiesDisabledMessage =
    pilot.gunnerySkill >= SkillTier.Green && pilot.pilotingSkill >= SkillTier.Green
      ? 'Special abilities are disabled when gunnery or piloting skill is 5+.'
      : pilot.gunnerySkill >= SkillTier.Green
      ? 'Special abilities are disabled when gunnery skill is 5+.'
      : 'Special abilities are disabled when piloting skill is 5+.'
  const portraitsForSelectedGender = getPortraitsByGender(pilot.gender)
  const specialAbilityDisplayModeOptions: Array<{ value: SpecialAbilityDisplayMode; label: string }> = [
    { value: 'nameOnly', label: 'Name Only' },
    { value: 'nameAndDescription', label: 'Name and Description' },
    { value: 'nameAndRuleDescription', label: 'Name and Rule Description' }
  ]

  useEffect(() => {
    if (!areSpecialAbilitiesDisabled) {
      return
    }

    if (pilot.specialAbilities.length === 0) {
      return
    }

    updatePilot('specialAbilities', [])
  }, [areSpecialAbilitiesDisabled, pilot.specialAbilities.length])

  useEffect(() => {
    if (areSpecialAbilitiesDisabled) {
      return
    }

    if (pilot.specialAbilities.length <= maxSpecialAbilities) {
      return
    }

    updatePilot('specialAbilities', pilot.specialAbilities.slice(0, maxSpecialAbilities))
  }, [areSpecialAbilitiesDisabled, maxSpecialAbilities, pilot.specialAbilities])

  const updatePilot = <K extends keyof Pilot>(key: K, value: Pilot[K]) => {
    setPilot((currentPilot) => ({ ...currentPilot, [key]: value }))
  }

  const updatePilotGender = (gender: PilotGender) => {
    updatePilot('gender', gender)
    updatePilot('portraitId', getDefaultPortraitIdByGender(gender))
    updatePilot('firstName', getRandomFirstName(gender))
  }

  const randomizeGenderAndImage = () => {
    const randomGender = getRandomPilotGender()
    updatePilot('gender', randomGender)
    updatePilot('portraitId', getRandomPortraitIdByGender(randomGender))
    updatePilot('firstName', getRandomFirstName(randomGender))
  }

  const randomizeImage = () => {
    updatePilot('portraitId', getRandomPortraitIdByGender(pilot.gender))
  }

  const handleShowPilotSkillChange = (shouldShow: boolean) => {
    const shouldHide = !shouldShow
    setHidePilotSkill(shouldHide)
    if (shouldHide) {
      updatePilot('pilotingSkill', SkillTier.Regular)
    }
  }

  const exportToPNG = async () => {
    if (cardRef.current) {
      try {
        const dataUrl = await domToPng(cardRef.current, {
          quality: 1,
          scale: 1,
          height: 1050,
          width: 750
        })
        
        const link = document.createElement('a')
        link.download = `pilot-${pilot.lastName}-${Date.now()}.png`
        link.href = dataUrl
        link.click()
      } catch (error) {
        console.error('Error exporting to PNG:', error)
        alert(`Failed to export card: ${error instanceof Error ? error.message : 'Unknown error'}`)
      }
    }
  }

  const resetSavedCard = () => {
    clearPersistedCardState(undefined, {
      onError: (error) => {
        console.error('Failed to clear saved card state from local storage:', error)
      }
    })
    setPilot(createDefaultPilot())
    setHidePilotSkill(true)
    setSpecialAbilityDisplayMode('nameOnly')
    setShowDefinitions(true)
    setLastSavedAt(null)
  }

  return (
    <div className={`grid ${showDefinitions ? 'grid-cols-[33vw_66vw]' : 'grid-cols-1'} h-screen`}>
      {showDefinitions && (
        <div className="flex-1 bg-gray-100 border-r-2 border-gray-300 p-8 overflow-y-auto">
        <h2 className="text-2xl font-bold mb-6">Define Card</h2>
        <div className="card-form space-y-4">
          <PilotGenderSelector selectedGender={pilot.gender} onSelect={updatePilotGender} />
          <RandomizableInput<Pilot, 'firstName'>
            label="First Name"
            fieldName="firstName"
            value={pilot.firstName}
            onFieldChange={updatePilot}
            randomizeValue={() => getRandomFirstName(pilot.gender)}
          />
          <RandomizableInput<Pilot, 'lastName'>
            label="Last Name"
            fieldName="lastName"
            value={pilot.lastName}
            onFieldChange={updatePilot}
            randomizeValue={() => getRandomLastName(pilot.gender)}
          />
          <div className="rounded-md border border-gray-300 bg-white p-3">
            <label className="flex items-center gap-2 text-sm font-medium">
              <input
                type="checkbox"
                checked={pilot.useCallsign}
                onChange={(e) => updatePilot('useCallsign', e.target.checked)}
              />
              Use Callsign
            </label>
          </div>
          {pilot.useCallsign && (
            <RandomizableInput<Pilot, 'callsign'>
              label="Callsign"
              fieldName="callsign"
              value={pilot.callsign}
              onFieldChange={updatePilot}
              randomizeValue={getRandomCallsign}
            />
          )}
          
          <div className="flex gap-2">
            <button
              type="button"
              onClick={randomizeGenderAndImage}
              className="flex-1 rounded-md bg-indigo-600 px-3 py-2 text-white hover:bg-indigo-700"
            >
              Random Gender + Image
            </button>
            <button
              type="button"
              onClick={randomizeImage}
              className="flex-1 rounded-md bg-indigo-500 px-3 py-2 text-white hover:bg-indigo-600"
            >
              Random Image
            </button>
          </div>
          <PilotImageGallery
            portraits={portraitsForSelectedGender.length > 0 ? portraitsForSelectedGender : PILOT_PORTRAITS}
            selectedPortraitId={pilot.portraitId}
            onSelect={(portraitId) => updatePilot('portraitId', portraitId)}
          />
          <FactionSelector
            selectedFaction={pilot.faction}
            onChange={(faction) => updatePilot('faction', faction)}
          />
          <GenericDropdown<Rank>
            label="Rank"
            value={pilot.rank}
            options={rankOptions}
            onChange={(rank) => updatePilot('rank', rank)}
          />
          <GenericDropdown<SkillTier>
            label="Gunnery Skill"
            value={pilot.gunnerySkill}
            options={skillOptions}
            onChange={(skill) => updatePilot('gunnerySkill', skill)}
          />
          <div className="rounded-md border border-gray-300 bg-white p-3">
            <label className="flex items-center gap-2 text-sm font-medium">
              <input
                type="checkbox"
                checked={!hidePilotSkill}
                onChange={(e) => handleShowPilotSkillChange(e.target.checked)}
              />
              Show Pilot Skill
            </label>
          </div>
          {!hidePilotSkill && (
            <GenericDropdown<SkillTier>
              label="Piloting Skill"
              value={pilot.pilotingSkill}
              options={skillOptions}
              onChange={(skill) => updatePilot('pilotingSkill', skill)}
            />
          )}
          <SpecialAbilitiesSelector
            selectedAbilities={pilot.specialAbilities}
            onSelectedAbilitiesChange={(abilities) => updatePilot('specialAbilities', abilities)}
            onOptionsChange={setSpecialAbilityOptions}
            maxSelected={maxSpecialAbilities}
            disabled={areSpecialAbilitiesDisabled}
            disabledMessage={specialAbilitiesDisabledMessage}
          />

          <GenericDropdown<SpecialAbilityDisplayMode>
            label="Special Ability Display"
            value={specialAbilityDisplayMode}
            options={specialAbilityDisplayModeOptions}
            onChange={setSpecialAbilityDisplayMode}
          />
          
          <button
            onClick={exportToPNG}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            Export as PNG
          </button>
          <button
            onClick={resetSavedCard}
            className="ml-2 bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
          >
            Reset Saved Card
          </button>
          <div className="text-xs text-gray-600 mt-2">
            {lastSavedAt ? `Saved ${lastSavedAt}` : 'Not saved yet'}
          </div>
        </div>
      </div>
      )}
      <div className="bg-gray-400 flex-1 p-8 overflow-y-auto flex items-start justify-center relative">
        <button
          onClick={() => setShowDefinitions(!showDefinitions)}
          className="absolute top-4 left-4 bg-gray-700 text-white px-4 py-2 rounded-md hover:bg-gray-600 z-10"
        >
          {showDefinitions ? 'Hide Controls' : 'Show Controls'}
        </button>
        <div>
          <h2 className="text-2xl font-bold mb-6 text-gray-100">Card Preview</h2>
          <div style={{ transform: 'scale(0.5)', transformOrigin: 'top center' }}>
            <PilotCard
              ref={cardRef}
              pilot={pilot}
              hidePilotSkill={hidePilotSkill}
              specialAbilityRecords={specialAbilityOptions}
              specialAbilityDisplayMode={specialAbilityDisplayMode}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
