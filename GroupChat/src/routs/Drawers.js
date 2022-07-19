import "react-native-gesture-handler";
import { createDrawerNavigator } from "@react-navigation/drawer";
import Dashboard from "../components/Dashboard";
import Chats from "../components/Chats";
import Upload from "../components/Upload";
import Users from "../components/Users";
import CustomDrawer from "../components/CustomDrawer";
import Icons from "react-native-vector-icons/Ionicons";

const Drawer = createDrawerNavigator();

const DrawerHandeler = () => {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawer {...props} />}
      initialRouteName="Dashboard"
      screenOptions={{
        drawerLabelStyle: { marginLeft: -20, fontSize: 18 },
        drawerActiveBackgroundColor: "#FA0309",
        drawerActiveTintColor: "#fff",
        drawerInactiveTintColor: "#33333",
      }}
    >
      <Drawer.Screen
        name="Dashboard"
        component={Dashboard}
        options={{
          drawerIcon: ({ color }) => (
            <Icons name="home-outline" size={24} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Chats"
        component={Chats}
        options={{
          drawerIcon: ({ color }) => (
            <Icons name="chatbox-ellipses-outline" size={24} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Users"
        component={Users}
        options={{
          drawerIcon: ({ color }) => (
            <Icons name="person-outline" size={24} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Uploads"
        component={Upload}
        options={{
          drawerIcon: ({ color }) => (
            <Icons name="arrow-up-circle-outline" size={24} color={color} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
};

export default DrawerHandeler;
