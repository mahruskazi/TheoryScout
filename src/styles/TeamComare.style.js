import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    backgroundColor: "white",
    flex: 1
  },
  header: {
    height: 50,
    backgroundColor: "#292F6D",
    justifyContent: "center",
    alignItems: "center"
  },
  header_text: {
    color: "white",
    fontSize: 20
  },
  mode_header: {
    fontSize: 17,
    paddingStart: 10,
    paddingBottom: 5,
    color: "orange"
  },
  item_text: {
    paddingStart: 10,
    color: "black",
    fontWeight: "bold",
    paddingTop: 5
  },
  table: { flex: 1, padding: 16, paddingTop: 30, backgroundColor: "#fff" },
  head: { height: 40, backgroundColor: "#f1f8ff" },
  text: { margin: 6, color: "white" }
});
