import { Container } from 'inversify'
import 'reflect-metadata'
import featureContainer from './features'
import observerContainer from './observers'
import serviceContainer from './services'

const tempContainer = Container.merge(observerContainer, serviceContainer)
const appContainer = Container.merge(featureContainer, tempContainer)

export default appContainer
