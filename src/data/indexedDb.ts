export type IndexedDbStoreConfig = {
  name: string
  keyPath: string
  autoIncrement?: boolean
  indexes?: Array<{
    name: string
    keyPath: string | string[]
    options?: IDBIndexParameters
  }>
}

export type IndexedDbConfig = {
  name: string
  version: number
  stores: IndexedDbStoreConfig[]
}

export const openIndexedDb = (config: IndexedDbConfig): Promise<IDBDatabase> =>
  new Promise((resolve, reject) => {
    const request = indexedDB.open(config.name, config.version)

    request.onerror = () => {
      reject(request.error ?? new Error(`Failed to open IndexedDB database ${config.name}`))
    }

    request.onupgradeneeded = () => {
      const database = request.result

      for (const storeConfig of config.stores) {
        const storeExists = database.objectStoreNames.contains(storeConfig.name)
        const objectStore = storeExists
          ? request.transaction?.objectStore(storeConfig.name)
          : database.createObjectStore(storeConfig.name, {
              keyPath: storeConfig.keyPath,
              autoIncrement: storeConfig.autoIncrement
            })

        if (!objectStore) {
          continue
        }

        if (!storeExists && storeConfig.indexes) {
          for (const indexConfig of storeConfig.indexes) {
            objectStore.createIndex(indexConfig.name, indexConfig.keyPath, indexConfig.options)
          }
        }
      }
    }

    request.onsuccess = () => {
      resolve(request.result)
    }
  })

export const withIndexedDbStore = async <T>(
  database: IDBDatabase,
  storeName: string,
  mode: IDBTransactionMode,
  handler: (store: IDBObjectStore) => T | Promise<T>
): Promise<T> => {
  const transaction = database.transaction(storeName, mode)
  const store = transaction.objectStore(storeName)
  const result = await handler(store)

  await new Promise<void>((resolve, reject) => {
    transaction.oncomplete = () => resolve()
    transaction.onerror = () => reject(transaction.error ?? new Error(`IndexedDB transaction failed for store ${storeName}`))
    transaction.onabort = () => reject(transaction.error ?? new Error(`IndexedDB transaction aborted for store ${storeName}`))
  })

  return result
}

export const getAllRecords = <T>(store: IDBObjectStore): Promise<T[]> =>
  new Promise((resolve, reject) => {
    const request = store.getAll()
    request.onsuccess = () => resolve(request.result as T[])
    request.onerror = () => reject(request.error ?? new Error('Failed to read all records from IndexedDB'))
  })

export const getRecordByKey = <T>(store: IDBObjectStore, key: IDBValidKey): Promise<T | undefined> =>
  new Promise((resolve, reject) => {
    const request = store.get(key)
    request.onsuccess = () => resolve(request.result as T | undefined)
    request.onerror = () => reject(request.error ?? new Error('Failed to read record from IndexedDB'))
  })

export const putRecord = <T>(store: IDBObjectStore, record: T): Promise<IDBValidKey> =>
  new Promise((resolve, reject) => {
    const request = store.put(record)
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error ?? new Error('Failed to write record to IndexedDB'))
  })

export const putRecords = async <T>(store: IDBObjectStore, records: T[]): Promise<void> => {
  for (const record of records) {
    await putRecord(store, record)
  }
}

export const clearStore = (store: IDBObjectStore): Promise<void> =>
  new Promise((resolve, reject) => {
    const request = store.clear()
    request.onsuccess = () => resolve()
    request.onerror = () => reject(request.error ?? new Error('Failed to clear IndexedDB store'))
  })
