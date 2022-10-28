import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native'
import { Surface, Title, Badge } from 'react-native-paper'
import Icon from 'react-native-vector-icons/MaterialIcons'
import Colors from '../constants/Colors';

const IconSize = 24;

const AppHeader = ({menu, back, optionalBtn, title, navigation, headerBg, iconColor, cartBadge}) => {
    return(
	    <Surface style={[styles.header, {backgroundColor:headerBg}]} >
        <View style={styles.view}>
			{menu && <TouchableOpacity onPress={() => navigation.optionDrawer()}>
				<Icon name="menu" size={IconSize} color={iconColor} />
			</TouchableOpacity>}
            {back && <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" size={IconSize} color={iconColor} />
        </TouchableOpacity>}
	    </View>
	

        <View style={styles.titleView}>
			<Title style={{color:iconColor, textAlign:'center'}}>{title}</Title>
	    </View>
	
        <View style={[styles.view, styles.rightView]}>
	        {optionalBtn && <TouchableOpacity style={styles.rowView} onPress={() => navigation.cart()}>
                <Icon name={optionalBtn} size={IconSize} color={iconColor} />
                {cartBadge && <Badge style={{position:'absolute', top:-5, right:-10}}>{cartBadge}</Badge>}
            </TouchableOpacity>}
        </View>
	    </Surface>
    )
}

export default AppHeader

const styles = StyleSheet.create({
	header: {
		height: 50,
		elevation: 8,
		justifyContent: 'space-between',
		alignItems: 'center',
		flexDirection: 'row',
		backgroundColor: Colors.pink,
	},
	view: {
		marginHorizontal: 16,
		alignItems: 'center',
		flexDirection: 'row',
	},
    titleView: {
		flex: 1,
		
	},
	rightView: {
		justifyContent: 'flex-end',
	},
	rowView: {
		flexDirection: 'row',
		alignItems: 'center',
		marginRight: 10,
	}
})
