import { clearStore, getAllRecords, openIndexedDb, putRecords, withIndexedDbStore } from './indexedDb'
import { SPECIAL_ABILITIES_DATA, type SpecialAbilityRecord } from './specialAbilities'

export type { SpecialAbilityRecord } from './specialAbilities'

const SPECIAL_ABILITIES_DB_NAME = 'battle-tech-pilots'
const SPECIAL_ABILITIES_DB_VERSION = 1
const SPECIAL_ABILITIES_STORE_NAME = 'specialAbilities'

const getSpecialAbilitySignature = (record: SpecialAbilityRecord): string =>
  `${record.name}::${record.cost}::${record.shortDescritpion}::${record.ruleDescription ?? ''}`

const hasSameSpecialAbilityData = (
  existingAbilities: SpecialAbilityRecord[],
  sourceAbilities: SpecialAbilityRecord[]
): boolean => {
  if (existingAbilities.length !== sourceAbilities.length) {
    return false
  }

  const existingSignatures = existingAbilities.map(getSpecialAbilitySignature).sort()
  const sourceSignatures = sourceAbilities.map(getSpecialAbilitySignature).sort()

  return existingSignatures.every((signature, index) => signature === sourceSignatures[index])
}

export interface SpecialAbilitiesInitializationResult {
  database: IDBDatabase
  hasSourceUpdates: boolean
}

export const openSpecialAbilitiesDatabase = (): Promise<IDBDatabase> =>
  openIndexedDb({
    name: SPECIAL_ABILITIES_DB_NAME,
    version: SPECIAL_ABILITIES_DB_VERSION,
    stores: [
      {
        name: SPECIAL_ABILITIES_STORE_NAME,
        keyPath: 'name',
        indexes: [
          {
            name: 'shortDescritpion',
            keyPath: 'shortDescritpion'
          }
        ]
      }
    ]
  })

export const seedSpecialAbilitiesDatabase = async (database: IDBDatabase): Promise<void> => {
  await withIndexedDbStore(database, SPECIAL_ABILITIES_STORE_NAME, 'readwrite', async (store) => {
    await clearStore(store)
    await putRecords(store, SPECIAL_ABILITIES_DATA)
  })
}

export const initializeSpecialAbilitiesDatabase = async (): Promise<SpecialAbilitiesInitializationResult> => {
  const database = await openSpecialAbilitiesDatabase()
  const existingAbilities = await getSpecialAbilities(database)

  if (existingAbilities.length === 0) {
    await seedSpecialAbilitiesDatabase(database)
    return { database, hasSourceUpdates: false }
  }

  return {
    database,
    hasSourceUpdates: !hasSameSpecialAbilityData(existingAbilities, SPECIAL_ABILITIES_DATA)
  }
}

export const getSpecialAbilities = (database: IDBDatabase): Promise<SpecialAbilityRecord[]> =>
  withIndexedDbStore(database, SPECIAL_ABILITIES_STORE_NAME, 'readonly', async (store) => getAllRecords<SpecialAbilityRecord>(store))

export const replaceSpecialAbilities = async (
  database: IDBDatabase,
  specialAbilities: SpecialAbilityRecord[]
): Promise<void> => {
  await withIndexedDbStore(database, SPECIAL_ABILITIES_STORE_NAME, 'readwrite', async (store) => {
    await clearStore(store)
    await putRecords(store, specialAbilities)
  })
}
