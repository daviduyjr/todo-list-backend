export interface IVerifyParams {
    hash: string;
    key: string;
    config?: any;
}

export interface IJwtService {
    verify: (params: IVerifyParams) => object | string;
}
