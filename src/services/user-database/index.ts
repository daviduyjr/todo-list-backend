/* eslint-disable capitalized-comments */
/* eslint-disable no-magic-numbers */
import config from 'config'
import {
    inject,
    injectable,
} from 'inversify'
import { Knex } from 'knex'
import type {
  IUserDataSource,
} from '@src/interfaces/data-sources'
import type { IUser } from '@src/interfaces/models'
import Types from '@src/types'
import DatabaseError from '@src/utils/database-error'

const USERS_TABLE: string = config.get('database.tables.users')
const UNIQUE_ERROR_CODE: string = config.get('database.postgres_errors.unique')
const NO_DATA_FOUND_ERROR_CODE: string = config.get('database.postgres_errors.no_data_found')

@injectable()
export default class UserService implements IUserDataSource {
  @inject(Types.Knex) private readonly knex!: Knex

  async create(parameters: Partial<IUser>): Promise<IUser> {
    const quiryBuilder = this.knex(USERS_TABLE)
    try {
        const [user]: IUser[] = await quiryBuilder.insert(parameters).returning('*')
        const {
            created_at,
            updated_at,
        } = user
        return {
            ...user,
            created_at: new Date(created_at).toISOString(),
            updated_at: new Date(updated_at).toISOString(),
        }
    } catch (error) {
        const {
            code,
            detail,
        } = error
        switch (code) {
            case UNIQUE_ERROR_CODE:
                throw new DatabaseError({
                    code: 'UniqueConstraintError',
                    message: detail,
                    details: error,
                })
            default:
                throw new DatabaseError({
                    code: 'SomethingWentWrongError',
                    message: detail,
                    details: error,
                })
        }
    }
  }

  async get(parameters: Partial<IUser>): Promise<IUser[]> {
    const {
      id,
      user_name,
      password
    } = {
        ...parameters,
    }

    try {
      const response: IUser[] = await this.knex(USERS_TABLE)
        .where({user_name, password})
        .select('*')
      
      if (response.length === 0) return []

      return response.map((user: IUser): IUser => {
        const {
            created_at,
            updated_at,
        } = user
        return {
            ...user,
            created_at: new Date(created_at).toISOString(),
            updated_at: new Date(updated_at).toISOString(),
        }
      })
    } catch (error) {
      const {
          // eslint-disable-next-line no-shadow
          code,
          detail,
      } = error
      switch (code) {
          case NO_DATA_FOUND_ERROR_CODE:
              throw new DatabaseError({
                  code: 'NoDataFoundError',
                  message: detail,
                  details: error,
              })
          default:
              throw new DatabaseError({
                  code: 'SomethingWentWrongError',
                  message: detail,
                  details: error,
              })
      }
    }
  }

  async truncate(): Promise<void> {
    await this.knex.raw(`truncate ${USERS_TABLE} cascade;`)
}
}