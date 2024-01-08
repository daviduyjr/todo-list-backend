import config from 'config'
import app from '../api'

const PORT: number = config.get('app.port')

app.listen(PORT, (): void => {
    console.log(`Listening to port ${PORT}.`)
})
