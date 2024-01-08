import { injectable } from 'inversify';
import jwt from 'jsonwebtoken';
import { IJwtService, IVerifyParams } from './interface';
import AppError from '../../utils/application-error';

@injectable()
export default class JwtService implements IJwtService {
    verify(params: IVerifyParams) {
        try {
            return jwt.verify(params.hash, params.key, params.config);
        } catch (err) {
            throw new AppError({
                code: err.name,
                message: err.message,
            });
        }
    }
}
