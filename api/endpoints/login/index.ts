import config from 'config'
import { StatusCodes } from 'http-status-codes'
import type {
  Request, Response,
} from 'express'
import container from '@src/index'
import Types from '@src/types'
import type { IUserDataSource } from '@src/interfaces/data-sources'
import jwt from 'jsonwebtoken';
import type { IUser } from '@src/interfaces/models'

const JWT_SECRET: string = config.get('app.jwtSecret');

export default async function login(req: Request, res: Response): Promise<Response> {
  const userDataSource: IUserDataSource = container.get(Types.UserService)
  
  try {

    const [response]: IUser[] = await userDataSource.get({
      user_name: req.body.user_name,
      password: req.body.password,
    })
    if (response === undefined) {
      return res.status(StatusCodes.OK).json({
        status: 'failed',
        error: {
            code: 'LOGINFAILED',
            message: 'Incorrect username or password',
            details: 'Incorrect username or password',
        },
    })
    }
    const signedIdString = jwt.sign(response.id, JWT_SECRET);
    return res.status(StatusCodes.OK).json({
      status: 'success',
      data: {
        accessToken: signedIdString,
        ...response
      },
  })
  } catch (error) {
    const {
      code, message, details,
    } = error
    return res.status(StatusCodes.OK).json({
        status: 'failed',
        error: {
            code,
            message,
            details,
        },
    })
  }
}