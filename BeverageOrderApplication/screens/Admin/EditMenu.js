import React, {Component} from 'react';
import {StyleSheet, TextInput, Text, View, Alert, ScrollView} from 'react-native';
import {InputWithLabel, ExitBar, AppButton, MultiLineInputWithLabel, SwitchWithLabel} from '../../UI';

let config = require('../../Config');
let common = require('../../CommonData');
export default class EditScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      beverageID: this.props.route.params.id,
      name: '',
      price: 0,
      availability: true,
      description: '',
      beverage: null,
    };
    this._getBeverageDetails = this._getBeverageDetails.bind(this);
    this._updatebeverageDetails = this._updatebeverageDetails.bind(this);
  }
  componentDidMount() {
    this._getBeverageDetails();
  }
  componentDidUpdate() {
    this.props.navigation.setOptions({headerTitle: this.state.name});
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
        this.setState({
          name: beverage.name,
          price: parseFloat(beverage.price),
          availability: beverage.availability == "true" ? true : false,
          description: beverage.description,
          beverage: beverage,
        });
      })
      .catch(error => {
        console.error(error);
      });
  }
  
  _updatebeverageDetails() {
    let url = config.settings.serverPath + '/api/beverage/' + this.state.beverageID;
    let available = this.state.availability == 1 ? 'true' : 'false';
    fetch(url, {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: this.state.name,
        price: this.state.price,
        description: this.state.description,
        availability: available,
        id: this.state.beverageID,
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
          Alert.alert('Record UPDATED for', this.state.name);
        } else {
          Alert.alert('Error in UPDATING');
        }
        this.props.route.params.refresh();
        this.props.navigation.goBack();
      })
      .catch(error => {
        console.log(error);
      });
  }
  
  
  render() {
    let bev = this.state.beverage;
    return (
      <View style={styles.container}>
        <ScrollView>
        <ExitBar
          onPress={() => {this.props.navigation.goBack()}}
          />
          <InputWithLabel
            textLabelStyle={styles.TextLabel}
            textInputStyle={styles.TextInput}
            label={'ID:'}
            value={bev ? bev.id.toString() : ''}
            orientation={'vertical'}
            editable={false}
          />
          <InputWithLabel
            textLabelStyle={styles.TextLabel}
            textInputStyle={styles.TextInput}
            label={'Name:'}
            value={this.state.name}
            changeText = {(name) => {this.setState({name})}}
            orientation={'vertical'}
          />
         <InputWithLabel
            textLabelStyle={styles.TextLabel}
            textInputStyle={styles.TextInput}
            label={'Price:'}
            value={this.state.price.toString()}
            changeText = {(price) => {this.setState({price})}}
            orientation={'vertical'}
            keyboardType= 'numeric'
          />
          <InputWithLabel
            textLabelStyle={styles.TextLabel}
            textInputStyle={styles.TextInput}
            label={'Category:'}
            value={bev ? common.getValue(common.category, bev.category) : ''}
            orientation={'vertical'}
            editable={false}
          />
          <SwitchWithLabel
            label = {'Availability: '}
            value={this.state.availability }         
            onValueChange={(availability) => this.setState({availability})}
          />
          <MultiLineInputWithLabel
            label = {'Description: '}
            textLabelStyle={styles.TextLabel}
            textInputStyle={styles.TextInput}
            value={this.state.description}
            changeText = {(description) => {this.setState({description})}}
            orientation={'vertical'}
          />

          <AppButton 
          title = 'SAVE'
          onPress = {() => this._updatebeverageDetails()}/>
        </ScrollView>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#ffdaB9',
  },
  TextLabel: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 3,
    textAlignVertical: 'center',
  },

  TextInput: {
    fontSize: 24,
    color: '#000099',
  },

  pickerItemStyle: {
    fontSize: 20,
    color: '#000099',
  },
});
