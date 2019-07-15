import { StyleSheet, Platform } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  toolbar: {
    width: '100%',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  button: {
    justifyContent: 'center',
    alignSelf: 'center',
    height: 80,
    width: 100,
    ...Platform.select({
      ios: {
        paddingBottom: 10,
      },
      android: {},
    }),
  },
});

export default styles;
