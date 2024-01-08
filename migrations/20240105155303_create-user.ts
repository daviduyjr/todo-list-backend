import config from 'config'
import type { Knex } from 'knex'

const USERS_TABLE: string = config.get('database.tables.users')

export function up(knex: Knex): Promise<void> {
    return knex.raw(`
        create table ${USERS_TABLE} (
            id text not null primary key,
            name text not null,
            password text not null,
            created_at timestamptz not null default now(),
            updated_at timestamptz not null default now()
        );
    `)
}

export function down(knex: Knex): Promise<void> {
    return knex.raw(`drop table ${USERS_TABLE};`)
}
