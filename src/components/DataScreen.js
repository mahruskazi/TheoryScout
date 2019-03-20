import React, { Component } from "react";
import { View, Text } from "react-native";
import "babel-polyfill";
import firebase from "firebase";
import { connect } from "react-redux";

var config = {
  databaseURL: "https://theory-scout.firebaseio.com",
  projectId: "theory-scout"
};

class DataScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentWillReceiveProps(props) {
    console.log("UPDATED 3")
  }

  componentWillMount() {
    if (!firebase.apps.length) {
      firebase.initializeApp(config);
    }

    // if (this.props.events.selected_event.key != null) {
    //   firebase
    //     .database()
    //     .ref(this.props.events.selected_event.key)
    //     .set(this.props.teams)
    //     .then(data => {
    //       //success callback
    //       console.log("data ", data);
    //     })
    //     .catch(error => {
    //       //error callback
    //       console.log("error ", error);
    //     });
    // }
  }

  render() {
    return (
      <View>
        <Text> textInComponent </Text>
      </View>
    );
  }
}

function mapStateToProps(state) {
  return {
    events: state.events,
    teams: state.teams.teams
  };
}

//make this component available to the app
export default connect(mapStateToProps)(DataScreen);
