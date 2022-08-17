import React, {Component} from 'react'; import {
    Platform,
    View,
    Text,
    TextInput, TouchableOpacity, StyleSheet, Switch
    } from 'react-native';
    import {Picker} from '@react-native-picker/picker';

        class InputWithLabel extends Component { 
        
        constructor(props) {
            super(props);
        }

        render() { 
            return (
                <View style={inputStyles.container}> 
                <Text style={inputStyles.label}>{this.props.label}</Text>
                <TextInput
                value={this.props.value}
                onChangeText = {this.props.changeText}
                style={[inputStyles.input, this.props.style]}
                placeholder={this.props.placeholder}
                keyboardType={this.props.keyboardType ? this.props.keyboardType : 'default'}
                {...this.props} />
                </View> 
            );
        } }

        class MultiLineInputWithLabel extends Component { 
        
          constructor(props) {
              super(props);
          }
  
          render() { 
              return (
                  <View style={inputStyles.containerForMulti}> 
                  <Text style={inputStyles.label}>{this.props.label}</Text>
                  <TextInput
                  value={this.props.value}
                  onChangeText = {this.props.changeText}
                  style={[inputStyles.inputForMulti, this.props.style]}
                  multiline={true}
                  placeholder={this.props.placeholder}
                  keyboardType={this.props.keyboardType ? this.props.keyboardType : 'default'}
                  {...this.props} />
                  </View> 
              );
          } }

        class InputWithPicker extends Component { 
        
            constructor(props) {
                super(props);
            }
    
            render() { 
                const renderPickerList = () => {
                    return this.props.item.map((item) => {
                      return <Picker.Item label={item} value = {item} />
                    })
                  }
                return (
                    <View style={pickerStyles.container}> 
                    <Text style={inputStyles.label}>{this.props.label}</Text>
                    <Picker
                onValueChange={this.props.onChangeValue}
                selectedValue={this.props.selected}
                style={pickerStyles.picker}
                >
                    {renderPickerList()}
                    
                </Picker>
                    </View> 
                );
            } }
        /**
    * AppButton */
                class AppButton extends Component {
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
                      default:
                        this.backgroundColor = '#286090';
                    }
                  } else {
                    this.backgroundColor = '#286090';
              } }

              
                render() {
                    return (
                      <TouchableOpacity
                        onPress={this.props.onPress}
                        > 
                  <View
                              style={[
                              buttonStyles.button,
                              {backgroundColor: this.backgroundColor},
                  ]}>
                      <Text style={buttonStyles.buttonText}>{this.props.title}</Text> 
                  </View>
                </TouchableOpacity> 
                );
                } }

  class SwitchWithLabel extends Component {
    constructor(props) {
      super(props);
    }
    
    render() {
      return (
        <View style={switchStyles.container}>
          <Text style={switchStyles.label}>{this.props.label}</Text>
          <Switch
          value={this.props.value}
          onValueChange={this.props.onValueChange}
          style={switchStyles.switch}
          ></Switch>
        </View>
      );
    }

  }
        const inputStyles = StyleSheet.create({
            container: {
                height: 100,
                flexDirection: 'row',
            },
             containerForMulti: {
              flexDirection: 'column',
             },
             label: {
                flex: 3,
                fontSize: 21,
                fontWeight: 'bold',
                marginLeft: 8,
                
                textAlignVertical: 'center',
            },
              input: {
                flex: 5,
                fontSize: 20,
                color: 'blue',
              },
              inputForMulti: { 
                flex: 5,
                fontSize: 20,
                color: 'blue',
                marginLeft: 5,
              },
            });
        
            const buttonStyles = StyleSheet.create({ button: {
                margin: 5,
                    alignItems: 'center',
                  },
                  buttonText: {
                    padding: 20,
                    fontSize: 20,
                    color: 'white',
            }, });

            const pickerStyles = StyleSheet.create({
              container: {
                height: 80,
                flexDirection: 'row',
              },
              picker: {
                flex: 3,
              }
            });

            const switchStyles = StyleSheet.create({
              container: {
                flexDirection: 'row',
                alignItems: 'flex-start',
                height: 60,
              },
              label: {
                flex: 4,
                fontSize: 20,
                margin: 10,
                fontWeight: 'bold',
              },
              switch: {
                flex: 1,
                margin: 10,
              }
            });

            module.exports = { 
                InputWithLabel: InputWithLabel, 
                AppButton: AppButton,
                InputWithPicker: InputWithPicker,
                MultiLineInputWithLabel: MultiLineInputWithLabel,
                SwitchWithLabel: SwitchWithLabel,
            };