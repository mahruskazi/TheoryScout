import React, { Component } from "react";

import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import QRCodeScanner from "react-native-qrcode-scanner";
import { connect } from "react-redux";
import AlertAsync from "react-native-alert-async";
import { extractMatchData } from "../util/DataParser";

class QrCodeReader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: "SCAN",
      focusedScreen: false
    };
  }

  async onSuccess(e) {
    if (e.data.length < 10) {
      console.log("NO GOOD");
      this.scanner.reactivate();
      this.setState({ text: "bad" });
    } else {
      console.log(e.data);
      obj = eval("(" + e.data + ")");
      await this.parseData(obj);
      this.setState({ text: "Good - RESCAN" });
    }
  }

  async parseData(data) {
    d = extractMatchData(data)
    console.log("HELP: " + JSON.stringify(d))
    match_number = data.mn;
    team_number = parseInt(data.tn);
    console.log("Adding Match: " + match_number + " with Team: " + team_number);

    matches = this.props.matches;
    contains = false;

    var contains = matches.some(function(match) {
      return match.mn == match_number && parseInt(match.tn) == team_number;
    });

    if (contains) {
      console.log("Match already exists, checking if user wants to overwrite");
      const choice = await AlertAsync(
        "Overwrite Data?",
        "This match is already scanned, would you like to overwrite?",
        [
          { text: "Yes", onPress: () => "yes" },
          { text: "Cancel", onPress: () => Promise.resolve("cancel") }
        ],
        {
          cancelable: true,
          onDismiss: () => "cancel"
        }
      );

      console.log("User selected: " + choice);
      if (choice == "yes") {
        var index = 0;
        var i = 0;
        for (i = 0; i < matches.length; i++) {
          if (
            matches[i].mn == match_number &&
            parseInt(matches[i].tn) == team_number
          ) {
            index = i;
            break;
          }
        }
        matches[index] = data;
        console.log("Replaced match at index: " + index);
      }
    } else {
      matches.push(data);
      console.log("Match Added");
    }

    this.props.updateMatches(matches);
  }

  rescanButtonPress() {
    this.scanner.reactivate();
    this.setState({ text: "SCAN" });
  }

  componentDidMount() {
    const { navigation } = this.props;
    navigation.addListener('willFocus', () =>
      this.setState({ focusedScreen: true })
    );
    navigation.addListener('willBlur', () =>
      this.setState({ focusedScreen: false })
    );
  }

  cameraView() {
    if(this.state.focusedScreen){
      console.log("Rendering Camera")
      return (
        <QRCodeScanner
          ref={node => {
            this.scanner = node;
          }}
          onRead={this.onSuccess.bind(this)}
          vibrate={false}
          topContent={
            <Text style={styles.centerText}>
              Scan QR Code to read and load match data
            </Text>
          }
          bottomContent={
            <TouchableOpacity
              style={styles.buttonTouchable}
              onPress={() => this.rescanButtonPress()}
            >
              <Text style={styles.buttonText}>{this.state.text}</Text>
            </TouchableOpacity>
          }
          showMarker={true}
          captureAudio={false}
        />
      );
    } else {
      console.log("Waiting for camera")
      return <View/>
    }
  }

  render() {
    return (
      <View style={{flex: 1}}>
        {this.cameraView()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  centerText: {
    flex: 1,
    fontSize: 18,
    padding: 32,
    color: "#777"
  },
  textBold: {
    fontWeight: "500",
    color: "#000"
  },
  buttonText: {
    fontSize: 21,
    color: "rgb(0,122,255)"
  },
  buttonTouchable: {
    padding: 16
  }
});

function mapStateToProps(state) {
  return {
    matches: state.matches.matches
  };
}

//make this component available to the app
export default connect(mapStateToProps)(QrCodeReader);
