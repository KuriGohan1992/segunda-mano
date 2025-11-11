import { View, Text, Pressable, StyleSheet } from 'react-native'
import React from 'react'

const CustomButton = ({onPress, text, type="PRIMARY", bgColor, fgColor}) => {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.container, 
        styles[`container_${type}`],
        bgColor ? {backgroundColor: bgColor} : {}
      ]}
    >
      <Text style={[
        styles.text, 
        styles[`text_${type}`],
        fgColor ? {color: fgColor} : {}
      ]}>{text}</Text>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',

    padding: 15,
    marginVertical: 5,

    alignItems: 'center',
    borderRadius: 5,
  },

  container_PRIMARY: {
    backgroundColor: '#DC143C'
  },

  container_SECONDARY: {
    borderColor: '#DC143C',
    borderWidth: 2,
  },

  container_TERTIARY: {},

  text: {
    fontWeight: 'bold',
    color: 'white',
  },

  text_SECONDARY: {
    color: '#DC143C'
  },

  text_TERTIARY: {
    color: 'gray',
  },
})
export default CustomButton