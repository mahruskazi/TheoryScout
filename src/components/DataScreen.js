import React, { Component } from "react";
import { View, Text } from "react-native";
import 'babel-polyfill';
import firebase from "firebase";

var config = {
  databaseURL: "https://theory-scout.firebaseio.com",
  projectId: "theory-scout"
}

export default class DataScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentWillMount() {
    firebase.initializeApp(config);
  }

  render() {
    return (
      <View>
        <Text> textInComponent </Text>
      </View>
    );
  }
}
