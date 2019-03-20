import React, { Component } from "react";
import { View, Text, ScrollView } from "react-native";
import styles from "../styles/MatchesScreen.style";
import { connect } from "react-redux";
import Accordion from "react-native-collapsible/Accordion";
import { Icon } from "react-native-elements";
import constants from "../constants/DataInputConstants";

class MatchesScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeSections: [],
      matches: this.props.matches
    };
  }

  componentWillReceiveProps(props) {
    this.setState({matches: props.matches})
  }

  _renderHeader = section => {
    return (
      <View style={styles.section}>
        <Text style={styles.match_number}>Match Number: {section.mn}</Text>
        <Text>Team: {section.tn}</Text>
        <Text>Scout: {section.sn}</Text>
        <View style={styles.qr_container}>
          <Icon
            iconStyle={styles.qr_icon}
            name="md-qr-scanner"
            type="ionicon"
            color="black"
            onPress={() => this.props.navigation.navigate('QrScreen', { data: section })}
          />
        </View>
      </View>
    );
  };

  _renderContent = section => {
    auto_stats = this.getScoreStats(section.a);
    tele_stats = this.getScoreStats(section.t);
    return (
      <View style={styles.content}>
        <Text>Starting Position: {this.getStartingPosition(section.sp)}</Text>
        <Text>Starting Level: {this.getStartingLevel(section.sl)}</Text>
        <Text style={{ fontWeight: "bold" }}>Auto</Text>
        <Text>Hab Success: {String(section.a.hs == 0)}</Text>
        <Text>Cargo Ship Hatch (S/M): {this.getCSHatchStats(auto_stats)}</Text>
        <Text>Cargo Ship Cargo (S/M): {this.getCSCargoStats(auto_stats)}</Text>
        <Text>Right Rocket Hatch Scored (L/M/H): {this.getRRHatchStats(auto_stats)}</Text>
        <Text>Right Rocket Cargo Scored (L/M/H): {this.getRRCargoStats(auto_stats)}</Text>
        <Text>Left Rocket Hatch Scored (L/M/H): {this.getLRHatchStats(auto_stats)}</Text>
        <Text>Left Rocket Cargo Scored (L/M/H): {this.getLRCargoStats(auto_stats)}</Text>
        <Text style={{ fontWeight: "bold" }}>Tele</Text>
        <Text>Cargo Ship Hatch (S/M): {this.getCSHatchStats(tele_stats)}</Text>
        <Text>Cargo Ship Cargo (S/M): {this.getCSCargoStats(tele_stats)}</Text>
        <Text>Right Rocket Hatch Scored (L/M/H): {this.getRRHatchStats(tele_stats)}</Text>
        <Text>Right Rocket Cargo Scored (L/M/H): {this.getRRCargoStats(tele_stats)}</Text>
        <Text>Left Rocket Hatch Scored (L/M/H): {this.getLRHatchStats(tele_stats)}</Text>
        <Text>Left Rocket Cargo Scored (L/M/H): {this.getLRCargoStats(tele_stats)}</Text>
        <Text style={{ fontWeight: "bold" }}>End Game</Text>
        <Text>Level order: {JSON.stringify(section.e.l)}</Text>
        <Text>Comments: {section.e.c}</Text>
      </View>
    );
  };

  getCSHatchStats(output){
    return output.cargo_ship.hatch_scored + "/" + output.cargo_ship.hatch_missed
  }

  getCSCargoStats(output){
    return output.cargo_ship.cargo_scored + "/" + output.cargo_ship.cargo_missed
  }

  getRRHatchStats(output){
    return output.right_rocket.hatch_scored.low + "/" + output.right_rocket.hatch_scored.mid + "/" + output.right_rocket.hatch_scored.high
  }

  getRRCargoStats(output){
    return output.right_rocket.cargo_scored.low + "/" + output.right_rocket.cargo_scored.mid + "/" + output.right_rocket.cargo_scored.high
  }

  getLRHatchStats(output){
    return output.left_rocket.hatch_scored.low + "/" + output.left_rocket.hatch_scored.mid + "/" + output.left_rocket.hatch_scored.high
  }

  getLRCargoStats(output){
    return output.left_rocket.cargo_scored.low + "/" + output.left_rocket.cargo_scored.mid + "/" + output.left_rocket.cargo_scored.high
  }

  getScoreStats(array) {
    output = {
      cargo_ship: {
        hatch_scored: 0,
        hatch_missed: 0,
        cargo_scored: 0,
        cargo_missed: 0
      },
      right_rocket: {
        hatch_scored: {
          high: 0,
          mid: 0,
          low: 0
        },
        hatch_missed: {
          high: 0,
          mid: 0,
          low: 0
        },
        cargo_scored: {
          high: 0,
          mid: 0,
          low: 0
        },
        cargo_missed: {
          high: 0,
          mid: 0,
          low: 0
        }
      },
      left_rocket: {
        hatch_scored: {
          high: 0,
          mid: 0,
          low: 0
        },
        hatch_missed: {
          high: 0,
          mid: 0,
          low: 0
        },
        cargo_scored: {
          high: 0,
          mid: 0,
          low: 0
        },
        cargo_missed: {
          high: 0,
          mid: 0,
          low: 0
        }
      }
    };
    if(array == undefined || array.a == undefined) {
      return output;
    }
    array.a.map(event => {
      if (event.l == constants.locations.CARGO_SHIP) {
        switch (event.a) {
          case constants.actions.SHIP_SCORE_HATCH:
            output.cargo_ship.hatch_scored++;
            break;
          case constants.actions.SHIP_MISSED_HATCH:
            output.cargo_ship.hatch_missed++;
            break;
          case constants.actions.SHIP_SCORE_CARGO:
            output.cargo_ship.cargo_scored++;
            break;
          case constants.actions.SHIP_MISSED_CARGO:
            output.cargo_ship.cargo_missed++;
            break;
        }
      } else if (event.l == constants.locations.RIGHT_ROCKET) {
        switch (event.a) {
          case constants.actions.ROCKET_SCORE_HATCH_HIGH:
            output.right_rocket.hatch_scored.high++;
            break;
          case constants.actions.ROCKET_SCORE_HATCH_MID:
            output.right_rocket.hatch_scored.mid++;
            break;
          case constants.actions.ROCKET_SCORE_HATCH_LOW:
            output.right_rocket.hatch_scored.low++;
            break;
          case constants.actions.ROCKET_SCORE_CARGO_HIGH:
            output.right_rocket.cargo_scored.high++;
            break;
          case constants.actions.ROCKET_SCORE_CARGO_MID:
            output.right_rocket.cargo_scored.mid++;
            break;
          case constants.actions.ROCKET_SCORE_CARGO_LOW:
            output.right_rocket.cargo_scored.low++;
            break;
          case constants.actions.ROCKET_MISSED_HATCH_HIGH:
            output.right_rocket.hatch_missed.high++;
            break;
          case constants.actions.ROCKET_MISSED_HATCH_MID:
            output.right_rocket.hatch_missed.mid++;
            break;
          case constants.actions.ROCKET_MISSED_HATCH_LOW:
            output.right_rocket.hatch_missed.low++;
            break;
          case constants.actions.ROCKET_MISSED_CARGO_HIGH:
            output.right_rocket.cargo_missed.high++;
            break;
          case constants.actions.ROCKET_MISSED_CARGO_MID:
            output.right_rocket.cargo_missed.mid++;
            break;
          case constants.actions.ROCKET_MISSED_CARGO_LOW:
            output.right_rocket.cargo_missed.low++;
            break;
        }
      } else if (event.l == constants.locations.LEFT_ROCKET) {
        switch (event.a) {
          case constants.actions.ROCKET_SCORE_HATCH_HIGH:
            output.left_rocket.hatch_scored.high++;
            break;
          case constants.actions.ROCKET_SCORE_HATCH_MID:
            output.left_rocket.hatch_scored.mid++;
            break;
          case constants.actions.ROCKET_SCORE_HATCH_LOW:
            output.left_rocket.hatch_scored.low++;
            break;
          case constants.actions.ROCKET_SCORE_CARGO_HIGH:
            output.left_rocket.cargo_scored.high++;
            break;
          case constants.actions.ROCKET_SCORE_CARGO_MID:
            output.left_rocket.cargo_scored.mid++;
            break;
          case constants.actions.ROCKET_SCORE_CARGO_LOW:
            output.left_rocket.cargo_scored.low++;
            break;
          case constants.actions.ROCKET_MISSED_HATCH_HIGH:
            output.left_rocket.hatch_missed.high++;
            break;
          case constants.actions.ROCKET_MISSED_HATCH_MID:
            output.left_rocket.hatch_missed.mid++;
            break;
          case constants.actions.ROCKET_MISSED_HATCH_LOW:
            output.left_rocket.hatch_missed.low++;
            break;
          case constants.actions.ROCKET_MISSED_CARGO_HIGH:
            output.left_rocket.cargo_missed.high++;
            break;
          case constants.actions.ROCKET_MISSED_CARGO_MID:
            output.left_rocket.cargo_missed.mid++;
            break;
          case constants.actions.ROCKET_MISSED_CARGO_LOW:
            output.left_rocket.cargo_missed.low++;
            break;
        }
      }
    });

    return output
  }

  getStartingPosition(index) {
    switch (index) {
      case 0:
        return "Left";
      case 1:
        return "Center";
      case 2:
        return "Right";
    }
  }

  getStartingLevel(index) {
    switch (index) {
      case 0:
        return "Level 1";
      case 1:
        return "Level 2";
    }
  }

  _updateSections = activeSections => {
    this.setState({ activeSections });
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.header_text}>Matches Screen</Text>
          <View style={styles.qr_container}>
            <Icon
              iconStyle={styles.qr_icon}
              name="md-qr-scanner"
              type="ionicon"
              color="white"
              onPress={() => this.props.navigation.navigate('QrScanner')}
            />
          </View>
        </View>
        <ScrollView style={{flex: 1}}>
          <Accordion
            sections={this.state.matches}
            activeSections={this.state.activeSections}
            renderHeader={this._renderHeader}
            renderContent={this._renderContent}
            onChange={this._updateSections}
            underlayColor="#cce0ff"
          />
        </ScrollView>
      </View>
    );
  }
}

function mapStateToProps(state) {
  return {
    matches: state.matches.matches
  };
}

//make this component available to the app
export default connect(mapStateToProps)(MatchesScreen);
