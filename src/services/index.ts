/* eslint-disable new-cap */
/* eslint-disable @typescript-eslint/naming-convention */
import config from 'config'
import { Container } from 'inversify'
import Knex from 'knex'
import IdService from '@services/id'
import Types from '@src/types'
import TodoService from './todo-database'
import UserService from './user-database'
import JwtService from './jwt'

const container = new Container()
const DATABASE_ETC: object = config.get('database.etc')

const knex = Knex({
    client: config.get('database.client'),
    connection: {
        database: config.get('database.name'),
        host: config.get('database.connection.host'),
        user: config.get('database.connection.user'),
        password: config.get('database.connection.password'),
    },
    ...DATABASE_ETC,
})

container.bind(Types.TodoService).to(TodoService)
container.bind(Types.Knex).toConstantValue(knex)
container.bind(Types.IdService).to(IdService)
container.bind(Types.UserService).to(UserService)
container.bind(Types.JwtService).to(JwtService)

export default container
