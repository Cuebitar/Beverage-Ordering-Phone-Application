import React, { Component } from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  SectionList,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {LogBox} from 'react-native';
import {AppButton} from '../../UI'
// LogBox.ignoreWarnings([
//   'Non-serializable values were found in the navigation state',
// ]);
let config = require('../../Config');
let common = require('../../CommonData');
export default class OrderPage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isFetching: false,
      orders: [],

    };
    this._load = this._load.bind(this);
    
  }

  _load() {
    let url = config.settings.serverPath + '/api/orderList';
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
        this.setOrderData(orderData);
      })
      .catch(error => {console.log(error);});
  }

  setOrderData(order) {
    let orderList = [];
        common.status.forEach(element => {
          orderList.push({
            status: element.value,
            data: [],
          });
        });
        for(let j = 0; j < order.length; j++) {
          

          let orderDetails = order[j];
          let orderStatus = common.getValue(common.status, orderDetails.status);
          let orderData = {
            id: orderDetails.id,
            status: orderDetails.status,
            customerName: orderDetails.name,
          };
          console.log(orderData);

          for(let i = 0; i < orderList.length; i++) {
            if(orderList[i].status == orderStatus) {
              orderList[i].data.push(orderData);
              break;
            }
            else if(i == orderList.length - 1) {
              orderList.push({
                status: element.value,
                data: [orderData],
              });
              break;
            }
          }
        }
        console.log(orderList);
      this.setState({orders: orderList});
  }

  


  componentDidMount() {
    this._load();
    console.log(this.state.orders);
  }
  
  render() {
    console.log(this.state.orders);
    return (
      <View style={styles.container}>
        <SectionList
          sections={ this.state.orders }
          
          renderSectionHeader={ ({section}) =>
          <View style={styles.header}>
            <Text style={styles.headerText}>
              { section.status }
            </Text>
        </View>
          }

          renderItem={({item}) => 
             <TouchableHighlight
              underlayColor={'#cccccc'}
              onPress={ () => {
                this.props.navigation.navigate('ViewOrder', {
                  id: item.id,
                  refresh: this._load,
                });
              }}
            >
              <View style={styles.item}>
                <View style={styles.itemNameBox}>
                <Text style={styles.itemId}>
                  OrderID: { `${item.id}` }
                </Text>
                <Text style={styles.itemName}>Customer Name: {`${item.customerName}`}</Text>
                </View>
              </View>
            </TouchableHighlight>
            
            }
            

            
            
          
          keyExtractor={(item, index) => {item.id.toString() + index}}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  header: {
    backgroundColor : '#f8ad9d',
    fontSize : 24,
    fontWeight: 'bold',
    padding: 10,
    color: '#fff',
    borderColor: 'black',
    borderBottomWidth: 1,
  },
  headerText:{
    fontSize : 28,
    fontWeight: 'bold',
    color: 'white',
    marginLeft: 7,
  },
  item: {
    justifyContent: 'center',
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 16,
    paddingRight: 16,
    borderBottomWidth: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: '#ffdaB9',
  },
  itemNameBox: {
    flex: 1,
  },
  itemId: {
    fontSize: 27,
    fontWeight: 'bold',
    color: 'white',
  },
  itemName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  itemCode: {
    fontSize: 18,
  }, 
  updateButton: {
    height: 70,
  },
});
