import { connect } from "react-redux";
import QrCodeReader from "../../components/QrCodeReader";

const mapDispatchToProps = dispatch => ({
  updateMatches: (data) => {
    dispatch({ type: "REPLACE_ALL_MATCHES", payload: data });
  }
});

export default connect(null,mapDispatchToProps)(QrCodeReader);
