/* @flow */
import React from 'react';
import { StyleSheet, View, Text, Button, Platform } from 'react-native';
import { default as TouchableNativeFeedback } from '@expo/react-native-touchable-native-feedback-safe';

export default class SendButton extends React.Component {
  props: {
    text: string,
    onSend: Function,
  };
  onSend = () => this.props.onSend({ text: this.props.text.trim() }, true);
  render() {
    const isEnabled = this.props.text && this.props.text.length > 0;
    return (
      <View style={styles.container}>
        <Button title="Send" onPress={this.onSend} testID="SendButton" />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: Platform.select({
    android: {
      height: 44,
      marginBottom: 12,
      paddingHorizontal: 6,
      justifyContent: 'flex-end',
    },
    ios: {
      paddingHorizontal: 6,
      justifyContent: 'center',
    },
  }),
});
