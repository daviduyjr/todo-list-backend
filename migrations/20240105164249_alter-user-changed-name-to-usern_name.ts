import config from 'config'
import type { Knex } from 'knex'

const USERS_TABLE: string = config.get('database.tables.users')

export function up(knex: Knex): Promise<void> {
    return knex.schema.alterTable(USERS_TABLE, (table) => {
        table.renameColumn('name', 'user_name')
    })
}

export function down(knex: Knex): Promise<void> {
    return knex.schema.alterTable(USERS_TABLE, (table) => {
        table.renameColumn('user_name', 'name')
    })
}
