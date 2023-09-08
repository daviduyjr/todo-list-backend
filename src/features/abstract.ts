import { injectable } from 'inversify'
import { Schema } from 'joi'
import type {
    IValidationError,
    IOptions,
} from './interface'
import type { IExecutable } from '@interfaces/executable'
import type {
    ValidationResult,
    ValidationErrorItem,
} from 'joi'
import SystemError from '@utils/system-error'

@injectable()
export default abstract class AbstractFeature<IParameters, IResponse> implements IExecutable<IParameters, IResponse> {
    protected schema: Schema

    constructor(schema: Schema) {
        this.schema = schema
    }

    protected sanitize(parameters: IParameters): IParameters {
        return parameters
    }

    protected validate(parameters: IParameters): void {
        const errors = AbstractFeature.joiValidate(parameters, this.schema)
        if (errors.length) throw new SystemError({
            code: 'ValidationError',
            message: 'Validation error',
            details: errors,
        })
    }

    static joiValidate(parameters: unknown, schema: Schema): IValidationError[] {
        const validationResult: ValidationResult = schema.validate(parameters, {
            abortEarly: false,
        })
        return validationResult.error
            ? validationResult.error.details.map((detail: ValidationErrorItem): IValidationError => {
                return {
                    message: detail.message,
                    key: detail.context?.key,
                }
            })
            : []
    }

    protected abstract process(parameters: IParameters, options?: IOptions): IResponse

    public execute(parameters: IParameters, options?: IOptions): IResponse {
        this.validate(parameters)
        const sanitizedParameters = this.sanitize(parameters)
        return this.process(sanitizedParameters, options)
    }
}
