import { UnitClassTier } from "../components/common/UnitClassDisplay";

export const UnitClasses = {
  Irregular: { name: 'Irregular', activationDice: 4, activateOn: 5, hitsOn: 5 } as UnitClassTier,
  Tier1Irregular: { name: 'Tier 1 Irregular', activationDice: 5, activateOn: 5, hitsOn: 4 } as UnitClassTier,
  Poor: { name: 'Poor', activationDice: 4, activateOn: 5, hitsOn: 5 } as UnitClassTier,
  Conscript: { name: 'Conscript', activationDice: 4, activateOn: 5, hitsOn: 5 } as UnitClassTier,
  Regular: { name: 'Regular', activationDice: 5, activateOn: 4, hitsOn: 4 } as UnitClassTier,
  Elite: { name: 'Elite', activationDice: 6, activateOn: 3, hitsOn: 3 } as UnitClassTier
} as const