import { StyleSheet, Platform } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  list: {
    flex: 1,
  },
  button: {
    justifyContent: 'center',
    height: 80,
    paddingBottom: 10,
    ...Platform.select({
      ios: {
        borderTopWidth: 1,
        borderTopColor: '#ddd',
      },
    }),
  },
});

export default styles;
