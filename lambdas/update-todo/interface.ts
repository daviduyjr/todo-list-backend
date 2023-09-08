export interface IPathParameters {
    id: string,
}
export interface IEvent {
    body: string,
    pathParameters: IPathParameters,
}

export interface IBodyParameters {
    name?: string,
    when_done?: string | null,
}
