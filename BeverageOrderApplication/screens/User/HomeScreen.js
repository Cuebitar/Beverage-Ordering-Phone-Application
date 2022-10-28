import React, { Component, useState} from 'react';
import {View, Text, Image, StyleSheet, Alert, FlatList, TouchableOpacity} from "react-native";
import { ScrollView } from 'react-native-gesture-handler';
import AppHeader from "../Component/AppHeader";
import Colors from '../constants/Colors';

let config = require('../../Config');
let common = require('../../CommonData');
export default class HomeScreen extends Component{
    
  constructor(props){
    super(props);
    this.state={beverage:[], currentCategory: '01', isFetching:false}
    this._load=this._load.bind(this)
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

  componentDidMount() {
    this._load();
  }

  displayBeverage() {
    let bevData = [];
    for (let i = 0; i < this.state.beverage.length; i++) {
      if(this.state.beverage[i].category == common.getValue(common.category,this.state.currentCategory)) {
        bevData = this.state.beverage[i].data;
        break;
      }
    }
    let sendData = [];
    for (let j = 0; j < bevData.length; j++) {
          if(bevData[j].availability) {
            sendData.push(bevData[j]);
          }
    }
    return sendData;
  
    
  }

    render(){
        console.log(this.state.beverage)
        let displayBev = this.displayBeverage();
        return (
        <View style={{flex:1, backgroundColor:Colors.white}}>
            
            <Image style={styles.banner} source={require("../images/banner.png")}  />
            <ScrollView
        horizontal 
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.listCategory}>
          <FlatList 
                    data={displayBev}
                    renderItem ={({item})=>
                    (
                      <TouchableOpacity activeOpacity={0.8} onPress={() => {this.props.navigation.navigate('Add Beverage', {beverageId: item.code})}}>
                        <View style={{height: 150,borderBottomColor:'gray', borderBottomWidth:1}}>
                            <Text style={styles.text1}>{item.name}</Text>
                            <Text style={styles.text2}>{item.description}</Text>
                            <Text style={styles.text3}>RM {item.price}</Text>
                        </View>
                      </TouchableOpacity>
                    )
                    }
                    refreshing={this.state.isFetching}
                    onRefresh={this._load}
                    
                ></FlatList>
        </ScrollView>
            

            <View style={styles.categoryContainer}>
                <Categories
                    icon='../images/Milk.png'
                    text= "Milk Tea"
                    onPress={() => this.setState({currentCategory: '01'})}
                />
                <Categories
                    icon='../images/Tea.jpg'
                    text="Coffee"
                    onPress={() => this.setState({currentCategory: '02'})}
                />
                <Categories
                    icon='../images/Fruit Juice.png'
                    text="Fruit Tea"
                    onPress={() => this.setState({currentCategory: '03'})}
                />
                <Categories
                    icon='../images/Smoothies.png'
                    text="Chocolate"
                    onPress={() => this.setState({currentCategory: '04'})}
                />
                <Categories
                    icon='../images/Smoothies.png'
                    text="Crafted Tea"
                    onPress={() => this.setState({currentCategory: '05'})}
                />
            </View>
        </View> 
        );
}}

const Categories = ({text, icon, onPress}) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.wrapperImg("blue")}>
        <Image source={icon}/>
      <Text style={styles.text}>{text}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '20%',
  },
  wrapperImg: color => ({
    height: 60,
    width: '100%',
    backgroundColor: color,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  }),
  text: {
    marginTop: 10,
    color: Colors.pink,
    fontSize: 14,
    fontFamily: 'semiBold',
  },
	banner: {
		margin: 10,
        height: 180,
		width: 370,
		justifyContent: 'center',
		alignItems: 'center',
	},
    text1:{
        fontSize: 18,
        fontWeight: 'semibold',
        color:Colors.black,
        margin:15,
        marginLeft:15,
        fontFamily: 'Roboto',
    },
    text2:{
        fontSize: 16,
        fontWeight: 'semibold',
        color:Colors.black,
        margin:15,
        marginLeft:15,
        fontFamily: 'Roboto',
    },
    text3:{
        fontSize: 16,
        fontWeight: 'bold',
        color:Colors.black,
        margin:15,
        marginLeft:15,
        fontFamily: 'Roboto',
    },
    titleCategories:{
        fontSize: 20,
        fontFamily: 'Roboto',
        fontWeight: 'bold',
        color:Colors.secondPink,
        margin:15,
        marginBottom:30,
    },
    listCategory:{
        alignItems: 'center',
    },
    categoryBtn:{
        height:45,
        width:120,
        marginRIght:7,
        borderRadius:30,
        alignItems:'center',
        paddingHorizontal:5,
        flexDirection:'row',
    },
    categoryContainer: {
      flexDirection:'row',
    },
    
});

