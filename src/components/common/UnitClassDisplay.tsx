import React from 'react'
import DiceIcon from './DiceIcon'

export interface UnitClassTier {
  name: string
  activationDice: number
  activateOn: number
  hitsOn: number
}

interface UnitClassDisplayProps {
  unitClass: UnitClassTier
  showDetails?: boolean
}

function UnitClassDisplay({ unitClass, showDetails = false }: UnitClassDisplayProps): React.ReactElement {
  if (showDetails) {
    return <span className="text-5xl font-semibold">{unitClass.name} ({unitClass.activationDice}/<DiceIcon className="w-12 h-12" pips={unitClass.activateOn} />+)</span>
  }
  return <span>{unitClass.name}</span>
}

export default UnitClassDisplay
