
const initialState = {
    matches: [],
    error: null,
}

export default function (state=initialState, action) {
    switch(action.type){
        case 'DELETE_ALL_MATCHES': {
            console.log("Deleted all scouted matches")
            return {...state, matches: []}
        }
        case 'ADD_MATCH': {
            matches = []
            state.matches.map(match => { matches.push(match)})
            matches.push(action.payload)
            console.log("MATCH ADDED - Now at: " + matches.length)
            return {...state, matches}
        }
        case 'REPLACE_ALL_MATCHES': {
            matches = []
            action.payload.map((match) => { matches.push(match)} ) // Copy over data to force update redux states
            console.log("REPLACING ALL MATCHES")
            return {...state, matches}
        }
        case 'DELETE_MATCH': {
            //TODO: Add option to delete match
            return {...state, fetching: false, error: action.payload}
        }
        case 'UPDATE_MATCH': {
            //TODO: Add option to update match
            return {...state}
        }
    }
    
    return state
}