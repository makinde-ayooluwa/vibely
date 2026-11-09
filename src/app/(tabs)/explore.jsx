import React from 'react';
import { StyleSheet, Text, View, Dimensions, FlatList, Image } from 'react-native';
import { useVideoPlayer, VideoView } from 'expo-video';
import { useResource } from '../../contexts/resourceProvider';

const { height, width } = Dimensions.get('window');

// Sample feed data structure supporting videos, single images, and carousels

const VideoFeedItem = ({ item }) => {
  const player = useVideoPlayer(item.uri, (player) => {
    player.loop = true;
    player.play();
  });

  return (
    <VideoView
      style={{ width: '100%', height: '100%', position: 'absolute' }}
      player={player}
      allowsFullscreen
      nativeControls={false}
    />
  );
};

const ImageFeedItem = ({ item }) => {
  return (
    <Image
      source={{ uri: item.uri }}
      style={{ width: '100%', height: '100%', position: 'absolute' }}
      resizeMode="cover"
    />
  );
};

const CarouselFeedItem = ({ item }) => {
  return (
    <FlatList
      data={item.images}
      horizontal
      pagingEnabled
      showsHorizontalScrollIndicator={false}
      keyExtractor={(_, index) => index.toString()}
      renderItem={({ item: imgUri }) => (
        <Image
          source={{ uri: imgUri }}
          style={{ width: width, height: '100%', position: 'absolute' }}
          resizeMode="cover"
        />
      )}
    />
  );
};

const FeedItem = ({ item }) => {
  return (
    <View style={{ height: height, justifyContent: 'center', alignItems: 'center', backgroundColor: 'black' }}>
      {item.type === 'video' && <VideoFeedItem item={item} />}
      {item.type === 'image' && <ImageFeedItem item={item} />}
      {item.type === 'carousel' && <CarouselFeedItem item={item} />}

      <View style={{ position: 'absolute', bottom: 80, left: 20, right: 20, zIndex: 10 }}>
        <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>{item.title}</Text>
        <Text style={{ color: '#ccc', fontSize: 14, marginTop: 4 }}>{item.description || "Swipe for more store highlights"}</Text>
      </View>
    </View>
  );
};

const ExploreScreen = () => {
  const { feedData } = useResource()
  // Fallback to local feedData if resource provider hasn't loaded videos yet
  const activeData = (feedData && feedData.length > 0) ? feedData : feedData;

  return (
    <View style={{ flex: 1, backgroundColor: 'black' }}>
      <FlatList
        data={activeData}
        keyExtractor={(item, index) => item.id?.toString() || index.toString()}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        decelerationRate="normal"
        renderItem={({ item }) => <FeedItem item={item} />}
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