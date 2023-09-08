import 'reflect-metadata'
import { Factory } from 'rosie'
import type { IParameters } from './parameters'
import type { IResponse } from './response'
import type { IExecutable } from '@interfaces/executable'
import CreateBrand from '.'

describe('CreateTodo', (): void => {
    const mockTodoDataSource = {
        create: jest.fn(),
    }
    const mockIdService = {
        generate: jest.fn(),
    }
    const mockTodoParameters: IParameters = {
        name: 'Mock-Todo',
        when_done: null,
    }
    const mockIdServiceGenerateResponse = 'generatedId'
    const mockCreateTodoResponse = Factory.build('todo-1')
    const getInstance: () => IExecutable<IParameters, IResponse> = (): IExecutable<IParameters, IResponse> => new CreateBrand(mockIdService, mockTodoDataSource)

    beforeEach((): void => {
        mockTodoDataSource.create.mockResolvedValue(mockCreateTodoResponse)
        mockIdService.generate.mockReturnValue(mockIdServiceGenerateResponse)
    })

    afterEach((): void => {
        jest.resetAllMocks()
    })

    describe('#process', (): void => {
        it('returns the correct response of the CreateTodo function', async (): Promise<void> => {
            const subject: IExecutable<IParameters, IResponse> = getInstance()
            const createdTodo = await subject.execute(mockTodoParameters)
            expect(createdTodo).toEqual(mockCreateTodoResponse)
        })

        it('passes the correct parameters to the TodoDataSource#create function', async (): Promise<void> => {
            const subject: IExecutable<IParameters, IResponse> = getInstance()
            await subject.execute(mockTodoParameters)
            const createParameterParameters = mockTodoDataSource.create.mock.calls[0][0]
            expect(createParameterParameters).toHaveProperty('name')
            expect(createParameterParameters).toHaveProperty('when_done')
        })
        it('calls the TodoDataSource#create function', async (): Promise<void> => {
            const subject: IExecutable<IParameters, IResponse> = getInstance()
            await subject.execute(mockTodoParameters)
            expect(mockTodoDataSource.create).toHaveBeenCalled()
        })

        it('fails when the TodoDataSource#create function throws a unique constraint error', async (): Promise<void> => {
            const subject: IExecutable<IParameters, IResponse> = getInstance()
            const mockError = {
                code: 'UniqueConstraintError',
                message: 'Todo record already exists',
            }
            mockTodoDataSource.create.mockRejectedValue(mockError)
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
