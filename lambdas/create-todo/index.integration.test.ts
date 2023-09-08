import { StatusCodes } from 'http-status-codes'
import { Factory } from 'rosie'
import type { ITodoDataSource } from '@interfaces/data-sources'
import type { ITodo } from '@interfaces/models'
import type { IParameters } from '@src/features/create-todo/parameters'
import container from '@src/index'
import Types from '@src/types'
import validateTodo from '@tests/assertions'
import { handler } from '.'

describe('CreateTodoEndpoint', (): void => {
    const todoDataSource: ITodoDataSource = container.get(Types.TodoService)
    const mockTodo: ITodo = Factory.build('todo-1')

    const createTodoParameters: IParameters = {
        name: 'New-Todo',
        when_done: null,
    }
    const mockValidEvent = {
        body: JSON.stringify(createTodoParameters),
    }
    const mockInvalidEvent = {
        body: JSON.stringify({
            created_at: '',
        }),
    }

    beforeEach((): void => {
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

        it('returns a failed response if todo is already exist', async (): Promise<void> => {
            await todoDataSource.create(mockTodo)
            const mockInvalidEvent2 = {
                body: JSON.stringify({
                    name: mockTodo.name,
                    when_done: null,
                }),
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
            expect(parsedBody.error).toHaveProperty('code', 'UniqueConstraintError')
            expect(parsedBody.error).toHaveProperty('message')
            expect(parsedBody.error).toHaveProperty('details')
        })
    })
})
