import { FlatList, Image, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { useResource } from '../../contexts/resourceProvider'
import CustomView from '../../components/customView';
import { ActivityIndicator } from 'react-native';
import Placeholder from "../../../assets/images/logo-glow.png"
import { Ionicons } from '@expo/vector-icons';
const HomeScreen = () => {
  const [blogFinished, setFinished] = useState(false);
  const { blogs } = useResource();
  return (
    <>
      <CustomView style={{}} className="">
        <FlatList
          data={blogs}
          keyExtractor={(item, index) => index}
          ListEmptyComponent={() => (
            <View>
              No blog posts found for now
            </View>
          )}
          renderItem={({ item }) => (
            <View className="border-b-[5px] border-gray-400">
              <View className="p-3">
                <View className="items-center gap-2 justify-start" style={{
                  flexDirection: "row"
                }}>
                  <Image source={Placeholder} style={{
                    width: 40,
                    height: 40,
                  }} className="border-2 border-gray-300 rounded-full"
                    resizeMode='contain'
                  />
                  <View className="grid gap-2">
                    <Text className="font-bold text-[15px]">{item.user.name}</Text>
                    <Text> <Ionicons name='locate' /> {item.createdAt}</Text>
                  </View>
                </View>
              </View>
            </View>
          )}
        />
      </CustomView>
    </>
  )
}

export default HomeScreen