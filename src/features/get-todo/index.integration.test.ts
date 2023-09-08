/* eslint-disable no-magic-numbers */
import { Factory } from 'rosie'
import type { IParameters } from './parameters'
import type { IResponse } from './response'
import type { IExecutable } from '@interfaces/executable'
import type { ITodoDataSource } from '@src/interfaces/data-sources'
import type { ITodo } from '@src/interfaces/models'
import container from '@src/index'
import Types from '@src/types'

describe('#GetTodo', (): void => {
    const todoDataSource: ITodoDataSource = container.get(Types.TodoService)
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

    it('checks the if the pagination is returning the right length of todos response', async (): Promise<void> => {
        const subject: IExecutable<IParameters, IResponse> = container.get(Types.GetTodo)

        const response = await subject.execute({
            page: 2,
            limit: 10,
        })

        const isInRange = response.every((item: ITodo): boolean => {
            const id = Number(item.id)
            return !isNaN(id) && id >= 11 && id <= 20
        })
        expect(isInRange).toBe(true)
        expect(response.length).toBe(10)
    })

    it('returns all the todos that are when_done is not null', async (): Promise<void> => {
        const subject: IExecutable<IParameters, IResponse> = container.get(Types.GetTodo)

        const response = await subject.execute({}, {
            include: {
                done_todos: true,
            },
        })

        response.forEach((todo: ITodo): void => {
            expect(todo.when_done).not.toBeNull()
        })
    })
})
