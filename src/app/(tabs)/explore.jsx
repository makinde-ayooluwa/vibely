import React from 'react';
import { StyleSheet, Text, View, Dimensions, FlatList } from 'react-native';
import { useVideoPlayer, VideoView } from 'expo-video';
import { useResource } from '../../contexts/resourceProvider';

const { height } = Dimensions.get('window');



const VideoItem = ({ item }) => {
  const player = useVideoPlayer(item.uri, (player) => {
    player.loop = true;
    player.play();
  });

  return (
    <View style={{ height: height, justifyContent: 'center', alignItems: 'center', backgroundColor: 'black' }}>
      <VideoView
        style={{ width: '100%', height: '100%', position: 'absolute' }}
        player={player}
        allowsFullscreen
        nativeControls={false}
      />
      <View style={{ position: 'absolute', bottom: 80, left: 20, right: 20 }}>
        <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>{item.title}</Text>
        <Text style={{ color: '#ccc', fontSize: 14, marginTop: 4 }}>Swipe for more store highlights</Text>
      </View>
    </View>
  );
};

const ExploreScreen = () => {
  const { videos } = useResource()
  return (
    <View style={{ flex: 1, backgroundColor: 'black' }}>
      <FlatList
        data={videos}
        keyExtractor={(item) => item.id}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        snapToInterval={height}
        snapToAlignment="start"
        decelerationRate="fast"
        renderItem={({ item }) => <VideoItem item={item} />}
        getItemLayout={(data, index) => ({
          length: height,
          offset: height * index,
          index,
        })}
      />
    </View>
  );
};

export default ExploreScreen;

const styles = StyleSheet.create({});