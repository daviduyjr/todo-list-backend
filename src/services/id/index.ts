import crypto from 'crypto'
import { injectable } from 'inversify'
import type { IIdService } from './interface'
import {
    ALGORITHM,
    SIZE,
    ENCODING,
} from '@constants/id'

@injectable()
export default class IdService implements IIdService {
    generate(): string {
        const randomBytes = crypto.randomBytes(SIZE).toString(ENCODING)
        const key = String(Date.now()).concat(randomBytes)
            .toString()
        return crypto.createHmac(ALGORITHM, key).digest(ENCODING)
    }
}
