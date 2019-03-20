import React, { Component } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  AsyncStorage
} from "react-native";
import { Icon, Overlay } from "react-native-elements";
import styles from "../styles/SettingsScreen.style";
import EventPopup from "./SettingsPopups/EventPopup";
import DeletePopup from "./SettingsPopups/DeletePopup";
import OfflineNotice from "../util/OfflineNotice";
import Toast from "react-native-easy-toast";
import { connect } from "react-redux";
import "babel-polyfill";
import firebase from "firebase";
import OtherDialog from "./SettingsPopups/OtherDialog";

var config = {
  databaseURL: "https://theory-scout.firebaseio.com",
  projectId: "theory-scout"
};

if (!firebase.apps.length) {
  firebase.initializeApp(config);
}

class SettingsScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      event_name: this.props.events.selected_event.name,
      event_dialog: false,
      delete_dialog: false,
      user_dialog: {
        action: 0,
        visible: false,
        text: "Oops",
        title: "Not Working"
      },
      selected_event: this.props.events.selected_event,
      isConnected: true,
      leftRed: true
    };
  }

  _eventDialogPressed() {
    if (!this.state.isConnected) {
      this.refs.toast.show("Connect to the internet");
      return;
    }
    this.props.updateEvents().then(() => {
      console.log("Show popup");
      this.setState({ event_dialog: true });
    });
  }

  _eventDialogConfirmed = data => {
    if (data.selected_event == null) {
      this.refs.toast.show("Please select an event");
      return;
    }

    this.setState({
      event_name: data.searchTerm,
      selected_event: data.selected_event,
      event_dialog: false
    });
    this.props.updateCurrentEvent(data.selected_event.key, data.searchTerm);
    this.props.updateTeams(data.selected_event.key);
    this.props.updateMatches(data.selected_event.key);
  };

  _deleteDialogConfirmed = () => {
    this.setState({
      delete_dialog: false
    });
    this.props.deleteMatches();
  };

  _userDialogPressed(title, text, action) {
    this.setState({ user_dialog: { visible: true, title, text, action } });
  }

  _userDialogConfirmed = data => {
    //console.log(JSON.stringify(this.props.teams));
    if (this.state.selected_event != null && data.action == 1) {
      if (this.props.events.selected_event.key != null) {
        firebase
          .database()
          .ref(this.props.events.selected_event.key)
          .update(this.props.teams)
          .then(data => {
            //success callback
            console.log("Push complete");
          })
          .catch(error => {
            //error callback
            console.log("Error occured when pushing ", error);
          });
      }
    } else if (this.state.selected_event != null && data.action == 0) {
      if (this.props.events.selected_event.key != null) {
        props = this.props
        firebase.database().ref(props.events.selected_event.key).once('value', function (snapshot) {
          //console.log(JSON.stringify(snapshot.val()))
          if(snapshot.val() != null){
            props.loadTeams(snapshot.val())
          }
        });
      }
    } 

    this.setState({
      user_dialog: { ...this.state.user_dialog, visible: false }
    });
  };

  orientationSettingChanged(state) {
    this.setState({ leftRed: state });

    this.props.setOrientation(state);
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.header_text}>Settings</Text>
        </View>
        <OfflineNotice
          onConnectionChange={isConnected => this.setState({ isConnected })}
        />
        <View style={styles.settings_container}>
          <Text style={styles.heading_text}>Selected Event</Text>
          <TouchableOpacity
            style={styles.select_event_button}
            onPress={() => this._eventDialogPressed()}
          >
            <Text style={styles.event_text}>{this.state.event_name}</Text>
            <Icon name="md-calendar" type="ionicon" color="#e65c00" reverse />
          </TouchableOpacity>

          <Text style={styles.heading_text}>Delete Matches</Text>
          <TouchableOpacity
            style={styles.select_event_button}
            onPress={() => {
              this.setState({ delete_dialog: true });
            }}
          >
            <Text style={styles.event_text}>
              Click here to delete match data
            </Text>
            <Icon name="md-trash" type="ionicon" color="#e65c00" reverse />
          </TouchableOpacity>

          <Text style={styles.heading_text}>Pull from Database</Text>
          <TouchableOpacity
            style={styles.select_event_button}
            onPress={() => {
              this._userDialogPressed(
                "Pull Data",
                "Pulling data will overwrite everything locally, push first if you'd like to save",
                0
              );
            }}
          >
            <Text style={styles.event_text}>Click here to PULL data</Text>
            <Icon
              name="md-cloud-download"
              type="ionicon"
              color="#e65c00"
              reverse
            />
          </TouchableOpacity>

          <Text style={styles.heading_text}>Push to Database</Text>
          <TouchableOpacity
            style={styles.select_event_button}
            onPress={() => {
              this._userDialogPressed("Push Data", "Push data online", 1);
            }}
          >
            <Text style={styles.event_text}>Click here to PUSH data</Text>
            <Icon
              name="md-cloud-upload"
              type="ionicon"
              color="#e65c00"
              reverse
            />
          </TouchableOpacity>

          <EventPopup
            visible={this.state.event_dialog}
            cancelPressed={() => this.setState({ event_dialog: false })}
            okPressed={this._eventDialogConfirmed}
          />

          <DeletePopup
            visible={this.state.delete_dialog}
            cancelPressed={() => this.setState({ delete_dialog: false })}
            okPressed={this._deleteDialogConfirmed}
          />

          <OtherDialog
            action={this.state.user_dialog.action}
            title={this.state.user_dialog.title}
            text={this.state.user_dialog.text}
            visible={this.state.user_dialog.visible}
            cancelPressed={() =>
              this.setState({
                user_dialog: false
              })
            }
            okPressed={this._userDialogConfirmed}
          />
        </View>
        <Toast ref="toast" />
        <ActivityIndicator
          size="large"
          color="#292F6D"
          animating={this.props.events.fetching}
        />
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
export default connect(mapStateToProps)(SettingsScreen);
