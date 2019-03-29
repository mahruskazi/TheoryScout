import React, { Component } from "react";
import { View, Text, TextInput, ScrollView } from "react-native";
import styles from "../styles/TeamComare.style";
import DataTable from "./DataTable";
import { Table, Row, Rows } from "react-native-table-component";
import { Icon } from "react-native-elements";
import { connect } from "react-redux";
import {
  getQualificationMatches,
  getTeamKeysForMatch,
  getComparisonData
} from "../util/DataParser";

class TeamCompare extends Component {
  constructor(props) {
    super(props);
    red_alliance = getTeamKeysForMatch(this.props.event.matches, 1, "red");
    blue_alliance = getTeamKeysForMatch(this.props.event.matches, 1, "blue");
    this.state = {
      team_keys: red_alliance.concat(blue_alliance),
      tableData: [["1/1", "2/3", "3/3", "N/A", "0/0", "10/10"]],
      match_number: 1
    };
  }

  _renderTables() {
    if (this.state.team_keys.length > 0) {
        data = getComparisonData(this.props.teams, this.state.team_keys)
      return (
        <View>
          <Text style={styles.mode_header}>AUTONOMOUS</Text>

          <Text style={styles.item_text}>Level 1 S/A</Text>
          <Table
            borderStyle={{ borderWidth: 2, borderColor: "#c8e1ff" }}
            style={{ margin: 5 }}
          >
            <Row
              data={this.state.team_keys}
              style={styles.head}
              textStyle={styles.text}
            />
            <Rows data={[data.auto.level_1]} textStyle={styles.text} />
          </Table>

          <Text style={styles.item_text}>Level 2 S/A</Text>
          <Table
            borderStyle={{ borderWidth: 2, borderColor: "#c8e1ff" }}
            style={{ margin: 5 }}
          >
            <Row
              data={this.state.team_keys}
              style={styles.head}
              textStyle={styles.text}
            />
            <Rows data={[data.auto.level_2]} textStyle={styles.text} />
          </Table>

          <Text style={styles.item_text}>Hatch - Cargoship Average</Text>
          <Table
            borderStyle={{ borderWidth: 2, borderColor: "#c8e1ff" }}
            style={{ margin: 5 }}
          >
            <Row
              data={this.state.team_keys}
              style={styles.head}
              textStyle={styles.text}
            />
            <Rows data={[data.auto.cargo_ship.hatch_average]} textStyle={styles.text} />
          </Table>

          <Text style={styles.item_text}>Cargo - Cargoship Average</Text>
          <Table
            borderStyle={{ borderWidth: 2, borderColor: "#c8e1ff" }}
            style={{ margin: 5 }}
          >
            <Row
              data={this.state.team_keys}
              style={styles.head}
              textStyle={styles.text}
            />
            <Rows data={[data.auto.cargo_ship.cargo_average]} textStyle={styles.text} />
          </Table>

          <Text style={styles.item_text}>
            Hatch - Rocketship Average (L/M/H)
          </Text>
          <Table
            borderStyle={{ borderWidth: 2, borderColor: "#c8e1ff" }}
            style={{ margin: 5 }}
          >
            <Row
              data={this.state.team_keys}
              style={styles.head}
              textStyle={styles.text}
            />
            <Rows data={[data.auto.rocket_ship.hatch_average]} textStyle={styles.text} />
          </Table>

          <Text style={styles.item_text}>
            Cargo - Rocketship Average (L/M/H)
          </Text>
          <Table
            borderStyle={{ borderWidth: 2, borderColor: "#c8e1ff" }}
            style={{ margin: 5 }}
          >
            <Row
              data={this.state.team_keys}
              style={styles.head}
              textStyle={styles.text}
            />
            <Rows data={[data.auto.rocket_ship.cargo_average]} textStyle={styles.text} />
          </Table>


          <Text style={styles.mode_header}>TELE-OP</Text>

          <Text style={styles.item_text}>Average Hatch Scored</Text>
          <Table
            borderStyle={{ borderWidth: 2, borderColor: "#c8e1ff" }}
            style={{ margin: 5 }}
          >
            <Row
              data={this.state.team_keys}
              style={styles.head}
              textStyle={styles.text}
            />
            <Rows data={[data.tele.total_hatch_average]} textStyle={styles.text} />
          </Table>

          <Text style={styles.item_text}>Average Cargo Scored</Text>
          <Table
            borderStyle={{ borderWidth: 2, borderColor: "#c8e1ff" }}
            style={{ margin: 5 }}
          >
            <Row
              data={this.state.team_keys}
              style={styles.head}
              textStyle={styles.text}
            />
            <Rows data={[data.tele.total_cargo_average]} textStyle={styles.text} />
          </Table>

          <Text style={styles.item_text}>Hatch - Cargoship Average</Text>
          <Table
            borderStyle={{ borderWidth: 2, borderColor: "#c8e1ff" }}
            style={{ margin: 5 }}
          >
            <Row
              data={this.state.team_keys}
              style={styles.head}
              textStyle={styles.text}
            />
            <Rows data={[data.tele.cargo_ship.hatch_average]} textStyle={styles.text} />
          </Table>

          <Text style={styles.item_text}>Cargo - Cargoship Average</Text>
          <Table
            borderStyle={{ borderWidth: 2, borderColor: "#c8e1ff" }}
            style={{ margin: 5 }}
          >
            <Row
              data={this.state.team_keys}
              style={styles.head}
              textStyle={styles.text}
            />
            <Rows data={[data.tele.cargo_ship.cargo_average]} textStyle={styles.text} />
          </Table>

          <Text style={styles.item_text}>
            Hatch - Rocketship Average (L/M/H)
          </Text>
          <Table
            borderStyle={{ borderWidth: 2, borderColor: "#c8e1ff" }}
            style={{ margin: 5 }}
          >
            <Row
              data={this.state.team_keys}
              style={styles.head}
              textStyle={styles.text}
            />
            <Rows data={[data.tele.rocket_ship.hatch_average]} textStyle={styles.text} />
          </Table>

          <Text style={styles.item_text}>
            Cargo - Rocketship Average (L/M/H)
          </Text>
          <Table
            borderStyle={{ borderWidth: 2, borderColor: "#c8e1ff" }}
            style={{ margin: 5 }}
          >
            <Row
              data={this.state.team_keys}
              style={styles.head}
              textStyle={styles.text}
            />
            <Rows data={[data.tele.rocket_ship.cargo_average]} textStyle={styles.text} />
          </Table>
        </View>
      );
    } else {
      return <Text>Please input a valid match</Text>;
    }
  }

  _onChangeText = match_number => {
    red_alliance = getTeamKeysForMatch(
      this.props.event.matches,
      parseInt(match_number),
      "red"
    );
    blue_alliance = getTeamKeysForMatch(
      this.props.event.matches,
      parseInt(match_number),
      "blue"
    );

    this.setState({
      match_number,
      team_keys: red_alliance.concat(blue_alliance)
    });
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.header_text}>Team Compare</Text>
        </View>

        <ScrollView style={{ flex: 1 }}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Icon name="md-ribbon" type="ionicon" color="#e65c00" reverse />
            <TextInput
              value={this.state.match_number}
              onChangeText={this._onChangeText}
              keyboardType="number-pad"
              placeholder={
                "Match number (1 - " +
                getQualificationMatches(
                  this.props.event.matches
                ).length.toString() +
                ")"
              }
              defaultValue={1}
            />
          </View>
          {this._renderTables()}
        </ScrollView>
      </View>
    );
  }
}

function mapStateToProps(state) {
  return {
    event: state.events,
    teams: state.teams.teams,
  };
}

//make this component available to the app
export default connect(mapStateToProps)(TeamCompare);
