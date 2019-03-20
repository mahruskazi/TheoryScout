import React, { Component } from "react";
import { View, Text } from "react-native";
import Dialog, {
  SlideAnimation,
  DialogContent,
  DialogTitle,
  DialogButton,
  DialogFooter
} from "react-native-popup-dialog";
import constants from "../../constants/DataInputConstants";

export default class OtherDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <View>
        <Dialog
          visible={this.props.visible}
          onTouchOutside={() => {
            this.props.cancelPressed();
          }}
          actionsBordered
          dialogStyle={{ width: 300 }}
          dialogTitle={
            <DialogTitle
              title={this.props.title}
              style={{
                backgroundColor: "#F7F7F8"
              }}
              hasTitleBar={false}
              align="left"
            />
          }
          footer={
            <DialogFooter>
              <DialogButton
                text="CANCEL"
                bordered
                onPress={() => {
                  this.props.cancelPressed();
                }}
                textStyle={{ fontSize: 15, color: "#008ae6" }}
                key="button-1"
              />
              <DialogButton
                text="YES"
                bordered
                onPress={() => {
                  this.props.okPressed({
                    action: this.props.action,
                    location: constants.locations.NOT_APPLICABLE
                  });
                }}
                textStyle={{ fontSize: 15, color: "#008ae6" }}
                key="button-2"
              />
            </DialogFooter>
          }
        >
          <DialogContent>
            <Text>{this.props.text}</Text>
          </DialogContent>
        </Dialog>
      </View>
    );
  }
}
