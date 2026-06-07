import { registerRootComponent } from 'expo';
import App from './App';

// registerRootComponent calls AppRegistry.registerComponent('main', () => App)
// Garantiza que el entorno esté configurado correctamente tanto en Expo Go como en builds nativos
registerRootComponent(App);
