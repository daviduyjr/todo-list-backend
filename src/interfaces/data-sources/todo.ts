import type { IDataSource } from './interface'
import type { IOptions } from '@src/features/interface'
import type { ITodo } from '@src/interfaces/models'

export interface IGetTodoParameters {
    id?: string,
    name?: string,
}

export interface IQueryTodoParameters {
    id?: string,
}

export interface ITodoDataSource extends IDataSource {
    create: (parameters: Partial<ITodo>) => Promise<ITodo>,
    get: (parameters?: Partial<ITodo>, options?: IOptions) => Promise<ITodo[]>,
    update: (parameters: Partial<ITodo>, queryParameters: IQueryTodoParameters, options?: IOptions) => Promise<ITodo>,
    delete: (queryParameters: IQueryTodoParameters, options?: IOptions) => Promise<number>,
}
