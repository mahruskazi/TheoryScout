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
    team_number: parseInt(match.tn),
    match_number: parseInt(match.mn),
    alliance_color: match.c,
    scout_name: match.sn,
    starting_position: match.sp,
    starting_level: match.sl,
    comments: match.e.c,
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
      climb_levels: match.e.l,
      time: match.e.t
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
  console.log("Extracted match data successfully");
  return obj;
}

function getStatsCS(object) {
  game_object = {
    accuracy: -1,
    average_cycle_time: -1
  };

  if (object.scored + object.missed != 0) {
    game_object.accuracy = getAverage(object.scored, object.missed);
  }
  if (object.cycle_times.length != 0) {
    game_object.average_cycle_time =
      getSumOfArray(object.cycle_times) / parseFloat(object.cycle_times.length);
  }
  return game_object;
}

function getStatsRS(object) {
  game_object = {
    accuracy: -1,
    average_cycle_time: -1
  };
  scored = object.scored_high + object.scored_mid + object.scored_low;
  missed = object.missed_high + object.missed_mid + object.missed_low;
  if (scored != 0) {
    game_object.accuracy = getAverage(scored, missed);
  }
  if (object.cycle_times.length != 0) {
    game_object.average_cycle_time =
      getSumOfArray(object.cycle_times) / parseFloat(object.cycle_times.length);
  }
  return game_object;
}

function getAverage(scored, missed) {
  if (scored + missed != 0) {
    return (1.0 * scored) / (scored + missed);
  } else {
    return 0;
  }
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
  if (actions != undefined) {
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
  }

  return general;
}

function getSumOfArray(array) {
  sum = 0;

  array.map(num => {
    sum += num;
  });
  return sum;
}

