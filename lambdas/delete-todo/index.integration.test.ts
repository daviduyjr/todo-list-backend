/* eslint-disable no-magic-numbers */
import { StatusCodes } from 'http-status-codes'
import { Factory } from 'rosie'
import type { ITodoDataSource } from '@interfaces/data-sources'
import type { ITodo } from '@interfaces/models'
import container from '@src/index'
import Types from '@src/types'
import { handler } from '.'

describe('DeleteTodoEndpoint', (): void => {
    const todoDataSource: ITodoDataSource = container.get(Types.TodoService)
    const mockTodo: ITodo = Factory.build('todo-1')

    const mockValidEvent = {
        pathParameters: {
            id: mockTodo.id,
        },
    }
    const mockInvalidEvent = {
        pathParameters: {
            id: '',
            updated_at: '',
        },
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
            }: { data: number } = parsedBody
            expect(response).toHaveProperty('statusCode', StatusCodes.OK)
            expect(response).toHaveProperty('body')
            expect(parsedBody).toHaveProperty('status', 'success')
            expect(parsedBody).toHaveProperty('data')
            expect(data).toBe(1)
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
            const response = await handler(mockValidEvent)
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
