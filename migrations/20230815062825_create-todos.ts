import config from 'config'
import type { Knex } from 'knex'

const TODOS_TABLE: string = config.get('database.tables.todos')

export function up(knex: Knex): Promise<void> {
    return knex.raw(`
        create table ${TODOS_TABLE} (
            id text not null primary key,
            name text not null,
            when_done timestamptz,
            deleted_at timestamptz,
            created_at timestamptz not null default now(),
            updated_at timestamptz not null default now()
        );
    `)
}

export function down(knex: Knex): Promise<void> {
    return knex.raw(`drop table ${TODOS_TABLE};`)
}
