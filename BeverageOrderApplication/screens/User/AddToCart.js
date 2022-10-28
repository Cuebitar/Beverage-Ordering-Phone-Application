import React, {Component} from 'react';
import {View, Text,StyleSheet, Alert, TextInput} from "react-native";
import SelectList from 'react-native-dropdown-select-list'
import { ScrollView } from 'react-native-gesture-handler';
import {InputWithPicker, InputWithLabel, MultiLineInputWithLabel, AppButton, ExitBar} from '../../UI';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Font from 'react-native-vector-icons'
let config = require('../../Config');
let common = require('../../CommonData');

export default class AddToCart extends Component {

  constructor(props) {
    super(props);
    this.state = {
      beverageID: this.props.route.params.beverageId,
      quantity: 1,
      sugerLevel: 'Normal Sugar',
      iceLevel: 'Normal Ice',
      beverage: {},
      beverageList: [],
    };
    this._getBeverageDetails = this._getBeverageDetails.bind(this);
    this._readBeverageList = this._readBeverageList.bind(this); 
    this._saveBeverageList = this._saveBeverageList.bind(this);
  }

  async _readBeverageList() {
    try {
      let beverageList = await AsyncStorage.getItem('beverageList');
      if (beverageList !== null) {
        this.setState({ beverageList: JSON.parse(beverageList) });
      }
    } catch (error) {
      console.log("ERROR READING ITEMS", error);
    }
  }

  async _saveBeverageList() {
    try {
      await AsyncStorage.setItem('beverageList', JSON.stringify(this.state.beverageList));
      console.log(this.state.beverageList)
    } catch (error) {
      console.log('## ERROR SAVING ITEM ##: ', error);
    }
  }

  _getBeverageDetails() {
    let url = config.settings.serverPath + '/api/beverage/' + this.state.beverageID;
    fetch(url)
      .then(response => {
        if (!response.ok) {
          Alert.alert('Error:', response.status.toString());
          throw Error('Error ' + response.status);
        }
        return response.json();
      })
      .then(beverage => {
        console.log(beverage);
        this.setState({beverage: beverage});
      })
      .catch(error => {
        console.error(error);
      });
  }

  componentDidMount() {
    this._getBeverageDetails();
    this._readBeverageList();
  }

  addBeverageList() {
    let bev = this.state.beverage;
    let bevList = [];
    bevList = this.state.beverageList;
      let bevDetails = {
        itemId: bev.id,
        name: bev.name,
        qty: this.state.quantity,
        category: common.getValue(common.category, bev.category),
        salePrice: bev.price,
        iceLevel: this.state.iceLevel,
        sugerLevel: this.state.sugerLevel,
        checked: 1,
      };
      console.log(bevDetails);
      bevList.push(bevDetails);
      this.setState({beverageList: bevList});
      this._saveBeverageList();
    
  }

  render(){
    const data1 = [
      'Normal Sugar',
      'Half Sugar',
      'Less Sugar',
      'No Sugar',
    ];
  
    const data2 = [
      'Normal Ice',
      'Less Ice',
      'No Ice',
    ];
    return(
      <ScrollView>

          <InputWithLabel
            textLabelStyle={styles.TextLabel}
            textInputStyle={styles.TextInput}
            label={'Name:'}
            value={this.state.beverage.name}
            orientation={'vertical'}
            editable={false}
          />
         
        <InputWithPicker 
          item={data1}
          label="Select your preferred sugar level: "
          onChangeValue={(itemValue, itemIndex) => {this.setState({sugerLevel: itemValue})}}
          selected={this.state.sugerLevel}
        />
  
        <InputWithPicker 
          item={data2}
          label="Select your preferred ice level: "
          onChangeValue={(itemValue, itemIndex) => {this.setState({iceLevel: itemValue})}}
          selected={this.state.iceLevel}
        />

        <View styles={styles.button}>
          <AppButton       
            title="Add To Cart"
            theme='pink'
            onPress={() => {
             Alert.alert('Successfully Add To Cart');
             this.addBeverageList();
             this.props.navigation.navigate('Home');
             
            }}
          />
        </View>
    </ScrollView>
  )
};}

const styles = StyleSheet.create({
  selectList:{
    marginBottom:20,
    padding:10,
    alignItems:'center',
    justifyContent:'center',
  },
  button:{
    padding:10,
    alignItems:'center',
    justifyContent:'center',
  },
  text:{
    fontFamily:'Roboto',
    fontSize: 10,
    fontWeight: 'bold',
  },
  textInput:{
    fontFamily:'Roboto',
    fontSize: 10,
  },
  remark:{
    height:50,
    margin:15,
    borderWidth:1,
    padding:10,
  },
  textLabel: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 3,
    textAlignVertical: 'center',
  },
  textInput: {
    fontSize: 24,
    color: 'black',
  },
  warning: {
    color: 'red',
    fontSize: 24,
  }
})