import config from 'config'
import { StatusCodes } from 'http-status-codes'
import type { IParameters } from '@features/update-todo/parameters'
import type { IResponse } from '@features/update-todo/response'
import type { IExecutable } from '@interfaces/executable'
import type {
    Request, Response,
} from 'express'
import container from '@src/index'
import Types from '@src/types'

// eslint-disable-next-line @typescript-eslint/naming-convention

export default async function updateTodo(req: Request, res: Response): Promise<Response> {
    const updateTodo: IExecutable<IParameters, IResponse> = container.get(Types.UpdateTodo)
    const { params } = req;
    const bodyParms: Partial<IParameters> = req.body
    try {
        const response = await updateTodo.execute({
            id: params.id,
            ...bodyParms,
        })
        return res.status(StatusCodes.OK).json({
            status: 'success',
            data: response,
        })
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
