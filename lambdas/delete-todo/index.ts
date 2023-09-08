import { StatusCodes } from 'http-status-codes'
import 'module-alias/register'
import type { IEvent } from './interface'
import type { IHTTPResponse } from '../interface'
import type { IParameters } from '@features/delete-todo/parameters'
import type { IResponse } from '@features/delete-todo/response'
import type { IExecutable } from '@interfaces/executable'
import container from '@src/index'
import Types from '@src/types'

export const handler = async (event: IEvent): Promise<IHTTPResponse> => {
    const deleteTodo: IExecutable<IParameters, IResponse> = container.get(Types.DeleteTodo)
    const {
        pathParameters,
    } = event
    try {
        const response = await deleteTodo.execute(pathParameters)
        return {
            statusCode: StatusCodes.OK,
            body: JSON.stringify({
                status: 'success',
                data: response,
            }),
        }
    } catch (error) {
        const {
            code,
            message,
            details,
        } = error
        return {
            statusCode: StatusCodes.OK,
            body: JSON.stringify({
                status: 'failed',
                error: {
                    code,
                    message,
                    details,
                },
            }),
        }
    }
}
export default handler
