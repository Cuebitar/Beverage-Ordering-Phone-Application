import React, {Component} from 'react';
import {Text, StyleSheet, Alert, View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {InputWithLabel, MultiLineInputWithLabel, AppButton, ExitBar} from '../../UI';

let config = require('../../Config');
let common = require('../../CommonData');
export default class ViewOrder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orderID: this.props.route.params.id,
      beverage: [],
      status: '',
      remark: '',
      isFetching: false, 
    };
    this._getBeverageDetails = this._getBeverageDetails.bind(this);
    this._updateOrderDetails = this._updateOrderDetails.bind(this);
  }
  
  _getBeverageDetails() {
    let url = config.settings.serverPath + '/api/order/' + this.state.orderID;
    this.setState({isFetching: true});
    fetch(url)
      .then((response) => {
        console.log(response);
        if(!response.ok) {
          Alert.alert('Error: ' + response.message);
          throw Error(response.message);
        }
        this.setState({isFetching: false});
        return response.json();
      })
      .then(orderData => {
        console.log(orderData);
        this.setOrderData(orderData);
      })
      .catch(error => {console.log(error);});
  }

  setOrderData(order) {
    let orderList = [];
    let state = common.getValue(common.status, order[0].status);
        for(let j = 0; j < order.length; j++) {
          

          let orderBeverage = order[j];
          let beverageData = {
            name: orderBeverage.name,
            quantity: orderBeverage.quantity,
            sugerLevel: orderBeverage.sugerLevel,
            iceLevel: orderBeverage.iceLevel,
          };
          console.log(beverageData);
          orderList.push(beverageData);
        }
        console.log(orderList);
      this.setState({
        beverage: orderList,
        status: state,
        remark: order[0].remark,
      });
  }

  _updateOrderDetails(next) {
    let url = config.settings.serverPath + '/api/orderList/' + this.props.route.params.id;
    let state = common.status[0].key;

    if(next) {
      switch (this.state.status) {
        case common.status[0].value:
          state = common.status[1].key;
          break;
        case common.status[1].value:
          state = common.status[2].key;
          break;
        
      }
    }
    else {
      state = common.status[3].key;
    }
    fetch(url, {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        status: state,
        id: this.props.route.params.id,
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
          Alert.alert('Record UPDATED for', this.order.id);
        } else {
          Alert.alert('Error in UPDATING');
        }
      })
      .catch(error => {
        console.log(error);
      });
  }

  componentDidMount() {
    this._getBeverageDetails();
  }
  componentDidUpdate() {
    this.props.navigation.setOptions({headerTitle: 'Order ID: ' + this.props.orderID});
  }
  addButton() {
    if(this.state.status == common.status[0].value || this.state.status == common.status[1].value) {
      return (
        <View>
          <AppButton 
              title = {this.state.status == common.status[0].value ? 'Preparing' : 'Completed'}
              onPress = {
                () => {
                  this._updateOrderDetails(true);
                  this.props.route.params.refresh();
                  this.props.route.params.refresh();
                  this.props.navigation.goBack();
                }
              }/>
              <AppButton 
              title = 'Cancel'
              theme = 'danger'
              onPress = {
                () => {
                  this._updateOrderDetails(false);
                  this.props.route.params.refresh();
                  this.props.route.params.refresh();
                  this.props.navigation.goBack();
                }
              }/>
        </View>
        
      );
    }
  }
  
  render() {
    console.log(this.state.beverage);
    const {beverage} = this.state;

    return (
      <View style={styles.container}>
        <ScrollView>
          <ExitBar
          onPress={() => {
            this.props.route.params.refresh();
            this.props.navigation.goBack();
          }}
          />
          
          <InputWithLabel
            textLabelStyle={styles.TextLabel}
            textInputStyle={styles.TextInput}
            label={'Status: '}
            value={this.state.status}
            orientation={'vertical'}
            editable={false}
          />
          <InputWithLabel
            textLabelStyle={styles.TextLabel}
            textInputStyle={styles.TextInput}
            label={'Remark: '}
            value={this.state.remark}
            orientation={'vertical'}
            editable={false}
          />
          
          <Text style={styles.label}>Beverage: </Text>
          
          {beverage && beverage.map((beverage, i) => (
							<View key={i} style={{flexDirection: 'row', marginBottom: 2, height: 30}}>
								<View style={[{width: 10}]}>
								</View>
								<View style={{flexDirection: 'row', flexGrow: 1, flexShrink: 1}}>
									<View style={{flexGrow: 1, flexShrink: 1}}>
                  <Text style={{fontWeight: 'bold', fontSize: 17}}>{i+1}. {beverage.name}({beverage.quantity},{beverage.sugerLevel},{beverage.iceLevel})</Text>
									</View>
								</View>
							</View>
						))}
            {this.addButton()}
          
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
    marginTop: 0,
    backgroundColor: '#ffdaB9',
  },
  TextLabel: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 3,
    textAlignVertical: 'center',
    color: 'darkbrown',
  },
  TextInput: {
    fontSize: 24,
    color: 'blue',
  },
  pickerItemStyle: {
    fontSize: 20,
    color: '#000099',
  },
  label: {
    flex: 4,
    fontSize: 20,
    margin: 10,
    fontWeight: 'bold',
  },
});