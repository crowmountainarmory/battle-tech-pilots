export interface SpecialAbilityRecord {
  name: string
  shortDescritpion: string
  ruleDescription: string
}

export const SPECIAL_ABILITIES_DATA: SpecialAbilityRecord[] = [
  {
    name: 'Ace Pilot',
    shortDescritpion: 'Exceptional handling and precision.',
    ruleDescription: 'The pilot gains a bonus when making difficult maneuver checks and may reroll one failed piloting-related test per scenario.'
  },
  {
    name: 'Battle Hardened',
    shortDescritpion: 'Shrugs off pressure under fire.',
    ruleDescription: 'Reduce the first morale or suppression effect suffered each round by one step.'
  },
  {
    name: 'Deadeye',
    shortDescritpion: 'Lands shots with uncanny consistency.',
    ruleDescription: 'Once per activation, the pilot may reroll one attack die after seeing the result.'
  },
  {
    name: 'Field Mechanic',
    shortDescritpion: 'Keeps the machine running in the field.',
    ruleDescription: 'After completing a repair action, restore one additional point of integrity or armor if available.'
  },
  {
    name: 'Tactical Mind',
    shortDescritpion: 'Sees the shape of the battle quickly.',
    ruleDescription: 'At the start of the round, the pilot may adjust initiative or target priority as allowed by the scenario rules.'
  }
]
