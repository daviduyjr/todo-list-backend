import type { IIdService } from './interface'
import container from '@src/index'
import Types from '@src/types'

describe('IdService', (): void => {
    const idService: IIdService = container.get(Types.IdService)

    describe('#generate', (): void => {
        it('generates an id', (): void => {
            const generatedId = idService.generate()
            expect(generatedId).toBeTruthy()
        })
    })
})
