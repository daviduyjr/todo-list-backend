import { StatusCodes } from 'http-status-codes'
import 'module-alias/register'
import type {
    IEvent, IBodyParameters,
} from './interface'
import type { IHTTPResponse } from '../interface'
import type { IParameters } from '@features/update-todo/parameters'
import type { IResponse } from '@features/update-todo/response'
import type { IExecutable } from '@interfaces/executable'
import container from '@src/index'
import Types from '@src/types'

export const handler = async (event: IEvent): Promise<IHTTPResponse> => {
    const updateTodo: IExecutable<IParameters, IResponse> = container.get(Types.UpdateTodo)
    const {
        body,
        pathParameters,
    } = event
    const bodyParameters: IBodyParameters = JSON.parse(body)
    const {
        ...rest
    } = bodyParameters
    try {
        const response = await updateTodo.execute({
            id: pathParameters.id,
            ...rest,
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
