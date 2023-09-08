import ObjectUtils from '.'

describe('ObjectUtils', (): void => {
    describe('#changeKeys', (): void => {
        const params = {
                firstName: 'First',
                lastName: 'Last',
                email: 'test@gmail.com',
            },
            transform = (key: string): any => key.toUpperCase()

        it('changes the keys to the result of the handler', (): void => {
            const res = ObjectUtils.changeKeys(params, transform),
                expectedKeys = Object.keys(params).map((key): any => transform(key)).join(''),
                keys = Object.keys(res).join('')
            expect(keys).toEqual(expectedKeys)
        })

        it('handles nested objects', (): void => {
            const newParams = {
                    ...params,
                    address: {
                        city: 'Makati',
                        street: 'Mayflower',
                    },
                },
                res: any = ObjectUtils.changeKeys(newParams, transform),
                expectedKeys = Object.keys(newParams.address).map((key): any => transform(key)).join(''),
                keys = Object.keys(res[transform('address')]).join('')
            expect(keys).toEqual(expectedKeys)
        })
    })
})
