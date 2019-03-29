
const initialState = {
    events: [],
    teams: [],
    matches: [],
    selected_event: {
        key: null,
        name: "Nothing Selected"
    },
    fetching: false,
    fetched: false,
    error: null,
}

export default function (state=initialState, action) {
    switch(action.type){
        case 'FETCH_START': {
            console.log("FETCH START");
            return {...state, fetching: true}
        }
        case 'FETCH_ERROR': {
            console.log("FETCH ERROR: " + action.payload);
            return {...state, fetching: false, error: action.payload}
        }
        case 'FETCH_EVENTS_COMPLETE': {
            console.log("EVENT FETCH SUCCESSFUL");
            return {...state, fetching: false, fetched: true, events: action.payload}
        }
        case 'FETCH_TEAMS_COMPLETE': {
            console.log("TEAMS FETCH SUCCESSFUL");
            teams = action.payload;
            teams.sort(function(a,b) {
                return parseInt(a.team_number) - parseInt(b.team_number);
            });
            return {...state, fetching: false, fetched: true, teams}
        }
        case 'FETCH_MATCHES_COMPLETE': {
            console.log("MATCHES FETCH SUCCESSFUL");
            return {...state, fetching: false, fetched: true, matches: action.payload}
        }
        case 'UPDATE_CURRENT_EVENT': {
            console.log('SELECTED EVENT: ' + JSON.stringify(action.payload))
            return {...state, selected_event: {...action.payload}}
        }
    }
    
    return state
}