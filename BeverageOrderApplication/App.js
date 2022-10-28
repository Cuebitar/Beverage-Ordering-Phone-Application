
import React, {Component} from 'react';
import {
   StyleSheet, View, TouchableOpacity
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem, DrawerItemList } from '@react-navigation/drawer';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MenuPage from './screens/Admin/MenuPage';
import AddItem from './screens/Admin/AddItem';
import EditPage from './screens/Admin/EditMenu';
import ViewPage from './screens/Admin/ViewMenu';

import OrderPage from './screens/Admin/OrderPage';
import ViewOrder from './screens/Admin/ViewOrder';

import CartScreen from './screens/User/CartScreen';
import OrderDetailsScreen from './screens/User/OrderDetailsScreen';
import OrderHistoryScreen from './screens/User/OrderHistoryScreen';
import AddToCart from './screens/User/AddToCart';
import LoginScreen from './screens/Profile/LoginScreen';
import RegisterScreen from './screens/Profile/RegisterScreen';
import ForgotPassword from './screens/Profile/ForgotPasswordScreen';
import HomeScreen from './screens/User/HomeScreen';
import ProfileScreen from './screens/Profile/ProfileScreen';
import NewPassword from './screens/Profile/NewPasswordScreen';
import EditPasswordScreen from './screens/Profile/EditPasswordScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';


const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
let common = require('./CommonData');

  class MenuNavigator extends Component {
    render() {
      return(
          
          <Stack.Navigator>
          <Stack.Screen
              name="MenuPage"
              component={MenuPage}
              options={{headerShown: false}}
          />
          <Stack.Screen
              name="AddItem"
              component={AddItem}
              options={{headerShown: false}}
          />
          <Stack.Screen
              name="EditPage"
              component={EditPage}
              options={{headerShown: false}}
          />
          <Stack.Screen
              name="ViewPage"
              component={ViewPage}
              options={{headerShown: false}}
           />
          </Stack.Navigator>
      );
    }
 }

 class OrderNavigator extends Component {
  render() {
    return(
        <Stack.Navigator>
        <Stack.Screen
            name="OrderPage"
            component={OrderPage}
            options={{headerShown: false}}
        />
        <Stack.Screen
            name="ViewOrder"
            component={ViewOrder}
            options={{headerShown: false}}
        />
        
        </Stack.Navigator>
    );
  }
}

class PlaceOrder extends Component {
  render() {
    return(
      <Stack.Navigator>
        <Stack.Screen
        name="Cart" component={CartScreen} options={styles.headerStyleOption}
        />
        <Stack.Screen
        name="Order Details" component={OrderDetailsScreen} options={styles.headerStyleOption}
        />
        <Stack.Screen
        name="Order History" 
        component={OrderHistoryScreen} 
        options={{headerShown: false}}
        initialParams = {{userId: App}}
        />
      </Stack.Navigator>
    );
  }
}

class OrderHistory extends Component {

  render() {
    return(
      <Stack.Navigator>
        <Stack.Screen
        name="Order History" 
        component={OrderHistoryScreen} 
        options={{headerShown: false}}
        initialParams = {{userId: App}}
        />
        <Stack.Screen
        name="Order Details" component={OrderDetailsScreen} options={styles.headerStyleOption}
        />
      </Stack.Navigator>
    );
  }
}

class Menu extends Component {
  render() {
    return(
      <Stack.Navigator>
        <Stack.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{headerShown: false}}
        />
        <Stack.Screen 
        name="Add Beverage" 
        component={AddToCart} 
        options={{headerShown: false}}
        />
      </Stack.Navigator>
    );
  }
}

class UserProfile extends Component {
  render() {
    return(
      <Stack.Navigator>
        <Stack.Screen
        name="ProfileDetails"
        component={ProfileScreen}
        options={styles.HeaderOptionsStyle}
        />
        <Stack.Screen 
        name= "EditPassword" 
        component={EditPasswordScreen}
        initialParams = {{_refresh: this._readUserRegistration,}}
        />
      </Stack.Navigator>
    );
  }
}

