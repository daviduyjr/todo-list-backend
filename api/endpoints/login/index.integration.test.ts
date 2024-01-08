import type { IUserDataSource } from '@interfaces/data-sources'
import type { IUser } from '@interfaces/models'
import type {
  Request, Response,
} from 'express'
import container from '@src/index'
import Types from '@src/types'
import login from '.'
import { Factory } from 'rosie'

describe('GetTodoEndpoint', (): void => {
  const userDataSource: IUserDataSource = container.get(Types.UserService)
  const mockUser1: IUser = Factory.build('user-1')
  const mockUser2: IUser = Factory.build('user-2')

  beforeEach(async (): Promise<void> => {
    await userDataSource.create(mockUser1)
    await userDataSource.create(mockUser2)
  })

  afterEach(async (): Promise<void> => {
    await userDataSource.truncate()
  })

  it('gets data using user_name and password parameters in the database', async (): Promise<void> => {
    const req: any = {
      body: {
        user_name: mockUser1.user_name,
        password: mockUser1.password
      },
    };

    let capturedData: any;

    const res: any = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn((data: any) => {
        capturedData = data;
        return res;
      }),
    };
    await login(req as Request, res as Response)
    expect(capturedData.data.user_name).toEqual(mockUser1.user_name)
    expect(capturedData.data).toHaveProperty('accessToken')
  })
})