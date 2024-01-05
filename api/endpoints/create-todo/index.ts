import config from 'config'
import { StatusCodes } from 'http-status-codes'
import type { IParameters } from '@features/create-todo/parameters'
import type { IResponse } from '@features/create-todo/response'
import type { IExecutable } from '@interfaces/executable'
import type {
    Request, Response,
} from 'express'
import container from '@src/index'
import Types from '@src/types'

// eslint-disable-next-line @typescript-eslint/naming-convention

export default async function createTodo(req: Request, res: Response): Promise<Response> {
    const createTodo: IExecutable<IParameters, IResponse> = container.get(Types.CreateTodo)
    const bodyParameters: IParameters = req.body
    try {
        const response = await createTodo.execute(bodyParameters)
        return res.status(StatusCodes.OK).json({
            status: 'success',
            data: response,
        })
    } catch (error) {
        console.log(error)
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
