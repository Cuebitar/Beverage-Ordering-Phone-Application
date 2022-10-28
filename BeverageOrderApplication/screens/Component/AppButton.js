import React, { Component } from 'react';
import {
    Platform,
    View,
    Text,
    TouchableNativeFeedback,
    StyleSheet,
} from 'react-native';


export default class AppButton extends Component {
    constructor(props) {
        super(props);
        if (props.theme) {
            switch (props.theme) {
                case 'success':
                    this.backgroundColor = '#449d44';
                    break;
                case 'info':
                    this.backgroundColor = '#31b0d5';
                    break;
                case 'warning':
                    this.backgroundColor = '#ec971f';
                    break;
                case 'danger':
                    this.backgroundColor = '#c9302c';
                    break;
                case 'primary':
                    this.backgroundColor = '#3B71F3'
                    break;
                case 'tertiary':
                    this.backgroundColor = '#3B71F3'
                default:
                    this.backgroundColor = 'f9fbfc';
            }
        } else {
            this.backgroundColor = '#286090';
        }
    }
    render() {
        return (
            
                <TouchableNativeFeedback
                    onPress={this.props.onPress}
                    onLongPress={this.props.onLongPress}
                    background={
                        Platform.OS === 'android'
                            ? TouchableNativeFeedback.SelectableBackground()
                            : ''
                    }>

                    <View
                        style={[
                            buttonStyles.button,
                            { backgroundColor: this.backgroundColor },
                        ]}>
                        {/* <Text style={buttonStyles[`container_${this.props.type}`]}>{this.props.title}</Text> */}
                        <Text style={buttonStyles[`${this.props.type}`]}>{this.props.title}</Text>
                    </View>

                </TouchableNativeFeedback>
            
        );
    }
}

const buttonStyles = StyleSheet.create({
    button: {
        borderRadius: 5,
        margin: 5,
        alignItems: 'center',
    },

    default:{
        padding: 20,
        fontSize: 20,
        color: 'white',
    },

    colorChangeForTertiary:{
        padding: 20,
        fontSize: 20,
        color: 'grey',
    }
});



