/* eslint-disable no-magic-numbers */
import { StatusCodes } from 'http-status-codes'
import { Factory } from 'rosie'
import type { ITodoDataSource } from '@interfaces/data-sources'
import type { ITodo } from '@interfaces/models'
import type {
    Request, Response,
} from 'express'
import container from '@src/index'
import Types from '@src/types'
import deleteTodo from '.'

describe('DeleteTodoEndpoint', (): void => {
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
                }
            }
            let capturedData: any

            const res: any = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn((data: any) => {
                    capturedData = data
                    return res
                }),
            }
            await deleteTodo(req as Request, res as Response)
            expect(capturedData.status).toEqual('success');
            expect(capturedData.data).toEqual(1);
        })

        it('returns a failed response if the parameters are invalid', async (): Promise<void> => {
            const req: Partial<Request> = {
                params: {
                    name: '2',
                },
            }
            const res: any = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };
            await deleteTodo(req as Request, res as Response)
            expect(res.json).toHaveBeenCalledWith({
                status: 'failed',
                error: {
                    code: 'ValidationError',
                    message: 'Validation error',
                    details: [
                        { message: '"id" is required', key: 'id' }
                    ],
                },
            });
        })

        it('returns a failed response if todo is not existing', async (): Promise<void> => {
            const req: Partial<Request> = {
                params: {
                    id: '2',
                },
            }
            const res: any = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };
            await deleteTodo(req as Request, res as Response)
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
