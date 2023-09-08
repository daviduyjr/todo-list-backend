import { Container } from 'inversify'
import Types from '@src/types'
import CreateTodo from './create-todo'
import DeleteTodo from './delete-todo'
import GetTodo from './get-todo'
import UpdateTodo from './update-todo'

const container = new Container()

container.bind(Types.CreateTodo).to(CreateTodo)
container.bind(Types.UpdateTodo).to(UpdateTodo)
container.bind(Types.DeleteTodo).to(DeleteTodo)
container.bind(Types.GetTodo).to(GetTodo)

export default container
