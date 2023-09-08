/* eslint-disable no-magic-numbers */
// import config from 'config'
// import { Knex } from 'knex'
import { Factory } from 'rosie'
import type { ITodoDataSource } from '@src/interfaces/data-sources'
import type { ITodo } from '@src/interfaces/models'
import container from '@src/index'
import Types from '@src/types'
import validateTodo from '@tests/assertions'

describe('TodoService', (): void => {
    const todoDataSource: ITodoDataSource = container.get(Types.TodoService)
    // const knex: Knex = container.get(Types.Knex)

    afterEach(async (): Promise<void> => {
        await todoDataSource.truncate()
    })
    describe('#Create', (): void => {
        const mockTodo: ITodo = Factory.build('todo-1')
        it('creates todos', async (): Promise<void> => {
            const response = await todoDataSource.create(mockTodo)
            expect(response).toEqual(mockTodo)
            validateTodo(response)
        })
        it('throws error if name is already exist', async (): Promise<void> => {
            try {
                const params2 = {
                    ...mockTodo,
                    id: '2',
                }
                await todoDataSource.create(mockTodo)
                await todoDataSource.create(params2)
            } catch (error) {
                expect(error.code).toEqual('UniqueConstraintError')
                return
            }
            throw new Error('fail')
        })
    })

    describe('#Get', (): void => {
        const todos: ITodo[] = []
        for (let i = 1; i <= 50; i++) {
            const isDone = i >= 30 && i <= 38
            const isDeleted = i >= 41 && i <= 50
            const when_done = isDone ? new Date().toISOString() : null
            const deleted_at = isDeleted ? new Date().toISOString() : null

            const mockTodo: ITodo = Factory.build('todo-1', {
                id: String(i),
                name: `Todo-${i}`,
                when_done,
                deleted_at,
            }) as ITodo
            todos.push(mockTodo)
        }

        beforeEach(async (): Promise<void> => {
            await Promise.all(todos.map(async (todo: ITodo): Promise<void> => {
                await todoDataSource.create(todo)
            }))
        })

        afterEach(async (): Promise<void> => {
            await todoDataSource.truncate()
        })

        it('gets all the todos and the not deleted todos in the database', async (): Promise<void> => {
            const response = await todoDataSource.get({})
            console.log('!! ~ file: index.integration.test.ts:70 ~ response:', response)
            expect(response.length).toBe(40)
        })

        it('returns empty array if there is no data in the database', async (): Promise<void> => {
            await todoDataSource.truncate()

            const response = await todoDataSource.get({}, {
                offset: 0,
                limit: 10,
            })
            expect(response).toEqual([])
        })

        it('gets data using name parameters in the database', async (): Promise<void> => {
            const params = {
                name: 'o-21',
            }
            const [response] = await todoDataSource.get({
                ...params,
            }, {
                offset: 0,
                limit: 10,
            })
            expect(response).toHaveProperty('name', 'Todo-21')
        })

        it('gets all data that the when_done is not null in the database', async (): Promise<void> => {
            const response = await todoDataSource.get({}, {
                include: {
                    done_todos: true,
                },
            })
            expect(response.length).toBe(9)
        })
    })

    describe('#Update', (): void => {
        const mockTodo: ITodo = Factory.build('todo-1')

        beforeEach(async (): Promise<void> => {
            await todoDataSource.create(mockTodo)
        })

        afterEach(async (): Promise<void> => {
            await todoDataSource.truncate()
        })
        it('updates todo in the database', async (): Promise<void> => {
            const parameters = {
                name: 'New-Todo-Name',
            }
            const queryParameters = {
                id: mockTodo.id,
            }
            const response = await todoDataSource.update(parameters, queryParameters)
            expect(response).toHaveProperty('name', parameters.name)
            validateTodo(response)
        })

        it('soft deletes todo in the database', async (): Promise<void> => {
            const parameters = {
                deleted_at: new Date().toISOString(),
            }
            const queryParameters = {
                id: mockTodo.id,
            }
            const response: ITodo = await todoDataSource.update(parameters, queryParameters)
            expect(response.deleted_at).not.toBeNull()
            validateTodo(response)
        })
    })
})
