import React, {Component, useState} from "react";
import {SafeAreaView, StyleSheet, Text, TouchableNativeFeedback, View, TextInput, ScrollView, KeyboardAvoidingView, Alert, Keyboard} from 'react-native';
import AppButton from "../Component/AppButton";
import InputWithLabel from "../Component/InputWithLabel";



let config = require('../../Config');

// const handleValidPhone = val => {
//   let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
  
//   if (val.length === 0) {
//     setEmailValidError('phone number must be enter');
//   } else if (reg.test(val) === false) {
//     setEmailValidError('enter valid email address');
//   } else if (reg.test(val) === true) {
//     setEmailValidError('');
//   }
//   };

export default class RegisterScreen extends Component{

    constructor(props){
        super(props)

        this.state={
            username: '',
            phoneNumber: '',
            dateOfBirth: '',
            securityQuestion: '',
            password: '',
            repeatPassword: '',

            usernameMessageContent: '',
            phoneMessageContent: '',
            dateOfBirthMessageContent: '',
            securityQuestionMessageContent: '',
            passwordMessageContent: '',
            repeatPasswordMessageContent: '',

            usernameMessage: false,
            phoneMessage: false,
            dateOfBirthMessage: false,
            securityQuestionMessage: false,
            passwordMessage: false,
            repeatPasswordMessage: false,

            
            loading: false,
        };

        this._insert = this._insert.bind(this);
        this._authentication = this._authentication.bind(this);
    }
    
    _insert() {
        let url = config.settings.serverPath + '/api/user';

        let result = this._authentication()
    
        if(result == false){
        console.log('Please match all input validation')
        
        }else{
          fetch(url, {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              name: this.state.username,
              phoneNumber: this.state.phoneNumber,
              DOB: this.state.dateOfBirth,
              securityQuestion: this.state.securityQuestion,
              password: this.state.password,
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
                Alert.alert('Record SAVED for', this.state.username);
              } else {
                Alert.alert('Error in SAVING');
              }
              this.props.route.params._refresh();
              this.props.navigation.goBack();
            })
            .catch(error => {
              console.log(error);
            });
        }

        // if(result == true){
        //   fetch(url, {
        //         method: 'POST',
        //         headers: {
        //           Accept: 'application/json',
        //           'Content-Type': 'application/json',
        //         },
        //         body: JSON.stringify({
        //           name: this.state.username,
        //           phoneNumber: this.state.phoneNumber,
        //           DOB: this.state.dateOfBirth,
        //           securityQuestion: this.state.securityQuestion,
        //           password: this.state.password,
        //         }),
                
        //       })
        //         .then(response => {
        //           console.log(response);
        //           if (!response.ok) {
        //             Alert.alert('Error:', response.status.toString());
        //             throw Error('Error ' + response.status);
        //           }
          
