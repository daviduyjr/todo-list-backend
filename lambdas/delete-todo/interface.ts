export interface IPathParameters {
    id: string,
}
export interface IEvent {
    body?: string,
    pathParameters: IPathParameters,
}
