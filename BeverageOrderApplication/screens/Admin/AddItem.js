import React, {Component} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
  Alert,
  Image
} from 'react-native';
import {InputWithLabel, ExitBar, AppButton, MultiLineInputWithLabel, SwitchWithLabel} from '../../UI';

let config = require('../../Config');
let common = require('../../CommonData')

export default class AddItem extends Component {

    constructor(props) {
        super(props);

        this.state = {
            name: '',
            price: 0,
            description: '',
            availability: true,
            category: common.getKey(common.category, this.props.route.params.category),
        };
    }

    _addBeverage() {
      let url = config.settings.serverPath + '/api/beverage';

    fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: this.state.name,
        price: this.state.price.toString(),
        description: this.state.description,
        availability: this.state.availability.toString(),
        category: this.state.category,
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
          Alert.alert('Record SAVED for', this.state.name);
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

    render() {
        return (
            <View style={styles.container}>
                <ScrollView >
          <ExitBar
            onPress={() => {this.props.navigation.goBack()}}
          />
          <InputWithLabel
            textLabelStyle={styles.TextLabel}
            textInputStyle={styles.TextInput}
            label={'Name:'}
            value={this.state.name}
            changeText = {(name) => {this.setState({name})}}
            orientation={'vertical'}
            placeholder={'Name'}
          />
         <InputWithLabel
            textLabelStyle={styles.TextLabel}
            textInputStyle={styles.TextInput}
            label={'Price:'}
            value={this.state.price.toString()}
            changeText = {(price) => {this.setState({price})}}
            orientation={'vertical'}
            keyboardType= 'numeric'
            placeholder={'Price'}
          />
          <InputWithLabel
            textLabelStyle={styles.TextLabel}
            textInputStyle={styles.TextInput}
            label={'Category:'}
            value={common.getValue(common.category, this.state.category)}
            orientation={'vertical'}
            editable={false}
          />
          <MultiLineInputWithLabel
            label = {'Description: '}
            style={styles.MultiTextInput}
            value={this.state.description}
            changeText = {(description) => {this.setState({description})}}
            orientation={'vertical'}
            placeholder={'Description'}
          />

          <AppButton 
          title = 'SAVE'
          onPress = {() => this._addBeverage()}/>
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
    color: 'black',
  },

  pickerItemStyle: {
    fontSize: 20,
    color: '#000099',
  },
  MultiTextInput: {
    height: 100,
    fontSize: 20,
    marginLeft: 5,
    textAlignVertical: 'top',
  },
});