import type { ISystemError } from './interface'

export default class SystemError extends Error {
    private readonly code: string

    private readonly details: unknown

    constructor({
        code,
        message,
        details,
    }: ISystemError) {
        super(message || 'System Error')
        this.code = code ?? 'SystemError'
        this.details = details
    }
}
