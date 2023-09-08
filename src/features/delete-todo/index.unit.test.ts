import 'reflect-metadata'
import { Factory } from 'rosie'
import type { IParameters } from './parameters'
import type { IResponse } from './response'
import type { IExecutable } from '@interfaces/executable'
import type { ITodo } from '@src/interfaces/models'
import DeleteTodo from '.'

describe('DeleteTodo', (): void => {
    const mockTodoDataSource = {
        delete: jest.fn(),
        get: jest.fn(),
    }

    const mockTodo1: ITodo = Factory.build('todo-1')

    const mockTodoParameters: IParameters = {
        id: mockTodo1.id,
    }

    const mockDeleteTodoResponse = 1

    const getInstance: () => IExecutable<IParameters, IResponse> = (): IExecutable<IParameters, IResponse> => new DeleteTodo(mockTodoDataSource)

    beforeEach((): void => {
        mockTodoDataSource.get.mockResolvedValue([mockTodo1])
        mockTodoDataSource.delete.mockResolvedValue(mockDeleteTodoResponse)
    })

    afterEach((): void => {
        jest.resetAllMocks()
    })

    describe('#process', (): void => {
        it('returns the correct response of the DeleteTodo function', async (): Promise<void> => {
            const subject: IExecutable<IParameters, IResponse> = getInstance()
            const response = await subject.execute(mockTodoParameters)
            expect(response).toBe(1)
        })

        it('passes the correct parameters to the TodoDataSource#delete function', async (): Promise<void> => {
            const subject: IExecutable<IParameters, IResponse> = getInstance()
            await subject.execute(mockTodoParameters)
            const deleteParameterParameters = mockTodoDataSource.delete.mock.calls[0]
            expect(deleteParameterParameters[0]).toHaveProperty('id')
        })

        it('passes the correct parameters to the TodoDataSource#get function', async (): Promise<void> => {
            const subject: IExecutable<IParameters, IResponse> = getInstance()
            await subject.execute(mockTodoParameters)
            const deleteParameterParameters = mockTodoDataSource.get.mock.calls[0]
            expect(deleteParameterParameters[0]).toHaveProperty('id')
        })

        it('calls the TodoDataSource#delete function', async (): Promise<void> => {
            const subject: IExecutable<IParameters, IResponse> = getInstance()
            await subject.execute(mockTodoParameters)
            expect(mockTodoDataSource.delete).toHaveBeenCalled()
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
            mockTodoDataSource.delete.mockRejectedValue(mockError)
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
