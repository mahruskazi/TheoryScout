import constants from "../constants/DataInputConstants";
import merge from "deepmerge";

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
      hab_success: match.a.hs,
      cargo_ship: {},
      rocket_ship: {}
    },
    tele: {
      cargo_ship: {},
      rocket_ship: {},
      floor_pickups: 0,
      got_defended: 0,
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
  tele_actions = match.t.a;

  auto = extractData(auto_actions);
  obj.auto = merge(obj.auto, auto);

  tele = extractData(tele_actions, 15);
  obj.tele = merge(obj.tele, tele);

  tele_actions.map(action => {
    switch (action.a) {
      case constants.actions.PICKUP:
        if (
          action.l == constants.locations.LEFT_FLOOR ||
          action.l == constants.locations.RIGHT_FLOOR
        ) {
          obj.tele.floor_pickups++;
        }
        break;
      case constants.actions.DIED:
        obj.tele.times_died++;
        break;
      case constants.actions.DEFENDED:
        obj.tele.played_defence++;
        break;
      case constants.actions.GOT_DEFENDED:
        obj.tele.got_defended++;
        break;
      case constants.actions.DROPPED:
        obj.tele.times_dropped++;
        break;
    }
  });

  /**************************** AUTO ********************************/
  // Calculate hatch accuracy scored/(scored + missed)
  stats = getStatsCS(obj.auto.cargo_ship.hatch);
  obj.auto.cargo_ship.hatch = merge(obj.auto.cargo_ship.hatch, stats);

  stats = getStatsCS(obj.auto.cargo_ship.cargo);
  obj.auto.cargo_ship.cargo = merge(obj.auto.cargo_ship.cargo, stats);

  // Calculate hatch accuracy scored/(scored + missed)
  stats = getStatsRS(obj.auto.rocket_ship.hatch);
  obj.auto.rocket_ship.hatch = merge(obj.auto.rocket_ship.hatch, stats);

  stats = getStatsRS(obj.auto.rocket_ship.cargo);
  obj.auto.rocket_ship.cargo = merge(obj.auto.rocket_ship.cargo, stats);

  /**************************** TELE ********************************/
  // Calculate hatch accuracy scored/(scored + missed)
  stats = getStatsCS(obj.tele.cargo_ship.hatch);
  obj.tele.cargo_ship.hatch = merge(obj.tele.cargo_ship.hatch, stats);

  stats = getStatsCS(obj.tele.cargo_ship.cargo);
  obj.tele.cargo_ship.cargo = merge(obj.tele.cargo_ship.cargo, stats);

  // Calculate hatch accuracy scored/(scored + missed)
  stats = getStatsRS(obj.tele.rocket_ship.hatch);
  obj.tele.rocket_ship.hatch = merge(obj.tele.rocket_ship.hatch, stats);

  stats = getStatsRS(obj.tele.rocket_ship.cargo);
  obj.tele.rocket_ship.cargo = merge(obj.tele.rocket_ship.cargo, stats);

  return obj;
}

function getStatsCS(object) {
  game_object = {
    accuracy: 0,
    average_cycle_time: 0
  };

  game_object.accuracy = getAverage(object.scored, object.missed);
  game_object.average_cycle_time =
    getSumOfArray(object.cycle_times) / parseFloat(object.cycle_times.length);
  return game_object;
}

function getStatsRS(object) {
  game_object = {
    accuracy: 0,
    average_cycle_time: 0
  };
  scored = object.scored_high + object.scored_mid + object.scored_low;
  missed = object.missed_high + object.missed_mid + object.missed_low;
  game_object.accuracy = getAverage(scored, missed);
  game_object.average_cycle_time =
    getSumOfArray(object.cycle_times) / parseFloat(object.cycle_times.length);
  return game_object;
}

function getAverage(scored, missed) {
  return (1.0 * scored) / (scored + missed);
}

// Pass in the actions for that match and the time_offset (tele offset by 15 seconds)
function extractData(actions, time_offset = 0) {
  general = {
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
  };
  start_cycle = false;
  time_start = time_offset;
  time_end = 0;
  actions.map(action => {
    if (action.a == constants.actions.PICKUP && !start_cycle) {
      time_start = action.t;
      start_cycle = true;
    }

    // Cargo ship score/miss actions for hatch and cargo
    switch (action.a) {
      case constants.actions.SHIP_SCORE_HATCH:
        time_end = action.t;
        general.cargo_ship.hatch.cycle_times.push(time_end - time_start);
        general.cargo_ship.hatch.scored++;
        start_cycle = false;
        break;
      case constants.actions.SHIP_MISSED_HATCH:
        general.cargo_ship.hatch.missed++;
        break;
      case constants.actions.SHIP_SCORE_CARGO:
        time_end = action.t;
        general.cargo_ship.cargo.cycle_times.push(time_end - time_start);
        general.cargo_ship.cargo.scored++;
        start_cycle = false;
        break;
      case constants.actions.SHIP_MISSED_CARGO:
        general.cargo_ship.cargo.missed++;
        break;
    }

    // Rocket ship score/miss actions for hatch and cargo
    switch (action.a) {
      case constants.actions.ROCKET_SCORE_HATCH_HIGH:
        time_end = action.t;
        general.rocket_ship.hatch.cycle_times.push(time_end - time_start);
        start_cycle = false;
        general.rocket_ship.hatch.scored_high++;
        break;
      case constants.actions.ROCKET_SCORE_HATCH_MID:
        time_end = action.t;
        general.rocket_ship.hatch.cycle_times.push(time_end - time_start);
        start_cycle = false;
        general.rocket_ship.hatch.scored_mid++;
        break;
      case constants.actions.ROCKET_SCORE_HATCH_LOW:
        time_end = action.t;
        general.rocket_ship.hatch.cycle_times.push(time_end - time_start);
        start_cycle = false;
        general.rocket_ship.hatch.scored_low++;
        break;
      case constants.actions.ROCKET_SCORE_CARGO_HIGH:
        time_end = action.t;
        general.rocket_ship.cargo.cycle_times.push(time_end - time_start);
        start_cycle = false;
        general.rocket_ship.cargo.scored_high++;
        break;
      case constants.actions.ROCKET_SCORE_CARGO_MID:
        time_end = action.t;
        general.rocket_ship.cargo.cycle_times.push(time_end - time_start);
        start_cycle = false;
        general.rocket_ship.cargo.scored_mid++;
        break;
      case constants.actions.ROCKET_SCORE_CARGO_LOW:
        time_end = action.t;
        general.rocket_ship.cargo.cycle_times.push(time_end - time_start);
        start_cycle = false;
        general.rocket_ship.cargo.scored_low++;
        break;
      case constants.actions.ROCKET_MISSED_HATCH_HIGH:
        general.rocket_ship.hatch.missed_high++;
        break;
      case constants.actions.ROCKET_MISSED_HATCH_MID:
        general.rocket_ship.hatch.missed_mid++;
        break;
      case constants.actions.ROCKET_MISSED_HATCH_LOW:
        general.rocket_ship.hatch.missed_low++;
        break;
      case constants.actions.ROCKET_MISSED_CARGO_HIGH:
        general.rocket_ship.cargo.missed_high++;
        break;
      case constants.actions.ROCKET_MISSED_CARGO_MID:
        general.rocket_ship.cargo.missed_mid++;
        break;
      case constants.actions.ROCKET_MISSED_CARGO_LOW:
        general.rocket_ship.cargo.missed_low++;
        break;
    }
  });

  return general;
}

function getSumOfArray(array) {
  sum = 0;

  array.map(num => {
    sum += num;
  });
  return sum;
}
