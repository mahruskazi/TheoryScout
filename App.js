import React from "react";
import {
  StyleSheet,
  Platform,
  Image,
  Text,
  View,
  ScrollView
} from "react-native";
import {
  createSwitchNavigator,
  createAppContainer,
  createDrawerNavigator,
  createBottomTabNavigator,
  createStackNavigator,
  DrawerItems,
  SafeAreaView
} from "react-navigation";
import { Icon } from "native-base";
import Orientation from "react-native-orientation";
import { createMaterialBottomTabNavigator } from "react-navigation-material-bottom-tabs";
import WelcomeScreen from "./src/components/WelcomeScreen";
import MatchesScreen from "./src/components/MatchesScreen";
import SettingsScreen from "./src/redux/containers/SettingsScreen.container";
import QrCodeGenerator from "./src/components/QrCodeGenerator";
import TeamsList from "./src/components/TeamsList";
import DataScreen from "./src/components/DataScreen";
import QrCodeReader from "./src/redux/containers/QrCodeReader.container";

export default class App extends React.Component {
  constructor() {
    super();
    this.state = {};
  }

  componentWillMount() {
    // The getOrientation method is async. It happens sometimes that
    // you need the orientation at the moment the JS runtime starts running on device.
    // `getInitialOrientation` returns directly because its a constant set at the
    // beginning of the JS runtime.

    const initial = Orientation.getInitialOrientation();
    if (initial === "PORTRAIT") {
      // do something
    } else {
      // do something else
    }
  }

  componentDidMount() {
    // this locks the view to Portrait Mode
    Orientation.lockToPortrait();

    // this locks the view to Landscape Mode
    //Orientation.lockToLandscape();

    // this unlocks any previous locks to all Orientations
    // Orientation.unlockAllOrientations();

    Orientation.addOrientationListener(this._orientationDidChange);
  }

  _orientationDidChange = orientation => {
    if (orientation === "LANDSCAPE") {
      console.log("To Landscape");
    } else {
      // do something with portrait layout
    }
  };

  componentWillUnmount() {
    Orientation.getOrientation((err, orientation) => {
      console.log(`Current Device Orientation: ${orientation}`);
    });

    // Remember to remove listener
    Orientation.removeOrientationListener(this._orientationDidChange);
  }

  render() {
    return <AppContainer />;
  }
}

// const DashboardTabNavigator = createBottomTabNavigator({
//   Scout: {
//     screen: ScoutScreen,
//     navigationOptions: {
//       tabBarLabel: 'SCOUT',
//       tabBarIcon: (
//         <Icon name='analytics'/>
//       )
//     }
//   },
//   Matches: {
//     screen: MatchesScreen,
//     navigationOptions: {
//       tabBarLabel: 'MATCHES',
//       tabBarIcon: (
//         <Icon name='eye'/>
//       )
//     }
//   },
// },{
//   defaultNavigationOptions: {
//     tabBarOptions: {
//       activeTintColor: 'orange',
//       activeBackgroundColor: 'blue',
//       labelStyle: {
//         fontSize: 12,
//       },
//       style: {
//       },
//     }
//   }
// })

const DashboardTabNavigator = createMaterialBottomTabNavigator(
  {
    Teams: {
      screen: TeamsList,
      navigationOptions: {
        tabBarLabel: "TEAMS",
        tabBarIcon: <Icon name="list" style={{ color: "white", fontSize: 25 }} />
      }
    },
    Data: {
      screen: DataScreen,
      navigationOptions: {
        tabBarLabel: "DATA",
        tabBarIcon: <Icon name="ios-desktop" style={{ color: "white", fontSize: 25 }} />
      }
    },
    Matches: {
      screen: MatchesScreen,
      navigationOptions: {
        tabBarLabel: "MATCHES",
        tabBarIcon: <Icon name="eye" style={{ color: "white", fontSize: 25 }} />
      }
    }
  },
  {
    initialRouteName: "Teams",
    activeColor: "#f0edf6",
    inactiveColor: "#3e2465",
    shifting: true,
    barStyle: { backgroundColor: "#292F6D" }
  }
);

const DashboardStackNavigator = createStackNavigator(
  {
    DashboardTabNavigator: {
      screen: DashboardTabNavigator,
      navigationOptions: {
        header: null
      }
    },
    QrScreen: {
      screen: QrCodeGenerator
    }
  },
  {
    mode: "modal"
  }
);

const CustomDrawerContentComponent = props => (
  <ScrollView>
    <SafeAreaView
      style={{ flex: 1 }}
      forceInset={{ top: "always", horizontal: "never" }}
    >
      <View
        style={{
          height: 150,
          backgroundColor: "#292F6D",
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <Image
          style={{ height: 100, width: 100 }}
          source={require("./src/assets/shadow_scout.png")}
        />
        <Text style={{ color: "white" }}>Theory Scout</Text>
      </View>
      <DrawerItems {...props} />
    </SafeAreaView>
  </ScrollView>
);

const AppDrawerNavigator = createDrawerNavigator(
  {
    Dashboard: {
      screen: DashboardStackNavigator
    },
    Settings: {
      screen: SettingsScreen
    },  
    Scan: {
      screen: QrCodeReader
    }
  },
  {
    contentComponent: CustomDrawerContentComponent
  }
);

const AppSwitchNavigator = createSwitchNavigator({
  WelcomeScreen: {
    screen: WelcomeScreen
  },
  Dashboard: {
    screen: AppDrawerNavigator
  }
});

const AppContainer = createAppContainer(AppSwitchNavigator);
