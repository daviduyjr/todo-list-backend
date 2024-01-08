import type { IDataSource } from './interface'
import type { IUser } from '@src/interfaces/models'

export interface IUserDataSource extends IDataSource {
  create: (parameters: Partial<IUser>) => Promise<IUser>,
  get: (parameters: Partial<IUser>) => Promise<IUser[]>,
}
