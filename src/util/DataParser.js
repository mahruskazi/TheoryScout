import constants from "../constants/DataInputConstants";

export function getQualificationMatches(data) {
  qualificationMatches = [];

  data.map(match => {
    if (match.comp_level == "qm") {
      qualificationMatches.push(match);
    }
  });

  qualificationMatches.sort(function(a, b) {
    var match_number_1 = a.match_number;
    var match_number_2 = b.match_number;

    if (match_number_1 < match_number_2) return -1;
    else if (match_number_1 > match_number_2) return 1;
    else return 0;
  });

  return qualificationMatches;
}

export function getTeamKeysForMatch(data, match_number, alliance_color) {
  teams = [];
  matches = getQualificationMatches(data);

  matches.map(qm => {
    if (qm.match_number == match_number) {
      alliance = qm.alliances[alliance_color];
      alliance.team_keys.map(team => {
        teams.push(team.substring(3));
      });
    }
  });

  return teams;
}

export function extractMatchData(match) {
  obj = {
    team_number: match.tn,
    match_number: match.mn,
    alliance_color: match.c,
    scout_name: match.sn,
    starting_position: match.sp,
    starting_level: match.sl,
    auto: {
      hab_success: false,
      cargo_ship: {
        hatch: {
          scored: 0,
          missed: 0,
          accuracy: 0,
          cycle_times: [],
          average_cycle_time: 0
        },
        cargo: {
          scored: 0,
          missed: 0,
          accuracy: 0,
          cycle_times: [],
          average_cycle_time: 0
        }
      },
      rocket_ship: {
        hatch: {
          scored_high: 0,
          scored_mid: 0,
          scored_low: 0,
          missed_high: 0,
          missed_mid: 0,
          missed_low: 0,
          accuracy: 0,
          cycle_times: [],
          average_cycle_time: 0
        },
        cargo: {
          scored_high: 0,
          scored_mid: 0,
          scored_low: 0,
          missed_high: 0,
          missed_mid: 0,
          missed_low: 0,
          accuracy: 0,
          cycle_times: [],
          average_cycle_time: 0
        }
      }
    },
    tele: {
      hab_success: false,
      cargo_ship: {
        hatch: {
          scored: 0,
          missed: 0,
          accuracy: 0,
          cycle_times: [],
          average_cycle_time: 0
        },
        cargo: {
          scored: 0,
          missed: 0,
          accuracy: 0,
          cycle_times: [],
          average_cycle_time: 0
        }
      },
      rocket_ship: {
        hatch: {
          scored_high: 0,
          scored_mid: 0,
          scored_low: 0,
          missed_high: 0,
          missed_mid: 0,
          missed_low: 0,
          accuracy: 0,
          cycle_times: [],
          average_cycle_time: 0
        },
        cargo: {
          scored_high: 0,
          scored_mid: 0,
          scored_low: 0,
          missed_high: 0,
          missed_mid: 0,
          missed_low: 0,
          accuracy: 0,
          cycle_times: [],
          average_cycle_time: 0
        }
      },
      floor_pickups: 0,
      times_defended: 0,
      played_defence: 0,
      times_died: 0,
      times_dropped: 0
    },
    end: {
      climb_level: 0
    },
    raw: match
  };

  auto_actions = match.a.a;

  start_cycle = false;
  time_start = 0;
  time_end = 0;

  auto_actions.map(action => {
    if (action.a == constants.actions.PICKUP && !start_cycle) {
      time_start = action.t;
      start_cycle = true;
    }

    switch (action.a) {
      case constants.actions.SHIP_SCORE_HATCH:
        time_end = action.t;
        obj.auto.cargo_ship.hatch.cycle_times.push(time_end - time_start);
        obj.auto.cargo_ship.hatch.scored++;
        start_cycle = false;
        break;
      case constants.actions.SHIP_MISSED_HATCH:
        obj.auto.cargo_ship.hatch.missed++;
        break;
      case constants.actions.SHIP_SCORE_CARGO:
        time_end = action.t;
        obj.auto.cargo_ship.cargo.cycle_times.push(time_end - time_start);
        obj.auto.cargo_ship.cargo.scored++;
        start_cycle = false;
        break;
      case constants.actions.SHIP_MISSED_CARGO:
        obj.auto.cargo_ship.cargo.missed++;
        break;
    }
  });

  obj.auto.cargo_ship.hatch.accuracy =
    obj.auto.cargo_ship.hatch.scored /
    (obj.auto.cargo_ship.hatch.scored + obj.auto.cargo_ship.hatch.missed);

  obj.auto.cargo_ship.cargo.accuracy =
    obj.auto.cargo_ship.cargo.scored /
    (obj.auto.cargo_ship.cargo.scored + obj.auto.cargo_ship.cargo.missed);

  return obj;
}
