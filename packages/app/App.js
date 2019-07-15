import { createStackNavigator, createAppContainer } from 'react-navigation';

const App = createAppContainer(
  createStackNavigator({
    Note: {
      screen: require('./src/screens/Note').default,
    },
  }),
);

export default App;
