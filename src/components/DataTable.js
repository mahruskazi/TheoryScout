import React, { Component } from 'react';
import { View, Text } from 'react-native';

export default class DataTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
      console.log(JSON.stringify(this.props))
    return (
      <View style={[{...this.props.style}, {flexDirection: 'row'}]}>
        <View style={{flex: 1, backgroundColor: '#ff3333'}}>

        </View>
        <View style={{flex: 1, backgroundColor: '#0066ff'}}>

        </View>
      </View>
    );
  }
}
