export type BshDate = { $date: string }

export type BshObject = {
    persistenceId: string,
    CreatedAt?: BshDate,
    CreatedBy?: string,
    LastUpdatedAt?: BshDate
    LastUpdatedBy?: string
}

export type BshObjectPure<T> = Omit<T, 'persistenceId' | 'CreatedAt' | 'CreatedBy' | 'LastUpdatedAt' | 'LastUpdatedBy'>
