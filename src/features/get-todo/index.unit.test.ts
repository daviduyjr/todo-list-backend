/* eslint-disable no-magic-numbers */
import 'reflect-metadata'
import type { IParameters } from './parameters'
import type { IResponse } from './response'
import type { IExecutable } from '@interfaces/executable'
import type { ITodo } from '@src/interfaces/models'
import GetTodo from '.'

describe('GetTodo', (): void => {
    const mockTodoDataSource = {
        get: jest.fn(),
    }

    const mockTodos: ITodo[] = []
    for (let i = 1; i <= 10; i++) mockTodos.push({
        id: String(i),
        name: `Todo ${i}`,
        when_done: null,
        deleted_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
    })

    const mockTodoParameters: IParameters = {
        page: 1,
        limit: 10,
    }

    const getInstance: () => IExecutable<IParameters, IResponse> = (): IExecutable<IParameters, IResponse> => new GetTodo(mockTodoDataSource)

    beforeEach((): void => {
        mockTodoDataSource.get.mockResolvedValue(mockTodos)
    })

    afterEach((): void => {
        jest.resetAllMocks()
    })

    describe('#process', (): void => {
        it('returns the correct response of the GetTodo function', async (): Promise<void> => {
            const subject: IExecutable<IParameters, IResponse> = getInstance()
            const response = await subject.execute(mockTodoParameters)
            expect(response.length).toBe(10)
        })

        it('passes the correct parameters to the TodoDataSource#get function', async (): Promise<void> => {
            const subject: IExecutable<IParameters, IResponse> = getInstance()
            await subject.execute(mockTodoParameters)
            const getParameterParameters = mockTodoDataSource.get.mock.calls[0]
            expect(getParameterParameters[1]).toHaveProperty('limit')
            expect(getParameterParameters[1]).toHaveProperty('offset')
        })

        it('calls the TodoDataSource#get function', async (): Promise<void> => {
            const subject: IExecutable<IParameters, IResponse> = getInstance()
            await subject.execute(mockTodoParameters)
            expect(mockTodoDataSource.get).toHaveBeenCalled()
        })
    })
})
