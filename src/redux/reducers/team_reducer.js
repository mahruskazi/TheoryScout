const initialState = {
  teams: {},
  error: null
};

export default function(state = initialState, action) {
  switch (action.type) {
    case "DELETE_ALL_TEAMS": {
      console.log("Deleted all scouted teams");
      return { ...state, teams: {} };
    }
    case "ADD_MATCH_TO_TEAM": {
      teams = state.teams;
      team_number = action.payload.team_number;
      match_number = action.payload.match_number;
      index = -1;

      if (teams[team_number] === undefined){
          console.log("New team, creating slot")
          teams[team_number] = {}
          teams[team_number][match_number] = action.payload
      } else {
        console.log("Team exists, updating match information")
        teams[team_number][match_number] = action.payload
      }
      console.log("Updated teams")
    
      return { ...state, teams };
    }
    case "REPLACE_ALL_TEAMS": {
    //   teams = [];
    //   action.payload.map(team => {
    //     teams.push(team);
    //   }); // Copy over data to force update redux states
      console.log("REPLACING ALL TEAMS");
      return { ...state, teams: action.payload };
    }
    case "DELETE_TEAM": {
      //TODO: Add option to delete match
      return { ...state, fetching: false, error: action.payload };
    }
  }

  return state;
}
