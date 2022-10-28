import { useScrollToTop } from "@react-navigation/native";
import React, {Component} from "react";
import {SafeAreaView, StyleSheet, Text,View, TextInput, ScrollView, KeyboardAvoidingView, Alert} from 'react-native';
import AppButton from "../Component/AppButton";
import InputWithLabel from "../Component/InputWithLabel";

let config = require('../../Config');


export default class NewPasswordScreen extends Component{

    constructor(props){
        super(props)

        this.state={
            //receive
            id: this.props.route.params.id,

            password: '',
            
            //onchange
            newPassword: '',
            repeatPassword: '',


            passwordMessage: false,
            repeatPasswordMessage: false,

            passwordMessageContent: '',
            repeatPasswordMessageContent: '',

        }

        this._edit = this._edit.bind(this);
        this._loadByID = this._loadByID.bind(this);
    }

    _loadByID() {                                                 
        let url = config.settings.serverPath + '/api/user/' + this.state.id;
        console.log(url);
        fetch(url)
          .then(response => {
            if (!response.ok) {
              Alert.alert('Error:', response.status.toString());
              throw Error('Error ' + response.status);
            }
            return response.json();
          })
          .then(user => {
            console.log(user);
            this.setState({
                password: user.password,
                // passwordRepeat: user.passwordRepeat,
                id: user.id,
            });
          })
          .catch(error => {
            console.error(error);
          });
      }

      _edit() {                                                  
        let url = config.settings.serverPath + '/api/user/' + this.state.id; //this one show the correct url
        console.log(url)
    
        let result = this._passwordVerification()
    
        if(result == false){
        console.log('Please match all input validation')
        
        }else{
        fetch(url, {
          method: 'PUT',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            password: this.state.newPassword,
            id: this.state.id
          }),
        })
          .then(response => {
            console.log(response);
            if (!response.ok) {
              Alert.alert('Error:', response.status.toString());
              throw Error('Error ' + response.status);
            }
    
            return response.json();
          })
          .then(respondJson => {
            if (respondJson.affected > 0) {
              Alert.alert('Password UPDATED');
            } else {
              Alert.alert('Error in UPDATING');
            }
            this.props.route.params._refresh();
            this.props.navigation.navigate("Login");
          })
          .catch(error => {
            console.log(error);
          });
        }
      }

      _passwordVerification(){

        const {newPassword, repeatPassword} = this.state;
        
        let errorFlag = false;
        let passwordReg = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

        if(newPassword.length === 0){
          errorFlag = false;
          this.setState({ passwordMessage: true })
          this.setState({ passwordMessageContent: 'Password is required'})
        }
        else if(newPassword.match(passwordReg) === null){
          errorFlag = false;
          this.setState({ passwordMessage: true })
          this.setState({ passwordMessageContent: 'Password should be in correct format (8 character, at least 1 letter, 1 number)'})
        }
        else {
          errorFlag = true;
          this.setState({ passwordMessage: false});
        }


        if(repeatPassword.length === 0){
          errorFlag = false;
          this.setState({ repeatPasswordMessage: true })
          this.setState({ repeatPasswordMessageContent: 'Repeat password is required'})
        }
        else if(repeatPassword.match(passwordReg) === null){
          errorFlag = false;
          this.setState({ repeatPasswordMessage: true })
          this.setState({ repeatPasswordMessageContent: 'Password should be in correct format (8 character, at least 1 letter, 1 number)'})
        }
        else if(repeatPassword !== newPassword){
          errorFlag = false;
          this.setState({ repeatPasswordMessage: true })
          this.setState({ repeatPasswordMessageContent: 'Password should be same'})
        }
        else{
          errorFlag = true;
          this.setState({ repeatPasswordMessage: false});
        }


        if (errorFlag == true) {
          console.log("noError");
          return true;
        } else {
          console.log("error")
          return false;
        }
      }

      componentDidMount() {
        this._loadByID()
      }

    render(){
        return(
        
        <ScrollView showsVerticalScrollIndicator={false}>
            
            <View style ={styles.root}>
               
               <Text style={styles.title}>Enter your password</Text>
                
                <InputWithLabel             
                    label={"New Password"}
                    placeholder="password"
                    value={this.state.newPassword}
                    onChangeText={(newPassword) => this.setState({newPassword})}
                    secureTextEntry = {true}  
                />
                {this.state.passwordMessage && <Text style={styles.textDanger}>{this.state.passwordMessageContent}</Text>}

                <InputWithLabel             
                    label={"Password Confirmation"}
                    placeholder="password"
                    value={this.state.repeatPassword}
                    onChangeText={(repeatPassword) => this.setState({repeatPassword})}
                    secureTextEntry = {true}  
                />
                {this.state.repeatPasswordMessage && <Text style={styles.textDanger}>{this.state.repeatPasswordMessageContent}</Text>}
    
                <AppButton
                    title={"Submit"}
                    theme={'primary'}
                    onPress={() => {this._edit()}}
                    type="default"
                />
    
            </View>
            </ScrollView>
        );
        
        
    }
}

const styles = StyleSheet.create({
    root:{
        
        padding: 20,
    },

    logo:{
        width: '70%',
        maxWidth: 500,
        maxHeight: 200,
        height: 100,
    },

    title:{
        textAlign: 'center',
        fontSize: 24,
        fontWeight: 'bold',
        color: '#051C60',
        margin: 10,
    },

    textDanger: {
      color: "#dc3545"
    }
})