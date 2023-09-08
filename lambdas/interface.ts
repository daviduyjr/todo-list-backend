import type { IParameters } from '@src/features/get-todo/parameters'

export interface IHTTPResponse {
    statusCode: number,
    body: string,
}

export interface IPathParameters {
    id: string,
}

export interface IEvent {
    body?: string,
    queryStringParameters?: IParameters,
    pathParameters?: IPathParameters,
}
