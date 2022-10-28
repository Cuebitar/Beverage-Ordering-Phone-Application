import React, { Component } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

export default class InputWithLabel extends Component {

    render() {
        return (
            
            <View style={styles.container}>

                <Text style={styles.label}>{this.props.label}</Text>

                    <TextInput
                        style={styles.input}
                        {...this.props}
                    >
                    </TextInput>

            </View>
        )
    }
}

const styles = StyleSheet.create({
    container:{
        width: '100%',
        paddingHorizontal: 10,
        marginVertical: 5,
        // borderWidth: 1,
    },

    label: {
        flex: 1,
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 3,
        textAlignVertical: 'center',
    },

    input: {
        borderColor: '#e8e8e8',
        borderWidth: 1,
        borderRadius: 5,
        flex: 3,
        fontSize: 20,
        color: 'blue',
    },
})



