import { StatusCodes } from 'http-status-codes'
import 'module-alias/register'
import type {
    IHTTPResponse,
    IEvent,
} from '../interface'
import type { IParameters } from '@features/create-todo/parameters'
import type { IResponse } from '@features/create-todo/response'
import type { IExecutable } from '@interfaces/executable'
import container from '@src/index'
import Types from '@src/types'

export const handler = async (event: IEvent): Promise<IHTTPResponse> => {
    const createTodo: IExecutable<IParameters, IResponse> = container.get(Types.CreateTodo)
    const {
        body,
    } = event
    const bodyParameters: IParameters = JSON.parse(body!)
    try {
        const response = await createTodo.execute(bodyParameters)
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
