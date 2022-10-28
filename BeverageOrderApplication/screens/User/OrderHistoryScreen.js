import React, {Component} from 'react';
import { StyleSheet, Button, Text, View, TouchableOpacity, ScrollView, Image, ActivityIndicator, TextInput, Alert } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';


let config = require('../../Config');
let common = require('../../CommonData');
export default class OrderHistoryScreen extends React.Component {
  constructor(props){
		super(props);

	this._readUserRegistration = this._readUserRegistration.bind(this);
    this._onPressButton = this._onPressButton.bind(this);
	this._getOrderDetails = this._getOrderDetails.bind(this);
		this.state = {
			userId: 2,
			cartItemsIsLoading: false,
			isFetching: false, 
			cartItems: []
		}
	}
	
	componentDidMount() {	
		this._readUserRegistration();
		this._getOrderDetails();
	}

	async _readUserRegistration() {
		try {
		  let userId = await AsyncStorage.getItem('userId');
		  if (userId !== null) {
			this.setState({ userId: parseInt(userId) });
		  }
		} catch (error) {
		  console.log("ERROR READING ITEMS", error);
		}
	}

	_getOrderDetails() {
		let url = config.settings.serverPath + '/api/orderList/' + this.state.userId;
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
			this.setcartItems(orderData);
		  })
		  .catch(error => {console.log(error);});
	}

	setcartItems(data) {
		let orderList = [];
		for (let i = 0; i < data.length; i++) {
			let order = data[i];
			let orderStatus = common.getValue(common.status, order.status)
			let orderData = {
				OrderID: order.id, 
				OrderStatus: orderStatus,
			};
			console.log(orderData);
			orderList.push(orderData);
		}
		this.setState({cartItems: orderList});
	} 

	

    _onPressButton(orderID) {
    	Alert.alert(
			'Direct to Order Details.',
			'',
			[
				{text: 'OK', onPress: () => {this.props.navigation.navigate ('Order Details', {
					OrderId: orderID,
				});}}
			],
			{cancelable: false},
		);
    }


  	render() {
		const styles = StyleSheet.create({
			centerElement: {justifyContent: 'center', alignItems: 'center'},
		});
		
		const { cartItems, cartItemsIsLoading, selectAll } = this.state;
		
		return (
			<View style={{flex: 1, backgroundColor: '#f6f6f6'}}>				
				
				{cartItemsIsLoading ? (
					<View style={[styles.centerElement, {height: 300}]}>
						<ActivityIndicator size="large" color="#ef5739" />
					</View>
				) : (
					<ScrollView>	
						{cartItems && cartItems.map((item, i) => (
							<View key={i} style={{flexDirection: 'row', backgroundColor: '#fff', marginBottom: 2, height: 120}}>
								<View style={[styles.centerElement, {width: 60}]}>
								</View>
								<View style={{flexDirection: 'row', flexGrow: 1, flexShrink: 1, alignSelf: 'center'}}>
                  <TouchableOpacity onPress={() => {this.props.navigation.navigate('Order Details', {OrderId: item.OrderID, refresh: this._getOrderDetails})}} style={{paddingRight: 10}}>
									</TouchableOpacity>
									<View style={{flexGrow: 1, flexShrink: 1, alignSelf: 'center'}}>
										<Text numberOfLines={1} style={{color: '#333333', fontSize: 18}}>{'Order ID: ' + item.OrderID}</Text>
                    <Text numberOfLines={1} style={{color: '#333333', fontSize: 15}}>{'Order Status: ' + item.OrderStatus}</Text>
									</View>
								</View>

                <View style={[styles.centerElement, {width: 60}]}>
									<TouchableOpacity style={[styles.centerElement, {width: 32, height: 32}]} onPress={() => {this._onPressButton(item.OrderID)}}>
										<Ionicons name="md-arrow-forward" size={25} color="#ee4d2d" />
									</TouchableOpacity>
								</View>

							</View>
						))}
					</ScrollView>
				)}
			</View>
		);
	}
}

