import type { Knex } from 'knex'

export interface IValidationError {
    message: string,
    key: string | undefined,
}

export interface IOptions {
    transaction?: Knex.Transaction,
    for_update?: boolean,
    include?: {
        product?: boolean,
        done_todos?: boolean,
    },
    sort?: {
        column: string,
        order: 'asc' | 'desc',
    },
    limit?: number,
    offset?: number,
}