function extractTeamSummary(data) {
  obj = {
    auto: {
      level_1_success: 0,
      level_1_missed: 0,
      level_2_success: 0,
      level_2_missed: 0,
      cargo_ship: {
        accuracy_cargo: [],
        accuracy_hatch: []
      },
      rocket_ship: {
        accuracy_cargo: [],
        accuracy_hatch: []
      }
    },
    tele: {
      total_hatch_scored: 0,
      total_hatch_missed: 0,
      total_cargo_scored: 0,
      total_cargo_missed: 0,
      cargo_ship: {
        cargo_scored: [],
        hatch_scored: []
      },
      rocket_ship: {
        cargo_scored: [],
        hatch_scored: []
      },
      cleanup: 0,
      cycle_time_cs: [],
      cycle_time_rs: []
    },
    end: []
  };

  Object.keys(data)
    .sort(function(a, b) {
      return a - b;
    })
    .forEach(match => {
      if (data[match].starting_level == 0) {
        if (data[match].auto.hab_success == 0) {
          obj.auto.level_1_success++;
        } else {
          obj.auto.level_1_missed++;
        }
      } else {
        if (data[match].auto.hab_success == 0) {
          obj.auto.level_2_success++;
        } else {
          obj.auto.level_2_missed++;
        }
      }

      if (data[match].auto.cargo_ship.cargo.accuracy != -1) {
        obj.auto.cargo_ship.accuracy_cargo.push(
          data[match].auto.cargo_ship.cargo.accuracy
        );
      }
      if (data[match].auto.cargo_ship.hatch.accuracy != -1) {
        obj.auto.cargo_ship.accuracy_hatch.push(
          data[match].auto.cargo_ship.hatch.accuracy
        );
      }

      t = {
        low: getAverage(
          data[match].auto.rocket_ship.cargo.scored_low,
          data[match].auto.rocket_ship.cargo.missed_low
        ),
        mid: getAverage(
          data[match].auto.rocket_ship.cargo.scored_mid,
          data[match].auto.rocket_ship.cargo.missed_mid
        ),
        high: getAverage(
          data[match].auto.rocket_ship.cargo.scored_high,
          data[match].auto.rocket_ship.cargo.missed_high
        )
      };
      text = `(${t.low}, ${t.mid}, ${t.high})`;
      obj.auto.rocket_ship.accuracy_cargo.push(text);
      t = {
        low: getAverage(
          data[match].auto.rocket_ship.hatch.scored_low,
          data[match].auto.rocket_ship.hatch.missed_low
        ),
        mid: getAverage(
          data[match].auto.rocket_ship.hatch.scored_mid,
          data[match].auto.rocket_ship.hatch.missed_mid
        ),
        high: getAverage(
          data[match].auto.rocket_ship.hatch.scored_high,
          data[match].auto.rocket_ship.hatch.missed_high
        )
      };
      text = `(${t.low}, ${t.mid}, ${t.high})`;
      obj.auto.rocket_ship.accuracy_hatch.push(text);

      obj.tele.total_cargo_scored +=
        data[match].tele.cargo_ship.cargo.scored +
        data[match].tele.rocket_ship.cargo.scored_high +
        data[match].tele.rocket_ship.cargo.scored_mid +
        data[match].tele.rocket_ship.cargo.scored_low;

      obj.tele.total_cargo_missed +=
        data[match].tele.cargo_ship.cargo.missed +
        data[match].tele.rocket_ship.cargo.missed_high +
        data[match].tele.rocket_ship.cargo.missed_mid +
        data[match].tele.rocket_ship.cargo.missed_low;

      obj.tele.total_hatch_scored +=
        data[match].tele.cargo_ship.hatch.scored +
        data[match].tele.rocket_ship.hatch.scored_high +
        data[match].tele.rocket_ship.hatch.scored_mid +
        data[match].tele.rocket_ship.hatch.scored_low;

      obj.tele.total_hatch_missed +=
        data[match].tele.cargo_ship.hatch.missed +
        data[match].tele.rocket_ship.hatch.missed_high +
        data[match].tele.rocket_ship.hatch.missed_mid +
        data[match].tele.rocket_ship.hatch.missed_low;

      obj.tele.cargo_ship.cargo_scored.push(
        data[match].tele.cargo_ship.cargo.scored
      );
      obj.tele.cargo_ship.hatch_scored.push(
        data[match].tele.cargo_ship.hatch.scored
      );

      t = {
        low: data[match].tele.rocket_ship.cargo.scored_low,
        mid: data[match].tele.rocket_ship.cargo.scored_mid,
        high: data[match].tele.rocket_ship.cargo.scored_high
      };

      text = `(${t.low}, ${t.mid}, ${t.high})`;
      obj.tele.rocket_ship.cargo_scored.push(text);

      t = {
        low: data[match].tele.rocket_ship.hatch.scored_low,
        mid: data[match].tele.rocket_ship.hatch.scored_mid,
        high: data[match].tele.rocket_ship.hatch.scored_high
      };

      text = `(${t.low}, ${t.mid}, ${t.high})`;
      obj.tele.rocket_ship.hatch_scored.push(text);

      obj.tele.cleanup += data[match].tele.floor_pickups;

      if (data[match].tele.cargo_ship.cargo.average_cycle_time != -1) {
        obj.tele.cycle_time_cs = obj.tele.cycle_time_cs.concat(
          data[match].tele.cargo_ship.cargo.cycle_times
        );
      }
      if (data[match].tele.cargo_ship.hatch.average_cycle_time != -1) {
        obj.tele.cycle_time_cs = obj.tele.cycle_time_cs.concat(
          data[match].tele.cargo_ship.hatch.cycle_times
        );
      }

      if (data[match].tele.rocket_ship.cargo.average_cycle_time != -1) {
        obj.tele.cycle_time_rs = obj.tele.cycle_time_rs.concat(
          data[match].tele.rocket_ship.cargo.cycle_times
        );
      }
      if (data[match].tele.rocket_ship.hatch.average_cycle_time != -1) {
        obj.tele.cycle_time_rs = obj.tele.cycle_time_rs.concat(
          data[match].tele.rocket_ship.hatch.cycle_times
        );
      }

      if (
        data[match].end.climb_levels != undefined &&
        data[match].end.climb_levels.length > 0
      ) {
        obj.end.push(data[match].end.climb_levels);
      } else {
        obj.end.push(["N/A"]);
      }
    });

  return obj;
}

