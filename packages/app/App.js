import { createStackNavigator, createAppContainer } from 'react-navigation';

const App = createAppContainer(
  createStackNavigator({
    Home: {
      screen: require('./src/screens/Home').default,
    },
    Note: {
      screen: require('./src/screens/Note').default,
    },
  }),
);

export default App;