        //           return response.json();
        //         })
        //         .then(respondJson => {
        //           if (respondJson.affected > 0) {
        //             Alert.alert('Record SAVED for', this.state.username);
        //           } else {
        //             Alert.alert('Error in SAVING');
        //           }
        //           this.props.route.params._refresh();
        //           this.props.navigation.goBack();
        //         })
        //         .catch(error => {
        //           console.log(error);
        //         });
        // }else{
        //   console.log('Please match all input validation')
        // }
      }

      _authentication = () => {
        this.setState({ loading: true })
        const { username, phoneNumber, dateOfBirth, securityQuestion, password, repeatPassword} = this.state;
        
        let errorFlag = false;

        let phoneReg = /^(01)[0-46-9]*[0-9]{7,8}$/
        let DOBReg = /(^(((0[1-9]|1[0-9]|2[0-8])[\/](0[1-9]|1[012]))|((29|30|31)[\/](0[13578]|1[02]))|((29|30)[\/](0[4,6,9]|11)))[\/](19|[2-9][0-9])\d\d$)|(^29[\/]02[\/](19|[2-9][0-9])(00|04|08|12|16|20|24|28|32|36|40|44|48|52|56|60|64|68|72|76|80|84|88|92|96)$)/
        let ICReg = /^\d{2}(0[1-9]|1[012])(0[1-9]|[12][0-9]|3[01])\d{6}$/
        let passwordReg = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/
        
        // input validation
        if (username.length >=1 && username.length < 6) {
        
          errorFlag = false;
          this.setState({ usernameMessage: true })
          this.setState({ usernameMessageContent: 'Username length should more than 6'})

        }
        else if(username.length === 0){
          errorFlag = false;
          this.setState({ usernameMessage: true })
          this.setState({ usernameMessageContent: 'Username is required'})
        }
        else {
          errorFlag = true;
          this.setState({ usenameMessage: false});
        }



        if(phoneNumber.length === 0){
          errorFlag = false;
          this.setState({ phoneMessage: true })
          this.setState({ phoneMessageContent: 'Phone number is required'})
        }
        else if(phoneNumber.match(phoneReg) === null){
          errorFlag = false;
          this.setState({ phoneMessage: true })
          this.setState({ phoneMessageContent: 'Phone number should be in correct format'})
        }
        else if(phoneNumber.length > 11){
          errorFlag = false;
          this.setState({ phoneMessage: true })
          this.setState({ phoneMessageContent: 'Phone number cannot more than 11 number'})
        }
        else {
          errorFlag = true;
          this.setState({ phoneMessage: false});
        }



        if(dateOfBirth.length === 0){
          errorFlag = false;
          this.setState({ dateOfBirthMessage: true })
          this.setState({ dateOfBirthMessageContent: 'Date of birth is required'})
        }
        else if (dateOfBirth.match(DOBReg) === null) {
        
          errorFlag = false;
          this.setState({ dateOfBirthMessage: true })
          this.setState({ dateOfBirthMessageContent: 'Date of birth should be in correct format'})

        }
        else {
          errorFlag = true;
          this.setState({ dateOfBirthMessage: false});
        }



        if(securityQuestion.length === 0){
          errorFlag = false;
          this.setState({ securityQuestionMessage: true })
          this.setState({ securityQuestionMessageContent: 'Security question is required'})
        }
        else if(securityQuestion.match(ICReg) === null){
          errorFlag = false;
          this.setState({ securityQuestionMessage: true })
          this.setState({ securityQuestionMessageContent: 'IC should be in correct format'})
        }
        else {
          errorFlag = true;
          this.setState({ securityQuestionMessage: false});
        }



        if(password.length === 0){
          errorFlag = false;
          this.setState({ passwordMessage: true })
          this.setState({ passwordMessageContent: 'Password is required'})
        }
        else if(password.match(passwordReg) === null){
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
          this.setState({ repeatPasswordMessageContent: 'password is required'})
        }
        else if(repeatPassword.match(passwordReg) === null){
          errorFlag = false;
          this.setState({ repeatPasswordMessage: true })
          this.setState({ repeatPasswordMessageContent: 'Password should be in correct format (8 character, at least 1 letter, 1 number)'})
        }
        else if(repeatPassword !== password){
          errorFlag = false;
          this.setState({ repeatPasswordMessage: true })
          this.setState({ repeatPasswordMessageContent: 'password should be same'})
        }
        else {
          errorFlag = true;
          this.setState({ repeatPasswordMessage: false});
        }



        if (errorFlag == true) {
          console.log("noError");
          return true;
        } else {
          this.setState({ loading: false });
          console.log("error")
          return false;
        }

      }


    render(){       
      
        return(

            <ScrollView>
                
                <KeyboardAvoidingView style={styles.root}>

                <Text style={styles.title}>Create an account</Text>

                <InputWithLabel
                    label={"Username"}
                    placeholder="Enter username"
                    value={this.state.username}
                    onChangeText={(username) => this.setState({username})}
                    secureTextEntry = {false}  
                />
                {this.state.usernameMessage && <Text style={styles.textDanger}>{this.state.usernameMessageContent}</Text>}

                <InputWithLabel
                    label={"Phone Number"}
                    placeholder="eg: 0187766332"
                    value={this.state.phoneNumber}
                    onChangeText={(phoneNumber) => this.setState({phoneNumber})}
                    secureTextEntry = {false}
                />
                {this.state.phoneMessage && <Text style={styles.textDanger}>{this.state.phoneMessageContent}</Text>}
                

                <InputWithLabel
                    label={"Date Of Birth"}
                    placeholder="dd/mm/yyyy"
                    value={this.state.dateOfBirth}
                    onChangeText={(dateOfBirth) => this.setState({dateOfBirth})}
                    secureTextEntry = {false}
                />
                 {this.state.dateOfBirthMessage && <Text style={styles.textDanger}>{this.state.dateOfBirthMessageContent}</Text>}

                <InputWithLabel
                    label={"Security Question"}
                    placeholder="What is your ic number?"
                    value={this.state.securityQuestion}
                    onChangeText={(securityQuestion) => this.setState({securityQuestion})}
                    secureTextEntry = {false}
                />
                 {this.state.securityQuestionMessage && <Text style={styles.textDanger}>{this.state.securityQuestionMessageContent}</Text>}

                <InputWithLabel
                    label={"Password"}
                    placeholder="At least 8 character(1letter ,1number)"
                    value={this.state.password}
                    onChangeText={(password) => this.setState({password})}
                    secureTextEntry = {true}
                />
                 {this.state.passwordMessage && <Text style={styles.textDanger}>{this.state.passwordMessageContent}</Text>}

                <InputWithLabel
                    label={"Repeat Password"}
                    placeholder="At least 8 character(1letter ,1number)"
                    value={this.state.repeatPassword}
                    onChangeText={(repeatPassword) => this.setState({repeatPassword})}
                    secureTextEntry = {true}
                />
                 {this.state.repeatPasswordMessage && <Text style={styles.textDanger}>{this.state.repeatPasswordMessageContent}</Text>}

                <AppButton
                    title={"Register"}
                    theme={'primary'}
                    // onPress={this._insert()}
                    onPress={async () => {
                      this._insert()

                      // let result = this._authentication
                      // if(result == true){
                      //   this._insert
                      // }
                    }
                    }
                    type="default"
                />

                <AppButton
                    title={"Have an account? Sign In"}
                    theme={'tertiary'}
                    onPress={() => {this.props.navigation.goBack();}}
                    type="colorChangeForTertiary"
                />

                </KeyboardAvoidingView>
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