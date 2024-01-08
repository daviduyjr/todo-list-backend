import config from 'config'
import { StatusCodes } from 'http-status-codes'
import type {
  Request, Response, NextFunction
} from 'express'
import container from '@src/index'
import Types from '@src/types'
import type { IJwtService } from '@src/services/jwt/interface'

const JWT_SECRET: string = config.get('app.jwtSecret');

export default async function login(req: Request, res: Response, next: NextFunction) {
  const jwtService: IJwtService = container.get(Types.JwtService);
  const token: string = req.headers['authorization']!;
  try {
    const payload = jwtService.verify({
      hash: token,
      key: JWT_SECRET
    })

    next()
  } catch (error) {
    const {
      code, message, details,
  } = error
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: 'failed',
      error: {
          code,
          message,
          details,
      },
  })
  }
}