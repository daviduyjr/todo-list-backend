/* eslint-disable no-magic-numbers */
import {
    inject,
    injectable,
} from 'inversify'
import type { IParameters } from './parameters'
import type { IResponse } from './response'
import type { ITodoDataSource } from '@src/interfaces/data-sources'
import type { ITodo } from '@src/interfaces/models'
import AbstractFeature from '@features/abstract'
import Types from '@src/types'
import DatabaseError from '@utils/database-error'
import schema from './schema'

@injectable()
export default class DeleteTodo extends AbstractFeature<IParameters, IResponse> {
    constructor(
        @inject(Types.TodoService) private readonly todoDataSource: Pick<ITodoDataSource, 'delete' | 'get'>,
    ) {
        super(schema)
    }

    async process(parameters: IParameters): IResponse {
        const {
            id,
        } = parameters
        const getTodo: ITodo[] = await this.todoDataSource.get({
            id,
        })

        if (getTodo.length === 0) throw new DatabaseError({
            code: 'TODODOESNOTEXIST',
            message: 'Todo does not exist',
        })

        const response: number = await this.todoDataSource.delete({
            id,
        })
        return response
    }
}
