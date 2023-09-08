/* eslint-disable @typescript-eslint/naming-convention */
export default {
    // Features
    CreateTodo: Symbol.for('CreateTodo'),
    UpdateTodo: Symbol.for('UpdateTodo'),
    DeleteTodo: Symbol.for('DeleteTodo'),
    GetTodo: Symbol.for('GetTodo'),

    // Services
    TodoService: Symbol.for('TodoService'),
    IdService: Symbol.for('IdService'),

    // Dependencies
    Knex: Symbol.for('Knex'),
}
