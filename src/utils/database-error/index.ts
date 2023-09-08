import type { IDatabaseError } from './interface'

export default class DatabaseError extends Error {
    private readonly code: string

    private readonly details: unknown

    constructor({
        code,
        message,
        details,
    }: IDatabaseError) {
        super(message || 'Database Error')
        this.code = code ?? 'DatabaseError'
        this.details = details
    }
}
