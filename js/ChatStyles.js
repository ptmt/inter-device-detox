/* @flow */

import { StyleSheet, Platform } from 'react-native';

export default StyleSheet.create({
  container: {},
  inputContainerStyle: {
    borderTopWidth: 0,
    alignItems: 'center',
  },
  primaryStyle: {
    backgroundColor: Platform.select({
      android: '#eceff0',
      ios: '#f9f9f9',
    }), // use search and replace
    borderWidth: 0,
    alignItems: 'center',
  },
  composer: {
    //borderRadius: 22,
    paddingHorizontal: 16,
    backgroundColor: Platform.select({
      android: '#fff',
      ios: 'rgba(250, 250, 250, 0.9)',
    }),
    borderStyle: 'solid',
    borderWidth: 1,
    marginLeft: 10,
    marginRight: 0,
    minHeight: 36,
    fontSize: 16,
    lineHeight: Platform.select({
      ios: 24,
      android: 24,
    }),
    borderColor: Platform.select({
      ios: '#c7d8de',
      android: '#f9f9f9',
    }),
    paddingVertical: 6,
  },
  typingIndicator: {
    margin: 12,
    backgroundColor: '#f7f7f7',
    width: 58,
    height: 30,
    borderRadius: 20,
    alignItems: 'center',
    marginLeft: 45,
    flexDirection: 'row',
    paddingLeft: 10,
    paddingRight: 10,
    justifyContent: 'space-between',
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#e0e0e0',
  },
});
