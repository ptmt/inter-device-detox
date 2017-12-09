/* @flow */
import React from 'react';
import { View, Animated, Easing } from 'react-native';
import styles from './ChatStyles';

export default class TypingIndicator extends React.Component<
  {},
  { progress: any }
> {
  state = {
    progress: new Animated.Value(0),
  };
  animation: number;
  componentDidMount() {
    this.iterate();
  }
  componentWillUnmount() {
    clearTimeout(this.animation);
  }
  iterate() {
    Animated.timing(this.state.progress, {
      toValue: 1,
      duration: 500,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start(() => {
      this.state.progress.setValue(0);
      this.animation = setTimeout(() => this.iterate(), 500);
    });
  }
  render() {
    return (
      <View style={styles.typingIndicator} testID="TypingIndicator">
        <Animated.View
          style={[
            styles.dot,
            {
              opacity: this.state.progress.interpolate({
                inputRange: [0, 0.25, 0.5, 1],
                outputRange: [1, 0.2, 1, 1],
              }),
            },
          ]}
        />
        <Animated.View
          style={[
            styles.dot,
            {
              opacity: this.state.progress.interpolate({
                inputRange: [0, 0.25, 0.5, 0.75, 1],
                outputRange: [1, 1, 0.2, 1, 1],
              }),
            },
          ]}
        />
        <Animated.View
          style={[
            styles.dot,
            {
              opacity: this.state.progress.interpolate({
                inputRange: [0, 0.5, 0.75, 1],
                outputRange: [1, 1, 0.2, 1],
              }),
            },
          ]}
        />
      </View>
    );
  }
}
