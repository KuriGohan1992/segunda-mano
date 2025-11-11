import { View, Text, TextInput, StyleSheet } from 'react-native'
import React from 'react'
import { Controller } from 'react-hook-form'

const CustomInput = ({multiline=false, control, name, rules={}, keyboardType, placeholder, autoFocus, onSubmitEditing, submitBehavior, secureTextEntry}) => {
  return (
    <Controller 
      control={control}
      name={name}
      rules={rules}
      render={({field: {value, onChange, onBlur}, fieldState: {error}}) => (
        <>
          <View 
            style={[
              {height: multiline ? 120 : 50},
              styles.container, 
              {borderColor: error ? 'red' : '#e8e8e8'}
            ]}>
            <TextInput 
              multiline={multiline}
              value={value}
              autoCapitalize="none"
              onChangeText={onChange} 
              onBlur={onBlur} 
              placeholder={placeholder}
              keyboardType={keyboardType}
              style={[styles.input, multiline ? {height: 110, textAlignVertical: 'top'} : '']}
              autoFocus={autoFocus}
              submitBehavior={submitBehavior}
              onSubmitEditing={onSubmitEditing}
              secureTextEntry={secureTextEntry}
            /> 
          </View>
          {error && (
            <Text style={{color: 'red', alignSelf: 'stretch'}}>{error.message || "Error"}</Text>
          )}
        </>
      )}
    />
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    width: '100%',    
    borderColor: '#e8e8e8',
    borderWidth: 2,
    borderRadius: 5,
    justifyContent: 'center',
    padding: 10,
    marginVertical: 5,
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  input: {
    fontSize: 16,
    color: '#333',
  },  
})

export default CustomInput