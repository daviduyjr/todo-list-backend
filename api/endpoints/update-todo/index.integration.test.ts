import { Factory } from 'rosie'
import type { ITodoDataSource } from '@interfaces/data-sources'
import type { ITodo } from '@interfaces/models'
import type {
    Request, Response,
} from 'express'
import container from '@src/index'
import Types from '@src/types'
import validateTodo from '@tests/assertions'
import updateTodo from '.'

describe('UpdateTodoEndpoint', (): void => {
    const todoDataSource: ITodoDataSource = container.get(Types.TodoService)
    const mockTodo: ITodo = Factory.build('todo-1')

    beforeEach(async (): Promise<void> => {
        await todoDataSource.create(mockTodo)
        container.snapshot()
    })

    afterEach(async (): Promise<void> => {
        await todoDataSource.truncate()
        container.restore()
        jest.resetAllMocks()
    })

    describe('#handler', (): void => {
        it('returns a success response if the parameters are valid', async (): Promise<void> => {
            const req: Partial<Request> = {
                params: {
                    id: mockTodo.id,
                },
                body: {
                    when_done: new Date().toISOString(),
                    name: 'fasdfasdf'
                },
            }
            let capturedData: any

            const res: any = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn((data: any) => {
                    capturedData = data
                    return res
                }),
            }
            await updateTodo(req as Request, res as Response)
            const data: ITodo = capturedData?.data;
            expect(capturedData.status).toEqual('success');
            validateTodo(data)
        })

        it('updates the when_done column in todo', async (): Promise<void> => {
            const req: Partial<Request> = {
                params: {
                    id: mockTodo.id,
                },
                body: {
                    when_done: new Date().toISOString(),
                },
            }
            let capturedData: any

            const res: any = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn((data: any) => {
                    capturedData = data
                    return res
                }),
            }
            await updateTodo(req as Request, res as Response)
            const data: ITodo = capturedData?.data;
            expect(data.when_done).not.toBeNull();
            validateTodo(data)
        })

        it('soft deletes the todo', async (): Promise<void> => {
            const req: Partial<Request> = {
                params: {
                    id: mockTodo.id,
                },
                body: {
                    deleted_at: new Date().toISOString(),
                },
            }
            let capturedData: any

            const res: any = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn((data: any) => {
                    capturedData = data
                    return res
                }),
            }
            await updateTodo(req as Request, res as Response)
            const data: ITodo = capturedData?.data;
            expect(data.deleted_at).not.toBeNull();
            validateTodo(data)
        })

        it('returns a failed response if the parameters are invalid', async (): Promise<void> => {
            const req: Partial<Request> = {
                params: {
                    id: mockTodo.id,
                },
                body: {
                    when_done: '',
                },
            }
            const res: any = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };
            await updateTodo(req as Request, res as Response)
            expect(res.json).toHaveBeenCalledWith({
                status: 'failed',
                error: {
                    code: 'ValidationError',
                    message: 'Validation error',
                    details: [
                        {
                            key: 'when_done',
                            message: '"when_done" is not allowed to be empty',
                        },
                    ],
                },
            });
        })

        it('returns a failed response if todo is not existing', async (): Promise<void> => {
            const req: Partial<Request> = {
                params: {
                    id: '2',
                },
                body: {
                    when_done: new Date().toISOString(),
                },
            }
            const res: any = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };
            await updateTodo(req as Request, res as Response)
            expect(res.json).toHaveBeenCalledWith({
                status: 'failed',
                error: {
                    code: 'TODODOESNOTEXIST',
                    message: 'Todo does not exist',
                    details: undefined,
                },
            });
        })
    })
})
