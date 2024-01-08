import cron from 'node-cron'
import type { IParameters } from '@features/create-session/parameters'
import type { IResponse } from '@features/create-session/response'
import type { IShopDataSource } from '@interfaces/data-sources'
import type { IExecutable } from '@interfaces/executable'
import container from '@src/index'
import Types from '@src/types'

const createSessionScript = async (): Promise<void> => {
    const shopDataSource: IShopDataSource = container.get(Types.ShopDataSource)
    const createSession: IExecutable<IParameters, IResponse> = container.get(Types.CreateSession)
    console.log('Create session script started.')
    try {
        const shops = await shopDataSource.get()
        while (shops.length !== Number('0')) {
            const shop = shops.pop()!
            createSession.execute({
                shop_id: shop.id,
            })
        }
        console.log('Create session script finished.')
        console.log('Create session script successful.')
        return Promise.resolve()
    } catch (error) {
        console.log('Create session script finished.')
        console.log('Create session script failed:', error)
        return Promise.reject(error)
    }
}

createSessionScript()

cron.schedule('*/30 * * * *', createSessionScript, {
    scheduled: true,
    timezone: 'Asia/Singapore',
})
