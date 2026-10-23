import { Dimensions, FlatList, Image, Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { useResource } from '../../contexts/resourceProvider'
import CustomView from '../../components/customView';
import { ActivityIndicator } from 'react-native';
import Placeholder from "../../../assets/images/logo-glow.png"
import Favicon from "../../../assets/images/favicon.png"
import { Ionicons } from '@expo/vector-icons';
const HomeScreen = () => {
  const { width } = Dimensions.get("window")
  const [blogFinished, setFinished] = useState(false);
  const { blogs } = useResource();
  return (
    <>
      <CustomView style={{}} className="">
        <FlatList
          scrollEnabled
          showsHorizontalScrollIndicator={false}
          data={blogs}
          keyExtractor={(item, index) => index}
          ListEmptyComponent={() => (
            <View>
              No blog posts found for now
            </View>
          )}
          renderItem={({ item }) => (
            <View className="border-b-[5px] border-gray-400">
              <View className="p-3 border-b">
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
              <View>
                <Text>
                  {!item?.seeMore ? item.text.substring(0, 300) : item.text}
                </Text>
                <Pressable onPress={() => {
                  item.seeMore = true
                }} className="ms-3">
                  <Text>...see more</Text>
                </Pressable>
              </View>
              <View className="border-2 border-gray-200">
                <Image source={Placeholder} style={{
                  width: width
                }} resizeMode='contain' />
              </View>
              <View style={{ flexDirection: "row" }} className="justify-between">
                <Ionicons className="p-4" size={20} name='thumbs-up-outline' />
                <Ionicons className="p-4" size={20} name='chatbox-ellipses-outline' />
                <Ionicons className="p-4" size={20} name='arrow-redo-outline' />
              </View>
            </View>
          )}
        // ListHeaderComponent={()=>(
        //   <View className="items-center justify-between" style={{flexDirection:"row"}}>
        //     <View className="p-2">
        //       <Image source={Favicon} style={{
        //         width: 50, height: 50
        //       }} resizeMode='contain' />
        //     </View>
        //     {/* <View>
        //       <Text>Whats on your mind</Text>
        //     </View> */}
        //   </View>
        // )}
        />
      </CustomView>
    </>
  )
}

export default HomeScreen