export function getTeamSummary(data) {
  output = {
    auto: {
      level_1: "N/A",
      level_2: "N/A",
      cargo_ship: {
        accuracy_cargo: "N/A",
        accuracy_hatch: "N/A"
      },
      rocket_ship: {
        accuracy_cargo: "N/A",
        accuracy_hatch: "N/A"
      }
    },
    tele: {
      total_hatch_average: -1,
      total_cargo_average: -1,
      cargo_ship: {
        cargo_scored: "N/A",
        hatch_scored: "N/A"
      },
      rocket_ship: {
        cargo_scored: "N/A",
        hatch_scored: "N/A"
      },
      cleanup: "N/A",
      avg_cycle_time_cs: -1,
      avg_cycle_time_rs: -1
    },
    end: []
  };
  if (data != null && Object.keys(data).length > 0) {
    summary = extractTeamSummary(data);

    output.auto.level_1 = `${summary.auto.level_1_success}/${summary.auto
      .level_1_success + summary.auto.level_1_missed}`;
    output.auto.level_2 = `${summary.auto.level_2_success}/${summary.auto
      .level_2_success + summary.auto.level_2_missed}`;

    if (summary.auto.cargo_ship.accuracy_hatch.length > 0) {
      last_three = summary.auto.cargo_ship.accuracy_hatch.slice(
        Math.max(summary.auto.cargo_ship.accuracy_hatch.length - 3, 0)
      );
      output.auto.cargo_ship.accuracy_hatch = JSON.stringify(last_three);
    }

    if (summary.auto.cargo_ship.accuracy_cargo.length > 0) {
      last_three = summary.auto.cargo_ship.accuracy_cargo.slice(
        Math.max(summary.auto.cargo_ship.accuracy_cargo.length - 3, 0)
      );
      output.auto.cargo_ship.accuracy_cargo = JSON.stringify(last_three);
    }

    if (summary.auto.rocket_ship.accuracy_hatch.length > 0) {
      last_three = summary.auto.rocket_ship.accuracy_hatch.slice(
        Math.max(summary.auto.rocket_ship.accuracy_hatch.length - 3, 0)
      );
      output.auto.rocket_ship.accuracy_hatch = JSON.stringify(last_three);
    }

    if (summary.auto.rocket_ship.accuracy_cargo.length > 0) {
      last_three = summary.auto.rocket_ship.accuracy_cargo.slice(
        Math.max(summary.auto.rocket_ship.accuracy_cargo.length - 3, 0)
      );
      output.auto.rocket_ship.accuracy_cargo = JSON.stringify(last_three);
    }

    // TELE

    output.tele.total_hatch_average =
      summary.tele.total_hatch_scored / Object.keys(data).length;

    output.tele.total_cargo_average =
      summary.tele.total_cargo_scored / Object.keys(data).length;

    if (summary.tele.cargo_ship.hatch_scored.length > 0) {
      last_three = summary.tele.cargo_ship.hatch_scored.slice(
        Math.max(summary.tele.cargo_ship.hatch_scored.length - 3, 0)
      );
      output.tele.cargo_ship.hatch_scored = JSON.stringify(last_three);
    }

    if (summary.tele.cargo_ship.cargo_scored.length > 0) {
      last_three = summary.tele.cargo_ship.cargo_scored.slice(
        Math.max(summary.tele.cargo_ship.cargo_scored.length - 3, 0)
      );
      output.tele.cargo_ship.cargo_scored = JSON.stringify(last_three);
    }

    if (summary.tele.rocket_ship.hatch_scored.length > 0) {
      last_three = summary.tele.rocket_ship.hatch_scored.slice(
        Math.max(summary.tele.rocket_ship.hatch_scored.length - 3, 0)
      );
      output.tele.rocket_ship.hatch_scored = JSON.stringify(last_three);
    }

    if (summary.tele.rocket_ship.cargo_scored.length > 0) {
      last_three = summary.tele.rocket_ship.cargo_scored.slice(
        Math.max(summary.tele.rocket_ship.cargo_scored.length - 3, 0)
      );
      output.tele.rocket_ship.cargo_scored = JSON.stringify(last_three);
    }

    output.tele.cleanup = summary.tele.cleanup;

    if (summary.tele.cycle_time_cs.length > 0) {
      sum = getSumOfArray(summary.tele.cycle_time_cs);
      output.tele.avg_cycle_time_cs = sum / summary.tele.cycle_time_cs.length;
    }

    if (summary.tele.cycle_time_rs.length > 0) {
      sum = getSumOfArray(summary.tele.cycle_time_rs);
      output.tele.avg_cycle_time_rs = sum / summary.tele.cycle_time_rs.length;
    }

    output.end = summary.end;
  }
  return output;
}
