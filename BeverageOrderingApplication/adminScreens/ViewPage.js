import React, {Component} from 'react';
import {Text, StyleSheet, Alert, View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {InputWithLabel, MultiLineInputWithLabel, AppButton} from '../UI';

let config = require('../Config');
let common = require('../CommonData');
export default class ViewScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      beverageID: this.props.route.params.id,
      beverage: null,
    };
    this._getBeverageDetails = this._getBeverageDetails.bind(this);

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
  }
  componentDidUpdate() {
    this.props.navigation.setOptions({headerTitle: this.state.beverage.name});
  }
  render() {
    let bev = this.state.beverage;
    return (
      <View style={styles.container}>
        <ScrollView>
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
            value={bev ? bev.name : ''}
            orientation={'vertical'}
            editable={false}
          />
         <InputWithLabel
            textLabelStyle={styles.TextLabel}
            textInputStyle={styles.TextInput}
            label={'Price:'}
            value={bev ? bev.price.toString() : ''}
            orientation={'vertical'}
            editable={false}
          />
          <InputWithLabel
            textLabelStyle={styles.TextLabel}
            textInputStyle={styles.TextInput}
            label={'Category:'}
            value={bev ? common.getValue(common.category, bev.category) : ''}
            orientation={'vertical'}
            editable={false}
          />
          <InputWithLabel
            textLabelStyle={styles.TextLabel}
            textInputStyle={styles.TextInput}
            label={'Availability:'}
            value={bev ? bev.availability =='true' ? "Available" : "Not Available" : "" }         
            orientation={'vertical'}
            editable={false}
          />
          <MultiLineInputWithLabel
            textLabelStyle={styles.TextLabel}
            textInputStyle={styles.TextInput}
            label={'Description: '}
            value={bev ? bev.description : "" }         
            orientation={'vertical'}
            editable={false}
          />

          <AppButton 
          title = 'EDIT'
          onPress = {
            () => {
              this.props.navigation.navigate('EditPage', {
                id: this.state.beverageID,
                _refresh: this._getBeverageDetails,
              })
            }
          }/>
        </ScrollView>
        
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddintTop: 0,
    backgroundColor: '#fff',
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
    color: 'blue',
  },

  pickerItemStyle: {
    fontSize: 20,
    color: '#000099',
  },
});