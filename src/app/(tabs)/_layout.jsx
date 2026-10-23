import React from 'react'
import { Tabs } from "expo-router"
import { Ionicons } from "@expo/vector-icons"
import Logo from "../../../assets/images/logo.png"
import { Image, Pressable, Text } from 'react-native'
import { View } from 'react-native'
const TabsLayout = () => {
  return (
    <Tabs screenOptions={{ headerShown: true }}>
      <Tabs.Screen name='home' options={{
        headerTitle: () => (
          <Image source={Logo} style={{
            width: 60, height: 50
          }} resizeMode='contain' />
        ),
        tabBarIcon: ({ focused }) => (
          <Ionicons size={20} name={focused ? 'home' : 'home-outline'} />
        ),
        tabBarShowLabel: false,
        headerRight: () => (
          <>
            {/* <View className="flex"> */}
            <Pressable onPress={null}>
              <Ionicons name='menu' size={30} style={{
                padding: 5,
                borderWidth: 0,
                marginRight: 2,
                borderRadius: 50
              }} />
            </Pressable>
            {/* <Ionicons name='menu' size={20} className="border rounded-full p-3 m-3" /> */}
            {/* </View> */}
          </>
        )
      }} />
      <Tabs.Screen name='explore' options={{
        tabBarIcon: ({ focused }) => (
          <Ionicons size={20} name={focused ? 'videocam' : 'videocam-outline'} />
        ),
        tabBarShowLabel: false,
        headerShadowVisible: false,
        headerTitle: "Explore",
        headerTitleStyle: {
          fontSize: 25
        },
        headerTransparent: true
      }} />
      <Tabs.Screen name='chat' options={{
        tabBarIcon: ({ focused }) => (
          <Ionicons size={20} name={focused ? 'chatbubble' : 'chatbubble-outline'} />
        ),
        tabBarShowLabel: false,
        headerShadowVisible: false,
        headerTitle: "Chat",
        headerTitleStyle: {
          fontSize: 25
        },
      }} />
    </Tabs>
  )
}

export default TabsLayout