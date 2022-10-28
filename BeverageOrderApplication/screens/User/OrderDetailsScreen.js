import React, {Component} from 'react';
import { StyleSheet, Button, Text, View, TouchableOpacity, ScrollView, Image, ActivityIndicator, TextInput, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
let config = require('../../Config');
let common = require('../../CommonData');
export default class OrderDetailsScreen extends React.Component {
	constructor(props){
		super(props);
    this._onPressButton = this._onPressButton.bind(this);
	this._getBeverageDetails = this._getBeverageDetails.bind(this);
		this.state = {
			orderID: this.props.route.params.OrderId,
			selectAll: true,
			cartItemsIsLoading: false,
			cartItems: [],
			remark: '',
		}
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
			this.setCartItems(orderData);
		  })
		  .catch(error => {console.log(error);});
	}

	setCartItems(data) {
		let orderList = [];
		for (let i = 0; i < data.length; i++) {
			let order = data[i];
			let beverageCategory = common.getValue(common.category, order.category);
			let beverageData = {
				name: order.name,
				qty: order.quantity,
				category: beverageCategory,
				salePrice: order.price,
				iceLevel: order.iceLevel,
				sugerLevel: order.sugerLevel,
				checked: 1,
			};
			console.log(beverageData);
			orderList.push(beverageData);
		}
		this.setState({
			cartItems: orderList,
			remark: data[0].remark,
		});
	} 

	componentDidMount() {
		this._getBeverageDetails();
	}

  	_onPressButton() {
    	Alert.alert(
			'Direct to Order History.',
			'',
			[
				{text: 'OK', onPress: () => this.props.navigation.navigate ('Order History')}
			],
			{cancelable: false},
		);
    }
	
	subtotalPrice = () => {
		const { cartItems } = this.state;
		if(cartItems){
			return cartItems.reduce((sum, item) => sum + (item.checked == 1 ? item.qty * item.salePrice : 0), 0 );
		}
		return 0;
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
							<View key={i} style={{flexDirection: 'row', backgroundColor: '#fff', marginBottom: 2, height: 155}}>
								<View style={[styles.centerElement, {width: 60}]}>
								</View>
								<View style={{flexDirection: 'row', flexGrow: 1, flexShrink: 1, alignSelf: 'center'}}>
									<View style={{flexGrow: 1, flexShrink: 1, alignSelf: 'center'}}>
										<Text numberOfLines={1} style={{color: '#333333', fontSize: 18}}>{item.name}</Text>
										<Text numberOfLines={1} style={{color: '#333333', fontSize: 15}}>{item.category ? 'Category: ' + item.category : ''}</Text>
										<Text numberOfLines={1} style={{color: '#333333', fontSize: 15}}>{item.category ? 'Suger Level: ' + item.sugerLevel : ''}</Text>
										<Text numberOfLines={1} style={{color: '#333333', fontSize: 15}}>{item.category ? 'Ice Level: ' + item.iceLevel : ''}</Text>
                    <Text numberOfLines={1} style={{color: '#333333', fontSize: 15}}>{item.category ? 'Quantity: ' + item.qty : ''}</Text>
                    <Text numberOfLines={1} style={{color: '#333333', marginBottom: 10, fontSize: 15}}>${item.qty * item.salePrice}</Text>
									</View>
								</View>
							</View>
						))}
					</ScrollView>
				)}


        {!cartItemsIsLoading &&
					<View style={{backgroundColor: '#fff', borderTopWidth: 2, borderColor: '#f6f6f6', paddingVertical: 5,alignSelf: 'flex-end'}}>
						<View style={{flexDirection: 'row'}}>
							<View style={{width: '100%'}}>
							<TextInput
								placeholder="Remark"
								value = {this.state.remark}
								onChangeText={(remark) => this.setState({remark})}
								style={{fontSize: 20}}
								multiline={true}
								editable={false}/>
								
							</View>
						</View>
						<View style={{flexDirection: 'row'}}>


								<View style={{flexDirection: 'row', paddingRight: 20, alignItems: 'flex-end'}}>
									<Text style={{color: '#333333', fontSize: 30}}>SubTotal: </Text>
									<Text style={{color:
										 '#333333', fontSize: 30}}>${this.subtotalPrice().toFixed(2)}</Text>
								</View>
	
						</View>
						<View style={{flexDirection: 'row', justifyContent: 'flex-end', height: 32, paddingRight: 20, alignItems: 'center'}}>
							{/* <TouchableOpacity  onPress={() => {this._onPressButton}} style={[styles.centerElement, {backgroundColor: '#0faf9a', width: 100, height: 25, borderRadius: 5}]} onPress={() => {this._onPressButton}}> */}
							<TouchableOpacity style={[styles.centerElement, {backgroundColor: '#0faf9a', width: 100, height: 25, borderRadius: 5}]} onPress={this._onPressButton}>
								<Text style={{color: '#ffffff'}}>Order History</Text>
							</TouchableOpacity>
						</View>
					</View>
				}
			</View>
		);
	}
}

