import React, {Component} from 'react';
import {View, SafeAreaView, Text, StyleSheet, TouchableHighlight, Alert} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import {FloatingAction} from 'react-native-floating-action';
import AppButton from '../Component/AppButton';
import NewPasswordScreen from './NewPasswordScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';

let config = require('../../Config');

export default class ProfileScreen extends Component{

    constructor(props){
        super(props);

        this.state = {
            id: '',
            username:'',
            phoneNumber:'',
            dateOfBirth: '',
            securityQuestion:'',
        }
    }

    async _readSettings() {
        try {
            let userId = await AsyncStorage.getItem('userId');
            if (userId !== null) {
              this.setState({ id: parseInt(userId) });
            }
          } catch (error) {
            console.log("ERROR READING ITEMS", error);
          }

        
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
            this.setState({
                username: user.name,
                phoneNumber: user.phoneNumber, 
                dateOfBirth: user.DOB,
                securityQuestion: user.securityQuestion,
                password: user.password,
                id: user.id,
            });
          })
          .catch(error => {
            console.error(error);
          });
      }


    async componentDidMount(){
        await this._readSettings();
        this._loadByID();      
    }

    render(){
        if(this.state.id != 1) {
        return(
        
        <SafeAreaView style={styles.container}>
            <View style={styles.userInfoSection}>
                <View style={{flexDirection: 'row', marginTop: 30}}>
                    

                    <View style={{marginLeft: 20}}>
                        <Text style={[styles.title, {marginTop:15, marginBottom:5}]}>{this.state.username}</Text>
                    </View>
                
                </View>
            </View>


            <View style={styles.userInfoSection}>
                <View style={styles.row}>
                    
                    <Text style={styles.detailFontSize}>PhoneNumber:</Text>
                    <Text style={[styles.detailFontSize,{color:'#777777', marginLeft: 20}]}>{this.state.phoneNumber}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.detailFontSize}>DateOfBirth:</Text>
                    <Text style={[styles.detailFontSize,{color:'#777777', marginLeft: 20}]}>{this.state.dateOfBirth}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.detailFontSize}>IC Number:</Text>
                    <Text style={[styles.detailFontSize,{color:'#777777', marginLeft: 20}]}>{this.state.securityQuestion}</Text>
                </View>

                <View>
                    <AppButton
                        title={"Edit password"}
                        theme={'primary'}
                        onPress={() => {this.props.navigation.navigate("EditPassword" , {id: this.state.id})}}
                        type="default"
                    
                    />
                </View>
                
            </View>       
        </SafeAreaView>


            
        );
        }
        else {
            return (
            <SafeAreaView style={styles.container}>
            <View style={styles.userInfoSection}>
                <View style={{flexDirection: 'row', marginTop: 30}}>
                    

                    <View style={{marginLeft: 20}}>
                        <Text style={[styles.title, {marginTop:15, marginBottom:5}]}>{this.state.username}</Text>
                    </View>
                
                </View>
            </View>


            <View style={styles.userInfoSection}>
                <View style={styles.row}>
                    
                    <Text style={styles.detailFontSize}>PhoneNumber:</Text>
                    <Text style={[styles.detailFontSize,{color:'#777777', marginLeft: 20}]}>{this.state.phoneNumber}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.detailFontSize}>DateOfBirth:</Text>
                    <Text style={[styles.detailFontSize,{color:'#777777', marginLeft: 20}]}>{this.state.dateOfBirth}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.detailFontSize}>IC Number:</Text>
                    <Text style={[styles.detailFontSize,{color:'#777777', marginLeft: 20}]}>{this.state.securityQuestion}</Text>
                </View>
                
            </View>       
        </SafeAreaView> 
            );
        }
    }
}

const styles = StyleSheet.create({
    container:{
        flex:1,
    },

    detailFontSize:{
        fontSize:20,
    },

    userInfoSection:{
        paddingHorizontal: 30,
        marginBottom: 25,
    },

    title:{
        fontSize: 24,
        fontWeight: 'bold'
    },

    caption:{
        fontSize:14,
        lineHeight: 14,
        fontWeight: '500'
    },

    row:{
        flexDirection: 'row',
        marginBottom: 10,
    },

    inforBoxWrapper:{
        borderBottomColor: 'dddddd',
        borderBottomWidth: 1,
        borderTopColor: 'dddddd',
        borderTopWidth: 1,
        flexDirection: 'row',
        height: 100,
    },

    infoBox: {
        width: '50%',
        alignItem: 'center',
        justifyContent: 'center'
    },

    menuWrapper:{
        marginTop: 10,

    },

    menuItemtext:{
        color:'777777',
        marginLeft:20,
        fontWeight:'600',
        fontSize:16,
        lineHeight:26,
    }

});