/**
 * @flow
 */

import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import SocketIOClient from 'socket.io-client';

import Chat from './Chat';

type Socket = {
  on: (string, Function) => void,
  emit: (string, any) => void,
};
type Message = any;
type State = {
  messages: Array<Message>,
  user: any,
  isTyping: boolean,
};

export default class App extends Component<{}, State> {
  socket: Socket;
  constructor() {
    super();
    this.state = {
      messages: [],
      user: null,
      isTyping: false,
    };
    this.socket = SocketIOClient('http://localhost:3000');

    this.socket.on('init', user => {
      this.setState({ user });
    });

    this.socket.on('message:new', message => {
      this.setState(state => ({ messages: [message, ...state.messages] }));
    });
    this.socket.on('message:update', message => {
      if (message.user._id !== this.state.user.id) {
        this.socket.emit('message:update', {
          ...message,
          attributes: { ...message.attributes, delivered: true },
        });
      }
      this.setState(state => ({
        messages: state.messages.map(m => (m._id == message._id ? message : m)),
      }));
    });
    this.socket.on('typing', isTyping => {
      console.log('typing', isTyping);
      this.setState({ isTyping });
    });
  }

  onSend = (message: Message) => {
    const messageWithAttributes = { ...message, attributes: {} };
    // optimistic update
    this.setState(state => ({
      messages: [messageWithAttributes, ...state.messages],
    }));
    this.socket.emit('message:new', messageWithAttributes);
  };

  render() {
    return (
      <Chat
        messages={this.state.messages}
        user={this.state.user}
        onSend={this.onSend}
        isTyping={this.state.isTyping}
        reportAboutTyping={() => this.socket.emit('typing')}
      />
    );
  }
}
