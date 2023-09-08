module.exports = {
    app: {
        environment: process.env.ENVIRONMENT,
        env: process.env.NODE_ENV,
        port: process.env.PORT,
    },
    database: {
        migrations: 'knex_migrations',
        client: 'postgres',
        name: process.env.DB_NAME,
        connection: {
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
        },
        etc: {
            pool: {
                min: 0,
                max: 10,
            },
            acquire_connection_timeout: 60000,
        },
        tables: {
            todos: 'todos',
        },
        postgres_errors: {
            foreign_key: '23503',
            unique: '23505',
            no_data_found: 'P0002',
        },
    },
}
