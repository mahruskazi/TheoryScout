import { connect } from "react-redux";
import QrCodeReader from "../../components/QrCodeReader";

const mapDispatchToProps = dispatch => ({
  updateMatches: (data) => {
    dispatch({ type: "REPLACE_ALL_MATCHES", payload: data });
  },
  updateTeamMatches: (data) => {
    dispatch({ type: "ADD_MATCH_TO_TEAM", payload: data });
  }
});

export default connect(null,mapDispatchToProps)(QrCodeReader);
