import React, {Component} from "react";
import {SafeAreaView, StyleSheet, Text,View, TextInput, ScrollView, KeyboardAvoidingView} from 'react-native';
import AppButton from "../Component/AppButton";
import InputWithLabel from "../Component/InputWithLabel";
let config = require('../../Config');

export default class ForgotPasswordScreen extends Component{

    constructor(props){
        super(props)

        this.state={
            forgotPassword: '',

            forgotPasswordMessage: false,
            forgotPasswordMessageContent: '',

            users: [],
            isFetching: false,
        }

        this._verifyIC = this._verifyIC.bind(this);
    }

    _verify() {
        let url = config.settings.serverPath + '/api/user';
        this.setState({isFetching: true});
        
        fetch(url)
          .then(response => {
            // console.log(response);
            if (!response.ok) {
              Alert.alert('Error:', response.status.toString());
              throw Error('Error ' + response.status);
            }
            this.setState({isFetching: false});
            return response.json();
          })
          .then(users => {
            console.log(users);
            this.setState({users: users});
            
            this._verifyIC()
          })
          .catch(error => {
            console.log(error);
          });
      }

      _verifyIC(){
        this.state.users.map ((item, index) => {

            console.log(item.securityQuestion);
    
          if(this.state.forgotPassword === item.securityQuestion.toString()){
            //   this.props.route.params.userId = item.id;
            // console.log(item.id)
              this.props.navigation.navigate("NewPassword", {id: item.id})
          }else{
              console.log("Security Question no match")
              this._ICWarningMessage();
          }
          
        })
      }

      _ICWarningMessage(){

        const {forgotPassword} = this.state;
        let errorFlag = false;
        let ICReg = /^\d{2}(0[1-9]|1[012])(0[1-9]|[12][0-9]|3[01])\d{6}$/;

        if(forgotPassword.length === 0){
          errorFlag = false;
          this.setState({ forgotPasswordMessage: true })
          this.setState({ forgotPasswordMessageContent: 'IC is required'})
        }
        else if(forgotPassword.match(ICReg) === null){
          errorFlag = false;
          this.setState({ forgotPasswordMessage: true })
          this.setState({ forgotPasswordMessageContent: 'IC should be in correct format'})
        }
        else {
          errorFlag = false;
          this.setState({ forgotPasswordMessage: true })
          this.setState({ forgotPasswordMessageContent: 'IC not found'})
        }
      }


    

    render(){
        return(
        
        <ScrollView showsVerticalScrollIndicator={false}>
            
            <View style ={styles.root}>
               
               <Text style={styles.title}>Reset your password</Text>
                
                <InputWithLabel             
                    label={"What is your IC number?"}
                    placeholder="eg:0105010109999"
                    value={this.state.forgotPassword}
                    onChangeText={(forgotPassword) => this.setState({forgotPassword})}
                    secureTextEntry = {false}  
                />
                {this.state.forgotPasswordMessage && <Text style={styles.textDanger}>{this.state.forgotPasswordMessageContent}</Text>}
    
                <AppButton
                    title={"Send"}
                    theme={'primary'}
                    onPress={() => {this._verify()}}
                    type="default"
                />
    
                <AppButton
                    title={"Back to Login"}
                    theme={'tertiary'}
                    onPress={() => this.props.navigation.goBack()}
                    type="colorChangeForTertiary"
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