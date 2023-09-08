export default class ObjectUtils {
    static changeKeys(parameters: any, transform: (key: any) => string): any {
        const newParams: any = {}
        Object.keys(parameters).forEach((key: keyof typeof parameters) => {
            const newKey = transform(key)
            let value = parameters[key]
            if (typeof value === 'object' && value) {
                if (value instanceof Array) value = value.map((v: any) => {
                    if (typeof v === 'object') return this.changeKeys(v, transform)
                    return v
                })

                if (Object.getPrototypeOf(value) === Object.prototype) value = this.changeKeys(value, transform)
            }
            newParams[newKey] = value
        })
        return newParams
    }
}
