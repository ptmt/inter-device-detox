/* @flow */

import React from 'react';

import {
  GiftedChat,
  Composer,
  Day,
  MessageText,
} from 'react-native-gifted-chat-flat';
import { View, StyleSheet, Platform } from 'react-native';

import SendButton from './SendButton';
import Ticks from './Ticks';
import TypingIndicator from './TypingIndicator';
import styles from './ChatStyles';

type Message = any;

type MessageWrappersProps = {
  position: 'left' | 'right',
  previousMessage: Message,
  currentMessage: Message,
  nextMessage: Message,
  onSend: mixed,
};

export default class Chat extends React.Component<{
  messages: Array<Message>,
  user: any,
}> {
  chat = GiftedChat;

  renderFooter = () => {
    if (this.props.isTyping) {
      return <TypingIndicator />;
    }
    return null;
  };

  onSend = (messages: Array<any> = []) => this.props.onSend(messages[0]);

  onInputTextChanged = (e: string) => {
    if (e && e.length > 0) {
      this.props.reportAboutTyping();
    }
  };

  renderTicks = (currentMessage: any) => (
    <Ticks currentMessage={currentMessage} user={this.props.user} />
  );

  renderComposer = (props: MessageWrappersProps) => (
    <Composer
      {...props}
      textInputStyle={styles.composer}
      placeholder={'Type message here'}
    />
  );

  renderSend = (props: MessageWrappersProps) => <SendButton {...props} />;

  render() {
    return (
      <View style={[StyleSheet.absoluteFill, { backgroundColor: '#f9f9f9' }]}>
        <GiftedChat
          ref={r => (this.chat = r)}
          inputContainerStyle={styles.inputContainerStyle}
          maxComposerHeight={300}
          additionalHeight={7}
          keyboardVerticalOffset={Platform.OS === 'ios' ? undefined : 80}
          primaryStyle={styles.primaryStyle}
          isAnimated={true}
          messages={this.props.messages}
          onSend={this.onSend}
          renderComposer={this.renderComposer}
          renderTicks={this.renderTicks}
          renderSend={this.renderSend}
          onInputTextChanged={this.onInputTextChanged}
          renderChatFooter={this.renderFooter}
          user={this.props.user}
        />
      </View>
    );
  }
}
