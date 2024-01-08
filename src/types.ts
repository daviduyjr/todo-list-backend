/* eslint-disable @typescript-eslint/naming-convention */
export default {
    // Features
    CreateTodo: Symbol.for('CreateTodo'),
    UpdateTodo: Symbol.for('UpdateTodo'),
    DeleteTodo: Symbol.for('DeleteTodo'),
    GetTodo: Symbol.for('GetTodo'),
    Login: Symbol.for('LogIn'),

    // Services
    TodoService: Symbol.for('TodoService'),
    IdService: Symbol.for('IdService'),
    UserService: Symbol.for('UserService'),
    JwtService: Symbol.for('JwtService'),
    
    // Dependencies
    Knex: Symbol.for('Knex'),
}
