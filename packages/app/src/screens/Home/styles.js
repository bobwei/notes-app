import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  button: {
    height: 100,
    justifyContent: 'center',
  },
  list: {
    flex: 1,
    alignSelf: 'stretch',
  },
  listContentContainer: {
    padding: 10,
  },
  note: {
    height: 60,
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignSelf: 'stretch',
    alignItems: 'center',
  },
});

export default styles;
