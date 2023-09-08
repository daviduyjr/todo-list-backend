import config from 'config'
import { StatusCodes } from 'http-status-codes'
import type { Response } from 'express'

// eslint-disable-next-line @typescript-eslint/naming-convention
const GREETING_RESPONSE = config.get('app.greeting_response')

export default function getHealth(res: Response): Response {
    return res.status(StatusCodes.OK).send({
        status: 'success',
        data: GREETING_RESPONSE,
    })
}
