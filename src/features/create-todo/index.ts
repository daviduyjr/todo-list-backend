import {
    inject,
    injectable,
} from 'inversify'
import type { IParameters } from './parameters'
import type { IResponse } from './response'
import type { ITodoDataSource } from '@src/interfaces/data-sources'
import type { ITodo } from '@src/interfaces/models'
import type { IIdService } from '@src/services/id/interface'
import AbstractFeature from '@features/abstract'
import Types from '@src/types'
import schema from './schema'

@injectable()
export default class CreateTodo extends AbstractFeature<IParameters, IResponse> {
    constructor(
        @inject(Types.IdService) private readonly idService: Pick<IIdService, 'generate'>,
        @inject(Types.TodoService) private readonly todoDataSource: Pick<ITodoDataSource, 'create'>,
    ) {
        super(schema)
    }

    async process(parameters: IParameters): IResponse {
        const response: ITodo = await this.todoDataSource.create({
            ...parameters,
            id: this.idService.generate(),
        })
        return response
    }
}
