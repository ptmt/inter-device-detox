/* @flow */
import React from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

class BlinkingIndicator extends React.Component<
  { style: any },
  { opacity: Animated.Value }
> {
  state = {
    opacity: new Animated.Value(1),
  };
  unmounted = false;
  componentWillUnmount() {
    // clearTimeout(this.timeout);
    this.unmounted = true;
  }
  componentWillMount() {
    this.blink(false);
  }
  blink(reverse = false) {
    if (this.unmounted) {
      return;
    }
    Animated.timing(this.state.opacity, {
      toValue: reverse ? 1 : 0.3,
      duration: 700,
      useNativeDriver: true,
    }).start(() => this.blink(!reverse));
  }
  render() {
    return (
      <Animated.View
        style={[this.props.style, { opacity: this.state.opacity }]}
      >
        <Icon
          name="query-builder"
          size={12}
          style={{ alignSelf: 'center' }}
          color="#90a5ae"
        />
      </Animated.View>
    );
  }
}

export default function MessageTicks({
  currentMessage,
  user,
}: {
  currentMessage?: { attributes: { sent: boolean, delivered: boolean } },
  user?: { _id: string },
}) {
  if (
    !currentMessage ||
    !currentMessage.user ||
    !user ||
    !currentMessage.attributes
  ) {
    return null;
  }
  if (currentMessage.user._id !== user._id) {
    return null;
  }
  if (currentMessage.attributes.sent && currentMessage.attributes.delivered) {
    return (
      <View style={styles.tickView}>
        <Icon
          name="done-all"
          size={12}
          style={{ marginTop: 0 }}
          color="#1ab7f3"
        />
      </View>
    );
  }
  if (currentMessage.attributes.sent && !currentMessage.attributes.delivered) {
    return (
      <View style={styles.tickView}>
        <Icon
          name="done"
          size={12}
          style={{ alignSelf: 'center' }}
          color="#1ab7f3"
        />
      </View>
    );
  }

  if (!currentMessage.attributes.sent && !currentMessage.attributes.delivered) {
    return <BlinkingIndicator style={styles.tickView} />;
  }
  return null;
}

const styles = StyleSheet.create({
  tickView: {
    flexDirection: 'row',
    marginRight: 0,
    marginTop: 0,
  },
});
