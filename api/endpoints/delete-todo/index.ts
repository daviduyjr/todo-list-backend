import config from 'config'
import { StatusCodes } from 'http-status-codes'
import type { IParameters } from '@features/delete-todo/parameters'
import type { IResponse } from '@features/delete-todo/response'
import type { IExecutable } from '@interfaces/executable'
import type {
    Request, Response,
} from 'express'
import container from '@src/index'
import Types from '@src/types'

// eslint-disable-next-line @typescript-eslint/naming-convention

export default async function deleteTodo(req: Request, res: Response): Promise<Response> {
    const deleteTodo: IExecutable<IParameters, IResponse> = container.get(Types.DeleteTodo)
    const { params } = req;
    try {
        const response = await deleteTodo.execute({
            id: params.id,
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
