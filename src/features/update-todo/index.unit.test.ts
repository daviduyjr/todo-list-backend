import 'reflect-metadata'
import { Factory } from 'rosie'
import type { IParameters } from './parameters'
import type { IResponse } from './response'
import type { IExecutable } from '@interfaces/executable'
import type { ITodo } from '@src/interfaces/models'
import UpdateTodo from '.'

describe('UpdateTodo', (): void => {
    const mockTodoDataSource = {
        update: jest.fn(),
        get: jest.fn(),
    }

    const mockTodo1: ITodo = Factory.build('todo-1')

    const mockTodoParameters: IParameters = {
        id: mockTodo1.id,
        name: 'Updated-Todo',
        when_done: new Date().toISOString(),
        deleted_at: new Date().toISOString(),
    }

    const mockUpdateTodoResponse = Factory.build('todo-1', {
        name: mockTodoParameters.name,
        when_done: mockTodoParameters.when_done,
        deleted_at: mockTodoParameters.deleted_at,
    }) as ITodo

    const getInstance: () => IExecutable<IParameters, IResponse> = (): IExecutable<IParameters, IResponse> => new UpdateTodo(mockTodoDataSource)

    beforeEach((): void => {
        mockTodoDataSource.get.mockResolvedValue([mockTodo1])
        mockTodoDataSource.update.mockResolvedValue(mockUpdateTodoResponse)
    })

    afterEach((): void => {
        jest.resetAllMocks()
    })

    describe('#process', (): void => {
        it('returns the correct response of the UpdateTodo function', async (): Promise<void> => {
            const subject: IExecutable<IParameters, IResponse> = getInstance()
            const updateTodo = await subject.execute(mockTodoParameters)
            expect(updateTodo).toHaveProperty('name', mockTodoParameters.name)
            expect(updateTodo).toHaveProperty('when_done', mockTodoParameters.when_done)
            expect(updateTodo).toHaveProperty('deleted_at', mockTodoParameters.deleted_at)
        })

        it('passes the correct parameters to the TodoDataSource#update function', async (): Promise<void> => {
            const subject: IExecutable<IParameters, IResponse> = getInstance()
            await subject.execute(mockTodoParameters)
            const updateParameterParameters = mockTodoDataSource.update.mock.calls[0]
            expect(updateParameterParameters[1]).toHaveProperty('id')
            expect(updateParameterParameters[0]).toHaveProperty('name')
            expect(updateParameterParameters[0]).toHaveProperty('when_done')
            expect(updateParameterParameters[0]).toHaveProperty('deleted_at')
        })

        it('passes the correct parameters to the TodoDataSource#get function', async (): Promise<void> => {
            const subject: IExecutable<IParameters, IResponse> = getInstance()
            await subject.execute(mockTodoParameters)
            const updateParameterParameters = mockTodoDataSource.get.mock.calls[0]
            expect(updateParameterParameters[0]).toHaveProperty('id')
        })

        it('calls the TodoDataSource#update function', async (): Promise<void> => {
            const subject: IExecutable<IParameters, IResponse> = getInstance()
            await subject.execute(mockTodoParameters)
            expect(mockTodoDataSource.update).toHaveBeenCalled()
        })

        it('calls the TodoDataSource#get function', async (): Promise<void> => {
            const subject: IExecutable<IParameters, IResponse> = getInstance()
            await subject.execute(mockTodoParameters)
            expect(mockTodoDataSource.get).toHaveBeenCalled()
        })

        it('fails when the TodoDataSource#get function throws a TODODOESNOTEXIST error', async (): Promise<void> => {
            mockTodoDataSource.get.mockResolvedValue([])
            const subject: IExecutable<IParameters, IResponse> = getInstance()
            const mockError = {
                code: 'TODODOESNOTEXIST',
                message: 'Todo does not exist',
            }
            mockTodoDataSource.update.mockRejectedValue(mockError)
            try {
                await subject.execute(mockTodoParameters)
            } catch (error) {
                const {
                    code,
                    message,
                } = mockError
                expect(error).toHaveProperty('code', code)
                expect(error).toHaveProperty('message', message)
                return
            }
            throw new Error('fail')
        })
    })
})
