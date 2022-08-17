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
// LogBox.ignoreWarnings([
//   'Non-serializable values were found in the navigation state',
// ]);
let common = require('../CommonData')
let config = require('../Config');
export default class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isFetching: false,
      beverage: [],

    };
    this._load = this._load.bind(this);
    this._delete = this._delete.bind(this);
  }

  _load() {
    
    let url = config.settings.serverPath + '/api/beverage';
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
      .then(beverageData => {
        this.setbeverageData(beverageData);
      })
      .catch(error => {console.log(error);});
  }

  setbeverageData(beverage) {
    let beverageList = [];
        common.category.forEach(element => {
          beverageList.push({
            category: element.value,
            data: [],
          });
        });
        for(let j = 0; j < beverage.length; j++) {
          ////common.getValue(common.category, beverageObj.category)
          let beverageObj = beverage[j];
          let itemCategory = common.getValue(common.category, beverageObj.category);
          let available = beverageObj.availability=='true' ? true : false;
          const beverageData = {
            code: beverageObj.id,
            name: beverageObj.name,
            price: beverageObj.price,
            description: beverageObj.description,
            availability: available,
          };
          console.log(beverageData);

          for(let i = 0; i < beverageList.length; i++) {
            if(beverageList[i].category == itemCategory) {
              beverageList[i].data.push(beverageData);
              break;
            }
            else if(i == beverageList.length - 1) {
              beverageList.push({
                category: itemCategory,
                data: [beverageData],
              });
              break;
            }
          }
        }
        console.log(beverageList);
      this.setState({beverage: beverageList});
  }
  
  _delete(deleteId, name) {
    Alert.alert('Confirm to DELETE', name, [
      {
        text: 'No',
        onPress: () => {},
      },
      {
        text: 'Yes',
        onPress: () => {
          let url =
            config.settings.serverPath + '/api/beverage/' + deleteId;
          console.log(url);
          fetch(url, {
            method: 'DELETE',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({id: deleteId}),
          })
            .then(response => {
              if (!response.ok) {
                Alert.alert('Error:', response.status.toString());
                throw Error('Error ' + response.status);
              }
              return response.json();
            })
            .then(responseJson => {
              if (responseJson.affected == 0) {
                Alert.alert('Error in DELETING');
              }
            this._load();
            }
            )
            .catch(error => {
              console.error(error);
            });
        },
      },
    ]);
  }

  componentDidMount() {
    this._load();
    console.log(this.state.beverage);
  }
  
  render() {
    console.log(this.state.beverage)
    return (
      <View style={styles.container}>
        <SectionList
          sections={ this.state.beverage }
          renderSectionHeader={ ({section}) =>
          <View style={styles.header}>
            <Text style={styles.headerText}>
              { section.category }
            </Text>
            <TouchableHighlight
            title= "AddItem"
            underlayColor={'#aaaaaa'}
            onPress={
                () => {
                  this.props.navigation.navigate('AddItem', {
                    category: section.category,
                    _refresh: this._load,
                  });
                }
            }
            style = {styles.button}
            > 
            <View style={styles.buttonTextContainer}>
                <Text style={styles.buttonText}>Add Drink</Text>
                <Ionicons name="add" size={16} style={styles.addButton} />
            </View>
        </TouchableHighlight>
        </View>
          }
          renderItem={({item}) =>
            <TouchableHighlight
              underlayColor={'#cccccc'}
              onPress={ () => {
                this.props.navigation.navigate('ViewPage', {
                  id: item.code,
                  _refresh: this._load,
                });
              }}
            >
              <View style={styles.item}>
                <View style={styles.itemNameBox}>
                <Text style={styles.itemName}>
                  Name: { `${item.name}` }
                </Text>
                <Text style={styles.itemPrice}>Price:  RM {`${item.price}`}</Text>
                </View>
                <TouchableHighlight
              underlayColor={'#cccccc'}
              onPress={ () => {
                this._delete(item.code, item.name);
              }}
            >
              <View><Ionicons name="ios-trash" size={35} style={styles.deleteButton} /></View>
            </TouchableHighlight>
                
              </View>
            </TouchableHighlight>
            
          }
          keyExtractor={(item) => {item.code.toString()}}
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
    backgroundColor : 'red',
    fontSize : 24,
    fontWeight: 'bold',
    padding: 10,
    color: '#fff',
  },
  headerText:{
    fontSize : 24,
    fontWeight: 'bold',
    color: '#fff',
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
  },
  itemNameBox: {
    flex: 1,
  },
  itemName: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  itemPrice: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  itemCode: {
    fontSize: 18,
  }, 
  deleteButton: {
    marginTop: 7,
  },
  addButton: {
    marginTop: 4,
    color: 'white',
  },
  button: {
    paddingTop: 2,
    paddingBottom: 2,
    paddingLeft: 10,
    paddingRight: 10,
    height: 30,
    backgroundColor: '#C0C0C0',
    position: 'absolute',
    right: 8,
    borderRadius: 8,
    marginTop: 10,
},
buttonTextContainer: {
    flex: 1,
    flexDirection: 'row',
    height: 10,
},
buttonText: {
    marginRight: 5,
    marginTop: 2,
    color: 'white',
},
});
