/* eslint-disable capitalized-comments */
/* eslint-disable no-magic-numbers */
import config from 'config'
import {
    inject,
    injectable,
} from 'inversify'
import { Knex } from 'knex'
import type { IOptions } from '@src/features/interface'
import type {
    ITodoDataSource, IQueryTodoParameters,
} from '@src/interfaces/data-sources'
import type { ITodo } from '@src/interfaces/models'
import Types from '@src/types'
import DatabaseError from '@src/utils/database-error'

const TODOS_TABLE: string = config.get('database.tables.todos')
const UNIQUE_ERROR_CODE: string = config.get('database.postgres_errors.unique')
const NO_DATA_FOUND_ERROR_CODE: string = config.get('database.postgres_errors.no_data_found')

@injectable()
export default class TodoService implements ITodoDataSource {
    @inject(Types.Knex) private readonly knex!: Knex

    async create(parameters: Partial<ITodo>): Promise<ITodo> {
        const quiryBuilder = this.knex(TODOS_TABLE)
        try {
            const [todo]: ITodo[] = await quiryBuilder.insert(parameters).returning('*')
            const {
                created_at,
                updated_at,
            } = todo
            return {
                ...todo,
                created_at: new Date(created_at).toISOString(),
                updated_at: new Date(updated_at).toISOString(),
            }
        } catch (error) {
            const {
                code,
                detail,
            } = error
            switch (code) {
                case UNIQUE_ERROR_CODE:
                    throw new DatabaseError({
                        code: 'UniqueConstraintError',
                        message: detail,
                        details: error,
                    })
                default:
                    throw new DatabaseError({
                        code: 'SomethingWentWrongError',
                        message: detail,
                        details: error,
                    })
            }
        }
    }

    async get(parameters?: Partial<ITodo>, options?: IOptions): Promise<ITodo[]> {
        const {
            id,
            name,
        } = {
            ...parameters,
        }
        const {
            offset,
            limit,
            include,
        } = {
            ...options,
        }
        const {
            done_todos,
        } = {
            ...include,
        }

        const subQuery = this.knex.raw(`
        (SELECT COUNT(*) FROM ${TODOS_TABLE}
        WHERE ${TODOS_TABLE}.deleted_at IS NULL
        ) as total_count`)

        const queryBuilder = this.knex(TODOS_TABLE)
        try {
            const todosQuery = queryBuilder.where((builder: Knex.QueryBuilder): void => {
                if (id) builder.where(`${TODOS_TABLE}.id`, parameters!.id)
                if (name) builder.whereILike(`${TODOS_TABLE}.name`, `%${name}%`)
                if (done_todos) builder.whereNotNull(`${TODOS_TABLE}.when_done`)
                builder.whereNull(`${TODOS_TABLE}.deleted_at`)
            }).select(`${TODOS_TABLE}.*`, subQuery)
            if (offset) queryBuilder.offset(offset)
            if (limit) queryBuilder.limit(limit)
            queryBuilder.orderBy('created_at', 'asc')

            const response: ITodo[] = await todosQuery

            if (response.length === 0) return []

            return response.map((todo: ITodo): ITodo => {
                const {
                    created_at,
                    updated_at,
                } = todo
                return {
                    ...todo,
                    created_at: new Date(created_at).toISOString(),
                    updated_at: new Date(updated_at).toISOString(),
                }
            })
        } catch (error) {
            console.log('!! ~ file: index.ts:96 ~ error:', error)
            const {
                // eslint-disable-next-line no-shadow
                code,
                detail,
            } = error
            switch (code) {
                case NO_DATA_FOUND_ERROR_CODE:
                    throw new DatabaseError({
                        code: 'NoDataFoundError',
                        message: detail,
                        details: error,
                    })
                default:
                    throw new DatabaseError({
                        code: 'SomethingWentWrongError',
                        message: detail,
                        details: error,
                    })
            }
        }
    }

    async update(parameters: Partial<ITodo>, queryParameters: IQueryTodoParameters, options?: IOptions): Promise<ITodo> {
        const {
            id,
        } = {
            ...queryParameters,
        }

        const queryBuilder = this.knex(TODOS_TABLE)
        try {
            const [todo]: ITodo[] = await queryBuilder.where(`${TODOS_TABLE}.id`, id)
                .update({
                    ...parameters,
                    updated_at: new Date().toISOString(),
                })
                .returning('*')

            return {
                ...todo,
                updated_at: new Date(todo.updated_at).toISOString(),
            }
        } catch (error) {
            const {
                // eslint-disable-next-line no-shadow
                code,
                detail,
            } = error
            switch (code) {
                case NO_DATA_FOUND_ERROR_CODE:
                    throw new DatabaseError({
                        code: 'NoDataFoundError',
                        message: detail,
                        details: error,
                    })
                default:
                    throw new DatabaseError({
                        code: 'SomethingWentWrongError',
                        message: detail,
                        details: error,
                    })
            }
        }
    }

    async delete(queryParameters: IQueryTodoParameters, options?: IOptions): Promise<number> {
        const {
            id,
        } = {
            ...queryParameters,
        }
        const queryBuilder = this.knex(TODOS_TABLE)
        try {
            const deletedTodo: number = await queryBuilder.where(`${TODOS_TABLE}.id`, id)
                .del()
                .returning('')
            return deletedTodo
        } catch (error) {
            const {
                // eslint-disable-next-line no-shadow
                code,
                detail,
            } = error
            switch (code) {
                case NO_DATA_FOUND_ERROR_CODE:
                    throw new DatabaseError({
                        code: 'NoDataFoundError',
                        message: detail,
                        details: error,
                    })
                default:
                    throw new DatabaseError({
                        code: 'SomethingWentWrongError',
                        message: detail,
                        details: error,
                    })
            }
        }
    }

    async truncate(): Promise<void> {
        await this.knex.raw(`truncate ${TODOS_TABLE} cascade;`)
    }
}
