/* eslint-disable no-magic-numbers */
import { Factory } from 'rosie'
import type { IUserDataSource } from '@src/interfaces/data-sources'
import type { IUser } from '@src/interfaces/models'
import container from '@src/index'
import Types from '@src/types'

describe('TodoService', (): void => {
  const userDataSource: IUserDataSource = container.get(Types.UserService)

  afterEach(async (): Promise<void> => {
    await userDataSource.truncate()
  })

  describe('#Get', (): void => {
    const mockUser1: IUser = Factory.build('user-1')
    const mockUser2: IUser = Factory.build('user-2')
    beforeEach(async (): Promise<void> => {
      await userDataSource.create(mockUser1)
      await userDataSource.create(mockUser2)
    })

    it('creates user', async (): Promise<void> => {
      await userDataSource.truncate()
      await userDataSource.create(mockUser1)
      await userDataSource.create(mockUser2)
    })
    it('gets data using user_name and password parameters in the database', async (): Promise<void> => {
      const params: Partial<IUser> = {
          user_name: mockUser1.user_name,
          password: mockUser1.password
      }
      const [response] = await userDataSource.get({
          ...params,
      })
      expect(response).toHaveProperty('user_name', mockUser1.user_name)
    })
  })
});