/* eslint-disable no-magic-numbers */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { StatusCodes } from 'http-status-codes'
import type { ITodoDataSource } from '@interfaces/data-sources'
import type { ITodo } from '@interfaces/models'
import type { IParameters } from '@src/features/get-todo/parameters'
import type {
    Request, Response,
} from 'express'
import container from '@src/index'
import Types from '@src/types'
import validateTodo from '@tests/assertions'
import getTodos from '.'

describe('GetTodoEndpoint', (): void => {
    const todoDataSource: ITodoDataSource = container.get(Types.TodoService)
    const todos: ITodo[] = []
    for (let i = 1; i <= 50; i++) {
        const isDone = i >= 30 && i <= 38
        const isDeleted = i >= 41 && i <= 50
        const when_done = isDone ? new Date().toISOString() : null
        const deleted_at = isDeleted ? new Date().toISOString() : null

        const todo: ITodo = {
            id: String(i),
            name: `Todo ${i}`,
            when_done,
            deleted_at,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        }
        todos.push(todo)
    }

    const mockValidEvent = {
        query: {
            name: 'Todo 10',
        },
    }

    beforeEach(async (): Promise<void> => {
        await Promise.all(todos.map(async (todo: ITodo): Promise<void> => {
            await todoDataSource.create(todo)
        }))
        container.snapshot()
    })

    afterEach(async (): Promise<void> => {
        await todoDataSource.truncate()
        container.restore()
        jest.resetAllMocks()
    })

    describe('#handler', (): void => {
        it('returns a success response if the parameters are valid', async (): Promise<void> => {
            const req: any = {
                query: {
                    name: 'Todo 10',
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
            await getTodos(req as Request, res as Response)
            const data: ITodo[] = capturedData.data
            expect(capturedData.status).toEqual('success');
            expect(data[0].id).toEqual('10');
            data.forEach((todo: ITodo): void => {
                validateTodo(todo)
            })
        })

        it('returns a failed response if the parameters are invalid', async (): Promise<void> => {
            const req: any = {
                query: {
                    name: 10,
                },
            }
            const res: any = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };
            await getTodos(req as Request, res as Response)
            expect(res.json).toHaveBeenCalledWith({
                status: 'failed',
                error: {
                  code: 'ValidationError',
                  message: 'Validation error',
                  details: [
                    {
                      key: 'name',
                      message: '"name" must be a string',
                    },
                  ],
                },
              });
        })

        it('returns a empty array response if todo is not existing', async (): Promise<void> => {
            const req: any = {
                query: {
                    name: 'Not Existing',
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
            await getTodos(req as Request, res as Response)
            expect(capturedData).toHaveProperty('status', 'success')
            expect(capturedData).toHaveProperty('data', [])
        })

        // it('returns the all todos that are not deleted', async (): Promise<void> => {
        //     const mockValidEvent2 = {
        //         queryStringParameters: {
        //             page: 1,
        //             limit: 100,
        //         },
        //     }
        //     const response = await handler(mockValidEvent2)
        //     const {
        //         body,
        //     } = response
        //     const parsedBody = JSON.parse(body)
        //     const {
        //         data,
        //     }: { data: ITodo[] } = parsedBody

        //     expect(data.length).toBe(40)
        //     data.forEach((todo: ITodo): void => {
        //         expect(todo.deleted_at).toBeNull()
        //     })
        // })

        // it('test the pagination of the get todos', async (): Promise<void> => {
        //     const mockValidEvent2 = {
        //         queryStringParameters: {
        //             page: 2,
        //             limit: 10,
        //         },
        //     }
        //     const response = await handler(mockValidEvent2)
        //     const {
        //         body,
        //     } = response
        //     const parsedBody = JSON.parse(body)
        //     const {
        //         data,
        //     }: { data: ITodo[] } = parsedBody

        //     data.forEach((todo: ITodo): void => {
        //         expect(todo.deleted_at).toBeNull()
        //     })
        //     const isInRange = data.every((item: ITodo): boolean => {
        //         const id = Number(item.id)
        //         return !isNaN(id) && id >= 11 && id <= 20
        //     })
        //     expect(isInRange).toBe(true)
        //     expect(data.length).toBe(10)
        // })
    })
})
