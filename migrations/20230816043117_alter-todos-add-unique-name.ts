import config from 'config'
import type { Knex } from 'knex'

const TODOS_TABLE: string = config.get('database.tables.todos')

export function up(knex: Knex): Promise<void> {
    return knex.raw(`
        alter table ${TODOS_TABLE}
            add constraint name unique (name);
    `)
}

export function down(knex: Knex): Promise<void> {
    return knex.raw(`
        alter table ${TODOS_TABLE}
            drop constraint name unique (name);
    `)
}
