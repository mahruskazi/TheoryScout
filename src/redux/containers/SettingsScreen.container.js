import { connect } from "react-redux";
import SettingsScreen from "../../components/SettingsScreen";

const mapDispatchToProps = dispatch => ({
  updateEvents: () => {
    dispatch({ type: "FETCH_START" });

    return fetch("https://www.thebluealliance.com/api/v3/events/2019/simple", {
      method: "GET",
      headers: new Headers({
        accept: "application/json",
        "X-TBA-Auth-Key":
          "maKVZJhdLogBFFXiIwwLt0n7EwVhsEfb6fI48JvxceNw4rIJ51jvLfqzGC4Wr17w"
      }),
      body: ""
    })
      .then(response => response.json())
      .then(responseJson => {
        dispatch({type: 'FETCH_EVENTS_COMPLETE', payload: responseJson})
      })
      .catch(error => {
        dispatch({type: 'FETCH_ERROR', payload: error})
      });
  },
  updateCurrentEvent: (key, name) => {
    dispatch({type: 'UPDATE_CURRENT_EVENT', payload: {key, name}})
  },
  updateTeams: key => {
    dispatch({ type: "FETCH_START" });
    console.log("Updating teams with key: " + key);
    return fetch("https://www.thebluealliance.com/api/v3/event/" + key + "/teams/simple", {
      method: "GET",
      headers: new Headers({
        accept: "application/json",
        "X-TBA-Auth-Key":
          "maKVZJhdLogBFFXiIwwLt0n7EwVhsEfb6fI48JvxceNw4rIJ51jvLfqzGC4Wr17w"
      }),
      body: ""
    })
      .then(response => response.json())
      .then(responseJson => {
        dispatch({type: 'FETCH_TEAMS_COMPLETE', payload: responseJson})
      })
      .catch(error => {
        dispatch({type: 'FETCH_ERROR', payload: error})
      });
  },
  updateMatches: key => {
    dispatch({ type: "FETCH_START" });
    console.log("Updating matches with key: " + key);

    return fetch("https://www.thebluealliance.com/api/v3/event/" + key + "/matches/simple", {
      method: "GET",
      headers: new Headers({
        accept: "application/json",
        "X-TBA-Auth-Key":
          "maKVZJhdLogBFFXiIwwLt0n7EwVhsEfb6fI48JvxceNw4rIJ51jvLfqzGC4Wr17w"
      }),
      body: ""
    })
      .then(response => response.json())
      .then(responseJson => {
        dispatch({type: 'FETCH_MATCHES_COMPLETE', payload: responseJson})
      })
      .catch(error => {
        dispatch({type: 'FETCH_ERROR', payload: error})
      });
  },
  deleteMatches: () => {
    dispatch({ type: "DELETE_ALL_MATCHES" });
    dispatch({ type: "DELETE_ALL_TEAMS" });
  },
  loadTeams: data => {
    matches = []
    Object.values(data).forEach(value => {
      //raw = value[1].raw
      Object.values(value).forEach(v => {
        //raw = value[1].raw
        //console.log("RAW: " + JSON.stringify(v))
        matches.push(v.raw)
      });
    });
    dispatch({ type: "REPLACE_ALL_MATCHES", payload: matches });
    dispatch({ type: "REPLACE_ALL_TEAMS", payload: data });
  },
  setOrientation: state => {
    dispatch({ type: "SET_ORIENTATION", payload: state });
  }
});

export default connect(null,mapDispatchToProps)(SettingsScreen);
