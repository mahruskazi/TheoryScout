import React, { Component } from "react";
import { View, Text } from "react-native";
import styles from "../styles/DataScreen.style";
import { getTeamSummary } from "../util/DataParser";

export default class DataScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: props.navigation.state.params.data,
      team_number: props.navigation.state.params.team_number
    };
  }

  render() {
    summary = getTeamSummary(this.state.data);
    return (
      <View style={styles.container}>
        <Text style={styles.team_number}>
          {"TEAM " + this.state.team_number}
        </Text>
        <Text style={styles.mode_header}>AUTONOMOUS</Text>
        <Text style={styles.item_header}>
          {"Level 1 S/A: "}
          <Text style={styles.item_text}>{summary.auto.level_1}</Text>
        </Text>
        <Text style={styles.item_header}>
          {"Level 2 S/A: "}
          <Text style={styles.item_text}>{summary.auto.level_2}</Text>
        </Text>
        <Text style={styles.item_header}>
          {"Hatch % - Cargo Ship: "}
          <Text style={styles.item_text}>{summary.auto.cargo_ship.accuracy_hatch}</Text>
        </Text>
        <Text style={styles.item_header}>
          {"Cargo % - Cargo Ship: "}
          <Text style={styles.item_text}>{summary.auto.cargo_ship.accuracy_cargo}</Text>
        </Text>
        <Text style={styles.item_header}>
          {"Hatch (L/M/H) % - Rocket Ship: "}
        </Text>
        <Text style={styles.item_text}>{summary.auto.rocket_ship.accuracy_hatch}</Text>
        <Text style={styles.item_header}>
          {"Cargo (L/M/H) % - Rocket Ship: "}
        </Text>
        <Text style={styles.item_text}>{summary.auto.rocket_ship.accuracy_cargo}</Text>

        <Text style={styles.mode_header}>TELEOP</Text>
        <Text style={styles.item_header}>
          {"Average Hatch: "}
          <Text style={styles.item_text}>{summary.tele.total_hatch_average.toFixed(2)}</Text>
        </Text>
        <Text style={styles.item_header}>
          {"Average Cargo: "}
          <Text style={styles.item_text}>{summary.tele.total_cargo_average.toFixed(2)}</Text>
        </Text>
        <Text style={styles.item_header}>
          {"Hatch Scored - Cargo Ship: "}
          <Text style={styles.item_text}>{summary.tele.cargo_ship.hatch_scored}</Text>
        </Text>
        <Text style={styles.item_header}>
          {"Cargo Scored - Cargo Ship: "}
          <Text style={styles.item_text}>{summary.tele.cargo_ship.cargo_scored}</Text>
        </Text>
        <Text style={styles.item_header}>
          {"Hatch (L/M/H) Scored - Rocket Ship: "}
        </Text>
        <Text style={styles.item_text}>{summary.tele.rocket_ship.hatch_scored}</Text>
        <Text style={styles.item_header}>
          {"Cargo (L/M/H) Scored - Rocket Ship: "}
        </Text>
        <Text style={styles.item_text}>{summary.tele.rocket_ship.cargo_scored}</Text>
        <Text style={styles.item_header}>
          {"Cleanup: "}
          <Text style={styles.item_text}>{summary.tele.cleanup}</Text>
        </Text>
        <Text style={styles.item_header}>
          {"Average cycle time cargo ship: "}
          <Text style={styles.item_text}>{summary.tele.avg_cycle_time_cs.toFixed(2)}</Text>
        </Text>
        <Text style={styles.item_header}>
          {"Average cycle time rocket ship: "}
          <Text style={styles.item_text}>{summary.tele.avg_cycle_time_rs.toFixed(2)}</Text>
        </Text>
      </View>
    );
  }
}
