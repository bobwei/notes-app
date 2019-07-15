import { StyleSheet, Platform } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  list: {
    flex: 1,
    alignSelf: 'stretch',
  },
  listContentContainer: {
    padding: 8,
  },
  button: {
    justifyContent: 'center',
    height: 80,
    paddingBottom: 10,
    ...Platform.select({
      ios: {
        width: '100%',
        borderTopWidth: 1,
        borderTopColor: '#ddd',
      },
      android: {},
    }),
  },
});

export default styles;
