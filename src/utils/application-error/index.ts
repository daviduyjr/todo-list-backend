import type { IApplicationError } from './interface'

export default class ApplicationError extends Error {
    private readonly code: string

    private readonly details: unknown

    constructor({
        code,
        message,
        details,
    }: IApplicationError) {
        super(message || 'Application Error')
        this.code = code ?? 'ApplicationError'
        this.details = details
    }
}
