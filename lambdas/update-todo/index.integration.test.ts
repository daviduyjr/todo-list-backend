import { StatusCodes } from 'http-status-codes'
import { Factory } from 'rosie'
import type { IBodyParameters } from './interface'
import type { ITodoDataSource } from '@interfaces/data-sources'
import type { ITodo } from '@interfaces/models'
import container from '@src/index'
import Types from '@src/types'
import validateTodo from '@tests/assertions'
import { handler } from '.'

describe('UpdateTodoEndpoint', (): void => {
    const todoDataSource: ITodoDataSource = container.get(Types.TodoService)
    const mockTodo: ITodo = Factory.build('todo-1')

    const updateTodoParameters: IBodyParameters = {
        name: 'Updated-Todo',
        when_done: new Date().toISOString(),
    }
    const mockValidEvent = {
        pathParameters: {
            id: mockTodo.id,
        },
        body: JSON.stringify(updateTodoParameters),
    }
    const mockInvalidEvent = {
        pathParameters: {
            id: mockTodo.id,
        },
        body: JSON.stringify({
            updated_at: '',
        }),
    }

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
            const response = await handler(mockValidEvent)
            const {
                body,
            } = response
            const parsedBody = JSON.parse(body)
            const {
                data,
            }: { data: ITodo } = parsedBody
            expect(response).toHaveProperty('statusCode', StatusCodes.OK)
            expect(response).toHaveProperty('body')
            expect(parsedBody).toHaveProperty('status', 'success')
            expect(parsedBody).toHaveProperty('data')
            expect(data).toHaveProperty('name', updateTodoParameters.name)
            validateTodo(data)
        })

        it('updates the when_done column in todo', async (): Promise<void> => {
            const mockValidEvent2 = {
                pathParameters: {
                    id: mockTodo.id,
                },
                body: JSON.stringify({
                    when_done: new Date().toISOString(),
                }),
            }
            const response = await handler(mockValidEvent2)
            const {
                body,
            } = response
            const parsedBody = JSON.parse(body)
            const {
                data,
            }: { data: ITodo } = parsedBody

            expect(response).toHaveProperty('statusCode', StatusCodes.OK)
            expect(response).toHaveProperty('body')
            expect(parsedBody).toHaveProperty('status', 'success')
            expect(parsedBody).toHaveProperty('data')
            expect(data.when_done).not.toBeNull()
            validateTodo(data)
        })

        it('soft deletes the todo', async (): Promise<void> => {
            const mockValidEvent2 = {
                pathParameters: {
                    id: mockTodo.id,
                },
                body: JSON.stringify({
                    deleted_at: new Date().toISOString(),
                }),
            }
            const response = await handler(mockValidEvent2)
            const {
                body,
            } = response
            const parsedBody = JSON.parse(body)
            const {
                data,
            }: { data: ITodo } = parsedBody

            expect(response).toHaveProperty('statusCode', StatusCodes.OK)
            expect(response).toHaveProperty('body')
            expect(parsedBody).toHaveProperty('status', 'success')
            expect(parsedBody).toHaveProperty('data')
            expect(data.deleted_at).not.toBeNull()
            validateTodo(data)
        })

        it('returns a failed response if the parameters are invalid', async (): Promise<void> => {
            const response = await handler(mockInvalidEvent)
            const {
                body,
            } = response
            const parsedBody = JSON.parse(body)

            expect(response).toHaveProperty('statusCode', StatusCodes.OK)
            expect(response).toHaveProperty('body')
            expect(parsedBody).toHaveProperty('status', 'failed')
            expect(parsedBody).toHaveProperty('error')
            expect(parsedBody.error).toHaveProperty('code', 'ValidationError')
            expect(parsedBody.error).toHaveProperty('message')
            expect(parsedBody.error).toHaveProperty('details')
        })

        it('returns a failed response if todo is not existing', async (): Promise<void> => {
            await todoDataSource.truncate()
            const mockInvalidEvent2 = {
                pathParameters: {
                    id: mockTodo.id,
                },
                body: JSON.stringify(updateTodoParameters),
            }
            const response = await handler(mockInvalidEvent2)
            const {
                body,
            } = response
            const parsedBody = JSON.parse(body)

            expect(response).toHaveProperty('statusCode', StatusCodes.OK)
            expect(response).toHaveProperty('body')
            expect(parsedBody).toHaveProperty('status', 'failed')
            expect(parsedBody).toHaveProperty('error')
            expect(parsedBody.error).toHaveProperty('code', 'TODODOESNOTEXIST')
            expect(parsedBody.error).toHaveProperty('message')
        })
    })
})
