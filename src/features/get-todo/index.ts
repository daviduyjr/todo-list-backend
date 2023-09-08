/* eslint-disable no-magic-numbers */
import {
    inject,
    injectable,
} from 'inversify'
import type { IParameters } from './parameters'
import type { IResponse } from './response'
import type { IOptions } from '../interface'
import type { ITodoDataSource } from '@src/interfaces/data-sources'
import type { ITodo } from '@src/interfaces/models'
import AbstractFeature from '@features/abstract'
import Types from '@src/types'
import schema from './schema'

@injectable()
export default class GetTodo extends AbstractFeature<IParameters, IResponse> {
    constructor(
        @inject(Types.TodoService) private readonly todoDataSource: Pick<ITodoDataSource, 'get'>,
    ) {
        super(schema)
    }

    async process(parameters: IParameters, options?: IOptions): IResponse {
        const {
            page,
            limit,
            ...rest
        } = parameters

        const offset = (page! - 1) * limit!

        const response: ITodo[] = await this.todoDataSource.get({
            ...rest,
        }, {
            offset,
            limit,
            ...options,
        })

        return response
    }
}
