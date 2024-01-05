import config from 'config'
import { StatusCodes } from 'http-status-codes'
import type { IParameters } from '@features/get-todo/parameters'
import type { IResponse } from '@features/get-todo/response'
import type { IExecutable } from '@interfaces/executable'
import type {
    Request, Response,
} from 'express'
import container from '@src/index'
import Types from '@src/types'

// eslint-disable-next-line @typescript-eslint/naming-convention

export default async function getTodos(req: Request, res: Response): Promise<Response> {
    const getTodos: IExecutable<IParameters, IResponse> = container.get(Types.GetTodo)

    try {
        const params: IParameters = req.query;
        const response = await getTodos.execute({
            ...params,
        })

        return res.status(StatusCodes.OK).json({
            status: 'success',
            data: response,
        })
    } catch (error) {
        // console.log(error)
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
