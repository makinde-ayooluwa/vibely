import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'
import "../../global.css"
import { ResourceProvider } from "../contexts/resourceProvider"
const AppLayout = () => {
  return (
    <ResourceProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </ResourceProvider>
  )
}

export default AppLayout

const styles = StyleSheet.create({})