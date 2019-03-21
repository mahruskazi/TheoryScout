import React, { Component } from "react";
import { View, Text, ScrollView } from "react-native";
import { ListItem, Badge } from "react-native-elements";
import styles from "../styles/TeamsList.style";
import { connect } from "react-redux";

class TeamsList extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  _renderBadge(team_number) {
    value = 0;

    if(team_number in this.props.teams){
      value = Object.keys(this.props.teams[team_number]).length;
    }

    return { value,  textStyle: { color: 'white' }, badgeStyle: { backgroundColor: '#404040', height: 30, width: 40, borderRadius: 15 } }
  }

  _onListItemPress(team_number) {
    data = null;

    if(team_number in this.props.teams){
      data = this.props.teams[team_number]
    }

    this.props.navigation.navigate('TeamPage', {data, team_number});
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.header_text}>Team List</Text>
        </View>
        <ScrollView>
          <View>
            {this.props.events.teams.map((l, i) => (
              <ListItem
                key={i}
                title={l.nickname}
                subtitle={l.city + ", " + l.country}
                chevronColor="black"
                chevron
                badge={this._renderBadge(l.team_number)}
                bottomDivider={true}
                onPress={() => this._onListItemPress(l.team_number)}
                leftAvatar={
                  <Text style={styles.team_number}>{l.team_number}</Text>
                }
              />
            ))}
          </View>
        </ScrollView>
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
export default connect(mapStateToProps)(TeamsList);
