import type { ITodo } from '@src/interfaces/models'

export default (todo: ITodo): void => {
    expect(todo).toHaveProperty('id')
    expect(todo).toHaveProperty('name')
    expect(todo).toHaveProperty('when_done')
    expect(todo).toHaveProperty('created_at')
    expect(todo).toHaveProperty('updated_at')
}