export default class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      userId: 0,
    }
    this._readUserRegistration = this._readUserRegistration.bind(this);
  }

  async _readUserRegistration() {
    try {
      let userId = await AsyncStorage.getItem('userId');
      if (userId !== null) {
        this.setState({ userId: parseInt(userId) });
      }
    } catch (error) {
      console.log("ERROR READING ITEMS", error);
    }
  }

  async _userSignOut() {
    try {
      let keys = await AsyncStorage.getAllKeys();
      await AsyncStorage.removeItem(keys);
    } catch (error) {
      console.log("ERROR READING ITEMS", error);
    }
    this.setState({userId: 0});
  }

  componentDidMount() {
    this._readUserRegistration();
  }

  render() {

    if (this.state.userId === 0) {
      return(
        <NavigationContainer initialRouteName= "OrderPage">
      <Stack.Navigator screenOptions={{headerShown: false}}>
                
                <Stack.Screen 
                name= "Login" 
                component={LoginScreen}
                initialParams = {{update: this._readUserRegistration,}}
                />
                <Stack.Screen name= "Register" component={RegisterScreen}
                              initialParams = {{_refresh: this._readUserRegistration,}}/>
                <Stack.Screen name= "ForgotPassword" component={ForgotPassword}/>
                <Stack.Screen name= "NewPassword" component={NewPassword}
                initialParams = {{_refresh: this._readUserRegistration,}}/>
            </Stack.Navigator>
            </NavigationContainer>
      );
    }
    else if (this.state.userId === 1) {
      return (
        <NavigationContainer initialRouteName= "OrderNavigator">
          <Drawer.Navigator
        drawerStyle={{width: '45%', backgroundColor: 'purple'}}
        drawerType="slide"
        overlayColor="transparent"
        screenOptions={{
          drawerActiveTintColor: 'darkslateblue',
          drawerActiveBackgroundColor: 'skyblue',
        }}
        drawerContent={props => {
          return (
            <DrawerContentScrollView {...props}>
              <DrawerItemList {...props} />
              <DrawerItem label="Logout" onPress={() => this._userSignOut()} />
            </DrawerContentScrollView>
          )
        }}
        >
          
          <Drawer.Screen
            name="OrderNavigator"
            component={OrderNavigator}
            options={styles.HeaderOptionsStyle}
          />
          <Drawer.Screen
            name="MenuNavigator"
            component={MenuNavigator}
            options={styles.HeaderOptionsStyle}
          />
          <Drawer.Screen
            name="Profile"
            component={UserProfile}
            options={styles.HeaderOptionsStyle}
          />
          
        </Drawer.Navigator>
        
        </NavigationContainer>
      );
    }
    else {
      return (
        <NavigationContainer initialRouteName= "Home">
          <Drawer.Navigator initialRouteName="Home"
          drawerContent={props => {
            return (
              <DrawerContentScrollView {...props}>
                <DrawerItemList {...props} />
                <DrawerItem label="Logout" onPress={() => this._userSignOut()} />
              </DrawerContentScrollView>
            )
          }}>
          <Drawer.Screen 
          name="Home" 
          component={Menu} 
          options={({ navigation }) => ({
            headerRight: () => (
              <TouchableOpacity style={styles.rowView} onPress={() => navigation.navigate('Cart')}>
                <Ionicons name="md-cart-sharp" size={25} color='black' />
                </TouchableOpacity>
            ),
          })}
          ></Drawer.Screen>
          <Drawer.Screen name="Cart" component={PlaceOrder} options={styles.headerStyleOption}></Drawer.Screen>
          <Drawer.Screen name="History" component={OrderHistory} options={styles.headerStyleOption} ></Drawer.Screen>
          <Drawer.Screen
            name="Profile"
            component={UserProfile}
            options={styles.HeaderOptionsStyle}
          />
        </Drawer.Navigator>
          
        </NavigationContainer>
      );
    }
    
  }

  
}

 const styles = StyleSheet.create({
  HeaderOptionsStyle: {
    headerStyle: {
      backgroundColor: '#F08080',
    },
    headerTintColor: '#fff',
    headerTitleStyle: {
      fontWeight: 'bold',
    },
  },
  rowView: {
    marginRight: 10,
  },
 });