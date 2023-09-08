import type { IOptions } from '@src/features/interface'

export interface IExecutable<IParameters, IResponse> {
    execute: (parameters: IParameters, options?: IOptions) => IResponse,
}
