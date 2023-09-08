import { StatusCodes } from 'http-status-codes'
import 'module-alias/register'
import type {
    IHTTPResponse,
    IEvent,
} from '../interface'
import type { IParameters } from '@features/get-todo/parameters'
import type { IResponse } from '@features/get-todo/response'
import type { IExecutable } from '@interfaces/executable'
import container from '@src/index'
import Types from '@src/types'

export const handler = async (event: IEvent): Promise<IHTTPResponse> => {
    const getTodo: IExecutable<IParameters, IResponse> = container.get(Types.GetTodo)
    const {
        queryStringParameters,
    } = event
    try {
        const params: IParameters = queryStringParameters!
        const response = await getTodo.execute({
            ...params,
        })
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
