import React, {Component} from 'react';
import { StyleSheet, Button, Text, View, TouchableOpacity, ScrollView, Image, ActivityIndicator, TextInput, Alert } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {InputWithLabel, MultiLineInputWithLabel} from '../../UI'
// import { MaterialIcons, AntDesign, MaterialCommunityIcons } from '@expo/vector-icons';

const config = require('../../Config');

export default class CartScreen extends Component {
	constructor(props){
		super(props);
		this._onPressButton = this._onPressButton.bind(this);
		this.state = {
			orderId: 0,
			selectAll: false,
			cartItemsIsLoading: false,
			userId: 0,
			cartItems: [],
			remark: '',
			isFetching: false,
		}
		this._removeBeverageList = this._removeBeverageList.bind(this);
		this._addOrder = this._addOrder.bind(this);
		this._saveBeverageList = this._saveBeverageList.bind(this);
		this._readBeverageList = this._readBeverageList.bind(this);
		this._readUserRegistration = this._readUserRegistration.bind(this);
		this._readOrder = this._readOrder.bind(this);
		this._addBeverage = this._addBeverage.bind(this);
	}
	componentDidMount() {
		this._readUserRegistration();
		this._readBeverageList();
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

	async _readBeverageList() {
		try {
		  let beverageList = await AsyncStorage.getItem('beverageList');
		  if (beverageList !== null) {

			this.setState({ cartItems: JSON.parse(beverageList) });
			console.log(this.state.cartItems);
		  }
		} catch (error) {
		  console.log("ERROR READING ITEMS", error);
		}
	}

	async _saveBeverageList() {
		try {
		  await AsyncStorage.setItem('beverageList', JSON.stringify(this.state.cartItems));
		  console.log(this.state.beverageList)
		} catch (error) {
		  console.log('## ERROR SAVING ITEM ##: ', error);
		}
	}

	async _removeBeverageList() {
		try {
		  await AsyncStorage.removeItem('beverageList');
		} catch (error) {
		  console.log("ERROR READING ITEMS", error);
		}
	}

	_addOrder() {
		let url = config.settings.serverPath + '/api/orderList';
  
	  fetch(url, {
		method: 'POST',
		headers: {
		  Accept: 'application/json',
		  'Content-Type': 'application/json',
		},
		body: JSON.stringify({
		  userId: this.state.userId,
		  remark: this.state.remark,
		  status: '01'
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
		})
		.catch(error => {
		  console.log(error);
		});
	}

	_readOrder() {
		let url = config.settings.serverPath + '/api/orderId';
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
		  .then(orderId => {
			console.log("C1",orderId.id);
			this.setState({orderId: orderId.id});
			console.log("C2", this.state.orderId);
			for(let j = 0; j < this.state.cartItems.length; j++) {
				this._addBeverage(this.state.cartItems[j]);
			}
			this._removeBeverageList();
			this.props.navigation.navigate('Order Details', {OrderId: this.state.orderId})
		  })
		  .catch(error => {console.log(error);});
	}

	_addBeverage(beverage) {
		let url = config.settings.serverPath + '/api/orderBeverage';
		console.log(this.state.orderId);
		console.log("bev", beverage);
		fetch(url, {
			method: 'POST',
			headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
			},
			body: JSON.stringify({
			orderId: this.state.orderId,
			beverageId: beverage.itemId,
			quantity: beverage.qty,
			sugerLevel: beverage.sugerLevel,
			iceLevel: beverage.iceLevel,
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
		})
		.catch(error => {
		  console.log(error);
		});
	}

	selectHandler = (index, value) => {
		const newItems = [...this.state.cartItems]; // clone the array 
		newItems[index]['checked'] = value == 1 ? 0 : 1; // set the new value 
		this.setState({ cartItems: newItems }); // set new state
	}
	
	selectHandlerAll = (value) => {
		const newItems = [...this.state.cartItems]; // clone the array 
		newItems.map((item, index) => {
			newItems[index]['checked'] = value == true ? 0 : 1; // set the new value 
		});
		this.setState({ cartItems: newItems, selectAll: (value == true ? false : true) }); // set new state
	}
	
	deleteHandler = (index) => {
		Alert.alert(
			'Are you sure you want to delete this item from your cart?',
			'',
			[
				{text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
				{text: 'Delete', onPress: () => {
					let updatedCart = this.state.cartItems; /* Clone it first */
					updatedCart.splice(index, 1); /* Remove item from the cloned cart state */
					this.setState(updatedCart); /* Update the state */
					this._saveBeverageList();
				}},
			],
			{ cancelable: false }
		);
	}

	_onPressButton() {
    Alert.alert(
			'Place Order Successfully!',
			'',
			[
				{text: 'OK', onPress: () => {
					this._addOrder();
					this._readOrder();
					console.log("C3", this.state.orderId);
					
					
				}}
			],
			{cancelable: false},
		);
  }


	quantityHandler = (action, index) => {
		const newItems = [...this.state.cartItems]; // clone the array 
		
		let currentQty = newItems[index]['qty'];
		
		if(action == 'more'){
			newItems[index]['qty'] = currentQty + 1;
		} else if(action == 'less'){
			newItems[index]['qty'] = currentQty > 1 ? currentQty - 1 : 1;
		}
		
		this.setState({ cartItems: newItems }); // set new state
		this._saveBeverageList();
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
				{/* <View style={{flexDirection: 'row', backgroundColor: '#fff', marginBottom: 10}}>
					<View style={[styles.centerElement, {width: 50, height: 50}]}>
						<Ionicons name="ios-cart" size={25} color="#000" />
					</View>
					<View style={[styles.centerElement, {height: 50}]}>
						<Text style={{fontSize: 18, color: '#000'}}>Shopping Cart</Text>
					</View>
				</View> */}
				
				
				{cartItemsIsLoading ? (
					<View style={[styles.centerElement, {height: 300}]}>
						<ActivityIndicator size="large" color="#ef5739" />
					</View>
				) : (
					<ScrollView>	
						{cartItems && cartItems.map((item, i) => (
							<View key={i} style={{flexDirection: 'row', backgroundColor: '#fff', marginBottom: 2, height: 120}}>
								<View style={[styles.centerElement, {width: 60}]}>
									<TouchableOpacity style={[styles.centerElement, {width: 32, height: 32}]} onPress={() => this.selectHandler(i, item.checked)}>
										<Ionicons name={item.checked == 1 ? "ios-checkmark-circle" : "ios-checkmark-circle-outline"} size={25} color={item.checked == 1 ? "#0faf9a" : "#aaaaaa"} />
									</TouchableOpacity>
								</View>
								<View style={{flexDirection: 'row', flexGrow: 1, flexShrink: 1, alignSelf: 'center'}}>
									{/* <TouchableOpacity onPress={() => this.props.navigation.navigate('ProductDetails', {productDetails: item})} style={{paddingRight: 10}}>
										<Image source={{uri: item.thumbnailImage}} style={[styles.centerElement, {height: 60, width: 60, backgroundColor: '#eeeeee'}]} />
									</TouchableOpacity> */}
									<View style={{flexGrow: 1, flexShrink: 1, alignSelf: 'center'}}>
										<Text numberOfLines={1} style={{color: '#333333', fontSize: 18}}>{item.name}</Text>
										<Text numberOfLines={1} style={{color: '#333333', fontSize: 15}}>{item.category ? 'Variation: ' + item.category : ''}</Text>
                    					<Text numberOfLines={1} style={{color: '#333333', fontSize: 15, marginBottom: 10}}>${item.qty * item.salePrice}</Text>
										<View style={{flexDirection: 'row'}}>
											<TouchableOpacity onPress={() => this.quantityHandler('less', i)} style={{ borderWidth: 1, borderColor: '#cccccc' }}>
												<Ionicons name="remove-outline" size={22} color="#cccccc" />
											</TouchableOpacity>
											<Text style={{ borderTopWidth: 1, borderBottomWidth: 1, borderColor: '#cccccc', paddingHorizontal: 7, paddingTop: 3, color: '#bbbbbb', fontSize: 13 }}>{item.qty}</Text>
											<TouchableOpacity onPress={() => this.quantityHandler('more', i)} style={{ borderWidth: 1, borderColor: '#cccccc' }}>
												<Ionicons name="add-outline" size={22} color="#cccccc" />
											</TouchableOpacity>
										</View>
									</View>
									
								</View>
								<View style={[styles.centerElement, {width: 60}]}>
									<TouchableOpacity style={[styles.centerElement, {width: 32, height: 32}]} onPress={() => this.deleteHandler(i)}>
										<Ionicons name="md-trash" size={25} color="#ee4d2d" />
									</TouchableOpacity>
								</View>
							</View>
						))}
					</ScrollView>
				)}
				
				{!cartItemsIsLoading &&
					<View style={{backgroundColor: '#fff', borderTopWidth: 2, borderColor: '#f6f6f6', paddingVertical: 5}}>
						<View style={{flexDirection: 'row'}}>
							<View style={{width: '100%'}}>
							<TextInput
								placeholder="Remark"
								value = {this.state.remark}
								onChangeText={(remark) => this.setState({remark})}
								style={{fontSize: 20}}
								multiline={true}/>
								
							</View>
						</View>
						<View style={{flexDirection: 'row'}}>
							<View style={[styles.centerElement, {width: 60}]}>
								<TouchableOpacity style={[styles.centerElement, {width: 32, height: 32}]} onPress={() => this.selectHandlerAll(selectAll)}>
									<Ionicons name={selectAll == true ? "ios-checkmark-circle" : "ios-checkmark-circle-outline"} size={25} color={selectAll == true ? "#0faf9a" : "#aaaaaa"} />
								</TouchableOpacity>
							</View>
							<View style={{flexDirection: 'row', flexGrow: 1, flexShrink: 1, justifyContent: 'space-between', alignItems: 'center'}}>
								<Text>Select All</Text>
								<View style={{flexDirection: 'row', paddingRight: 20, alignItems: 'center'}}>
									<Text style={{color: '#333333', fontSize: 30}}>SubTotal: </Text>
									<Text style={{color: '#333333', fontSize: 30}}>${this.subtotalPrice().toFixed(2)}</Text>
								</View>
							</View>
						</View>
						
						<View style={{flexDirection: 'row', justifyContent: 'flex-end', height: 32, paddingRight: 20, alignItems: 'center'}}>
							{/* <TouchableOpacity  onPress={() => {this._onPressButton}} style={[styles.centerElement, {backgroundColor: '#0faf9a', width: 100, height: 25, borderRadius: 5}]} onPress={() => {this._onPressButton}}> */}
							<TouchableOpacity style={[styles.centerElement, {backgroundColor: '#0faf9a', width: 100, height: 25, borderRadius: 5}]} onPress={this._onPressButton}>
								<Text style={{color: '#ffffff'}}>Place Order</Text>
							</TouchableOpacity>
						</View>
					</View>
				}
			</View>
		);
	}
}