import { StatusCodes } from 'http-status-codes'
import { Factory } from 'rosie'
import type { ITodoDataSource } from '@interfaces/data-sources'
import type { ITodo } from '@interfaces/models'
import type { IParameters } from '@src/features/create-todo/parameters'
import type {
    Request, Response,
} from 'express'
import container from '@src/index'
import Types from '@src/types'
import validateTodo from '@tests/assertions'
import createTodo from '.'

describe('CreateTodoEndpoint', (): void => {
    const todoDataSource: ITodoDataSource = container.get(Types.TodoService)
    const mockTodo: ITodo = Factory.build('todo-1')

    beforeEach((): void => {
        container.snapshot()
    })

    afterEach(async (): Promise<void> => {
        await todoDataSource.truncate()
        container.restore()
        jest.resetAllMocks()
    })

    describe('#createTodo', (): void => {
        it('returns a success response if the parameters are valid', async (): Promise<void> => {
            const req = {
                body: {
                    name: 'New-Todo',
                    when_done: null,
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
            await createTodo(req as Request, res as Response)
            expect(capturedData).toEqual({
                status: 'success',
                data: expect.objectContaining({
                    name: 'New-Todo',
                    when_done: null,
                }),
            })

            validateTodo(capturedData.data)
        })

        it('returns a failed response if the parameters are invalid', async (): Promise<void> => {
            const req = {
                body: {
                    when_done: null,
                },
            }
            const res: any = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };
            await createTodo(req as Request, res as Response)
            expect(res.json).toHaveBeenCalledWith({
              status: 'failed',
              error: {
                code: 'ValidationError',
                message: 'Validation error',
                details: [
                  {
                    key: 'name',
                    message: '"name" is required',
                  },
                ],
              },
            });
        })

        /*
         * It('returns a failed response if todo is already exist', async (): Promise<void> => {
         *     await todoDataSource.create(mockTodo)
         *     const mockInvalidEvent2 = {
         *         body: JSON.stringify({
         *             name: mockTodo.name,
         *             when_done: null,
         *         }),
         *     }
         *     const response = await createTodo(mockInvalidEvent2)
         *     const {
         *         body,
         *     } = response
         *     const parsedBody = JSON.parse(body)
         */

        /*
         *     Expect(response).toHaveProperty('statusCode', StatusCodes.OK)
         *     expect(response).toHaveProperty('body')
         *     expect(parsedBody).toHaveProperty('status', 'failed')
         *     expect(parsedBody).toHaveProperty('error')
         *     expect(parsedBody.error).toHaveProperty('code', 'UniqueConstraintError')
         *     expect(parsedBody.error).toHaveProperty('message')
         *     expect(parsedBody.error).toHaveProperty('details')
         * })
         */
    })
})
