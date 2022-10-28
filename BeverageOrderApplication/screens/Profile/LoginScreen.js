import React, { Component } from "react";
import { SafeAreaView, StyleSheet, Text, TouchableNativeFeedback, View, TextInput, ScrollView, Alert } from 'react-native';
import AppButton from "../Component/AppButton";
import InputWithLabel from "../Component/InputWithLabel";
import AsyncStorage from '@react-native-async-storage/async-storage';

let config = require('../../Config');

export default class App extends Component {

  constructor(props) {
    super(props)


    this.state = {
      label: '',
      placeholder: '',

      phoneNumber: '',
      password: '',

      users: [],
      isFetching: false,

      phoneMessage: false,     
      passwordMessage: false,    
      loading: false, 
            
    }

    this._verify = this._verify.bind(this);
    this._verifyUser = this._verifyUser.bind(this);
  }

  _verify() {
    let url = config.settings.serverPath + '/api/user';
    this.setState({ isFetching: true });

    fetch(url)
      .then(response => {
        // console.log(response);
        if (!response.ok) {
          Alert.alert('Error:', response.status.toString());
          throw Error('Error ' + response.status);
        }
        this.setState({ isFetching: false });
        return response.json();
      })
      .then(users => {
        console.log(users);
        this.setState({ users: users });

        this._verifyUser()

      })
      .catch(error => {
        console.log(error);
      });
  }

  async _saveSettings(item) {
    try {
      await AsyncStorage.setItem('userId', item.id.toString());
      console.log(item.id.toString())
    } catch (error) {
      console.log('## ERROR SAVING ITEM ##: ', error);
    }
  }

  _verifyUser = async() => {
    this.state.users.map((item, index) => {

      if (this.state.phoneNumber == item.phoneNumber && this.state.password === item.password) {
        console.log("Login SucessFul");
        
        // try {
        //   // await AsyncStorage.multiSet([['id',item.id],['username',item.username],['phoneNumber',item.phoneNumber],['dateOfBirth', item.dateOfBirth], ['ICNumber', item.securityQuestion]]);
        //   await AsyncStorage.setItem([['id',item.id]]);
        // } catch (error) {
        //   console.log('## ERROR SAVING ITEM ##: ', error);
        // }

      //   try{
      //     var user = {
      //       ID: item.id,
      //     };
      //   await AsyncStorage.setItem('UserID', JSON.stringify(user.ID))
        
      // }catch(error){
      //     console.log('setItem error')
      //   }

        this._saveSettings(item);
        this.props.route.params.update();

        

      } else {
        console.log("Login Failed");
        
      }
      

    })
  }

  authentication = async () => {
    this.setState({ loading: true })
    const { phoneNumber, password } = this.state;
    let errorFlag = false;
    // input validation
    if (phoneNumber) {
      errorFlag = true;
      this.setState({ phoneMessage: false });
    } else {
      errorFlag = false;
      this.setState({ phoneMessage: true })
    }

    if (password) {
      errorFlag = true;
      this.setState({ passwordMessage: false });
    } else {
      errorFlag = false;
      this.setState({ passwordMessage: true })
    }
    
    if (errorFlag) {
      console.log("errorFlag");

    } else {
      this.setState({ loading: false });
    }
  }
  render() {

    return (

      <View>

        <ScrollView>
          <View style={styles.root}>

            {/* <Image 
                source={Logo} 
                style={[styles.logo, {height: height * 0.3}]}
                resizeMode="contain"/> */}

            <InputWithLabel
              label={"Phone"}
              placeholder={"Enter Phone Number"}
              value={this.state.phoneNumber}
              onChangeText={(phoneNumber) => this.setState({ phoneNumber })}
              keyboardType="number-pad"
              secureTextEntry={false} />
              {this.state.phoneMessage && <Text style={styles.textDanger}>{"Phone Number is required"}</Text>}

            <InputWithLabel
              label={"Password"}
              placeholder="Password"
              value={this.state.password}
              onChangeText={(password) => this.setState({ password })}
              secureTextEntry={true} />
              {this.state.passwordMessage && <Text style={styles.textDanger}>{"Password is required"}</Text>}

            <AppButton
              title={"Login"}
              theme={'primary'}
              onPress={async () => {
                await this._verify();
                this._verifyUser();
                this.authentication();
              }
              }
              type="default"
            />

            <AppButton
              title={"Forgot password"}
              theme={'tertiary'}
              onPress={() => this.props.navigation.navigate("ForgotPassword")}
              type="colorChangeForTertiary"
            />

            <AppButton
              title={"Don't have any account? Create one"}
              theme={'tertiary'}
              onPress={() => { this.props.navigation.navigate("Register", {}) }}
              type="colorChangeForTertiary"
            />


          </View>
        </ScrollView>


      </View>
    )

  }
}


const styles = StyleSheet.create({
  root: {
    // alignItems: 'center',
    padding: 20,
  },

  logo: {
    width: '70%',
    maxWidth: 500,
    maxHeight: 200,
    height: 100,
  },

  textDanger: {
    color: "#dc3545"
  }
})