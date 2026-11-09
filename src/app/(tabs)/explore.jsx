
import React, {
  useEffect,
  useState,
  useRef,
  useCallback,
} from 'react';

import {
  View,
  Text,
  Image,
  FlatList,
  Pressable,
  Share,
  Alert,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  useWindowDimensions,
} from 'react-native';

import { useEvent } from 'expo';

import {
  useVideoPlayer,
  VideoView,
} from 'expo-video';

import { Ionicons } from '@expo/vector-icons';

import { useResource } from '../../contexts/resourceProvider';


// ----------------------------------
// FORMAT COUNTS
// ----------------------------------

const formatCount = (count = 0) => {
  const number = Number(count) || 0;

  if (number >= 1000000) {
    return `${(number / 1000000).toFixed(1)}M`;
  }

  if (number >= 1000) {
    return `${(number / 1000).toFixed(1)}K`;
  }

  return number.toString();
};


// ----------------------------------
// FORMAT VIDEO TIME
// ----------------------------------

const formatTime = (seconds = 0) => {
  const totalSeconds = Math.max(0, Math.floor(seconds || 0));

  const minutes = Math.floor(totalSeconds / 60);
  const remainingSeconds = totalSeconds % 60;

  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};


// ----------------------------------
// VIDEO FEED ITEM
// ----------------------------------

const VideoFeedItem = ({
  item,
  isActive,
  onDoubleTap,
  muted,
  setMuted,
}) => {
  const player = useVideoPlayer(item.uri, (player) => {
    player.loop = true;
    player.muted = true;
    player.timeUpdateEventInterval = 0.25;

    // Never autoplay when the player is first created.
    player.pause();
  });

  const { isPlaying } = useEvent(
    player,
    'playingChange',
    { isPlaying: player.playing }
  );

  const { currentTime } = useEvent(
    player,
    'timeUpdate',
    { currentTime: player.currentTime }
  );

  const { status, error } = useEvent(
    player,
    "statusChange",
    {
      status: player.status,
      error: null
    }
  );

  useEffect(() => {
    if (status === "error") {
      console.log("VIDEO PLAYBACK ERROR:", error);
      console.log("VIDEO URL:", item.uri);
    }
  }, [status, error, item.uri]);

  const [showControls, setShowControls] = useState(false);
  const [showHeart, setShowHeart] = useState(false);
  const [trackWidth, setTrackWidth] = useState(0);

  const singleTapTimer = useRef(null);
  const heartTimer = useRef(null);
  const controlsTimer = useRef(null);

  const duration = Number.isFinite(player.duration)
    ? player.duration
    : 0;

  const progress = duration > 0
    ? Math.min(currentTime / duration, 1)
    : 0;


  // ----------------------------------
  // ACTIVE VIDEO MANAGEMENT
  // ----------------------------------

  useEffect(() => {
    if (isActive) {
      // Start every newly visible video from the beginning.
      player.currentTime = 0;
      player.play();

      setShowControls(true);
    } else {
      // Pause and reset videos that leave the screen.
      player.pause();
      player.currentTime = 0;
    }

    return () => {
      player.pause();
    };
  }, [isActive, player]);


  // ----------------------------------
  // MUTE MANAGEMENT
  // ----------------------------------

  useEffect(() => {
    player.muted = muted;
  }, [muted, player]);


  // ----------------------------------
  // CLEANUP TIMERS
  // ----------------------------------

  useEffect(() => {
    return () => {
      if (singleTapTimer.current) {
        clearTimeout(singleTapTimer.current);
      }

      if (heartTimer.current) {
        clearTimeout(heartTimer.current);
      }

      if (controlsTimer.current) {
        clearTimeout(controlsTimer.current);
      }
    };
  }, []);


  // ----------------------------------
  // SHOW CONTROLS
  // ----------------------------------

  const revealControls = () => {
    setShowControls(true);

    if (controlsTimer.current) {
      clearTimeout(controlsTimer.current);
    }

    if (isPlaying) {
      controlsTimer.current = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    }
  };


  // ----------------------------------
  // PLAY / PAUSE
  // ----------------------------------

  const togglePlayback = () => {
    if (!isActive) return;

    if (isPlaying) {
      player.pause();
      setShowControls(true);
    } else {
      if (duration > 0 && currentTime >= duration) {
        player.currentTime = 0;
      }

      player.play();
      revealControls();
    }
  };


  // ----------------------------------
  // SINGLE TAP / DOUBLE TAP
  // ----------------------------------

  const handleVideoTap = () => {
    if (!isActive) return;

    if (singleTapTimer.current) {
      // Second tap: cancel the pending single tap.
      clearTimeout(singleTapTimer.current);
      singleTapTimer.current = null;

      // Double tap: like the post.
      onDoubleTap();

      setShowHeart(true);

      if (heartTimer.current) {
        clearTimeout(heartTimer.current);
      }

      heartTimer.current = setTimeout(() => {
        setShowHeart(false);
      }, 850);

      return;
    }

    // First tap: wait briefly to determine whether
    // another tap follows.
    singleTapTimer.current = setTimeout(() => {
      singleTapTimer.current = null;
      togglePlayback();
    }, 280);
  };


  // ----------------------------------
  // FORWARD / BACKWARD
  // ----------------------------------

  const seekBy = (seconds) => {
    if (!isActive || !duration) return;

    const nextTime = Math.max(
      0,
      Math.min(duration, player.currentTime + seconds)
    );

    player.currentTime = nextTime;

    revealControls();
  };


  // ----------------------------------
  // SEEK BAR
  // ----------------------------------

  const handleSeek = (event) => {
    if (!isActive || !duration || !trackWidth) return;

    const position = Math.max(
      0,
      Math.min(trackWidth, event.nativeEvent.locationX)
    );

    const nextTime = (position / trackWidth) * duration;

    player.currentTime = nextTime;
    revealControls();
  };


  return (
    <View className="absolute inset-0 bg-black">

      {/* VIDEO */}

      <VideoView
        player={player}
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
        }}
        contentFit="cover"
        nativeControls={false}
        allowsFullscreen
        surfaceType="textureView"
      />


      {/* VIDEO TAP AREA */}

      <Pressable
        onPress={handleVideoTap}
        className="absolute inset-0 z-10"
      />


      {/* DOUBLE TAP HEART */}

      {showHeart && (
        <View
          pointerEvents="none"
          className="absolute inset-0 items-center justify-center z-20"
        >
          <Ionicons
            name="heart"
            size={105}
            color="#ff3040"
          />
        </View>
      )}


      {/* CENTRAL VIDEO CONTROLS */}

      {/* CENTRAL VIDEO CONTROLS */}

      {!isPlaying && (
        <View
          pointerEvents="box-none"
          className="absolute inset-0 items-center justify-center z-30"
        >
          <View className="flex-row items-center gap-10">

            {/* BACKWARD */}

            <Pressable
              onPress={() => seekBy(-10)}
              className="items-center"
              hitSlop={12}
            >
              <Ionicons
                name="play-back"
                size={31}
                color="white"
              />

              <Text className="text-white text-xs font-bold mt-1">
                10s
              </Text>
            </Pressable>

            {/* PLAY */}

            <Pressable
              onPress={togglePlayback}
              className="w-16 h-16 rounded-full bg-black/50 items-center justify-center"
              hitSlop={12}
            >
              <Ionicons
                name="play"
                size={36}
                color="white"
              />
            </Pressable>

            {/* FORWARD */}

            <Pressable
              onPress={() => seekBy(10)}
              className="items-center"
              hitSlop={12}
            >
              <Ionicons
                name="play-forward"
                size={31}
                color="white"
              />

              <Text className="text-white text-xs font-bold mt-1">
                10s
              </Text>
            </Pressable>

          </View>
        </View>
      )}


      {/* VIDEO STATUS */}

      {status === 'loading' && (
        <View className="absolute inset-0 items-center justify-center z-20">
          <Ionicons
            name="hourglass-outline"
            size={32}
            color="white"
          />
        </View>
      )}

      {status === 'error' && (
        <View className="absolute inset-0 items-center justify-center z-20">
          <Ionicons
            name="alert-circle-outline"
            size={38}
            color="white"
          />

          <Text className="text-white mt-2">
            Unable to play video
          </Text>
        </View>
      )}


      {/* MUTE BUTTON */}

      <Pressable
        onPress={() => setMuted((previous) => !previous)}
        className="absolute top-14 left-5 bg-black/50 p-3 rounded-full z-40"
      >
        <Ionicons
          name={muted ? 'volume-mute' : 'volume-high'}
          size={22}
          color="white"
        />
      </Pressable>


      {/* VIDEO PROGRESS AND DURATION */}

      <View className="absolute bottom-2 left-4 right-4 z-40">

        <View className="flex-row items-center justify-between mb-2">

          <Text className="text-white text-xs font-semibold">
            {formatTime(currentTime)}
          </Text>

          <Text className="text-white text-xs font-semibold">
            {formatTime(duration)}
          </Text>

        </View>


        {/* SEEK BAR */}

        <Pressable
          onLayout={(event) => {
            setTrackWidth(event.nativeEvent.layout.width);
          }}
          onPress={handleSeek}
          className="h-3 justify-center"
          hitSlop={8}
        >

          <View className="h-1 bg-white/40 rounded-full overflow-hidden">

            <View
              className="h-full bg-green-500 rounded-full"
              style={{
                width: `${progress * 100}%`,
              }}
            />

          </View>

        </Pressable>

      </View>

    </View>
  );
};


// ----------------------------------
// IMAGE FEED ITEM
// ----------------------------------

const ImageFeedItem = ({ item }) => {
  return (
    <Image
      source={{ uri: item.uri }}
      className="absolute inset-0 w-full h-full"
      resizeMode="cover"
    />
  );
};


// ----------------------------------
// CAROUSEL FEED ITEM
// ----------------------------------

const CarouselFeedItem = ({ item }) => {
  const { width } = useWindowDimensions();

  const [activeIndex, setActiveIndex] = useState(0);

  const images = Array.isArray(item.images)
    ? item.images
    : [];

  if (!images.length) {
    return (
      <View className="flex-1 items-center justify-center bg-neutral-900">
        <Ionicons
          name="image-outline"
          size={45}
          color="#777"
        />

        <Text className="text-white mt-3">
          No images available
        </Text>
      </View>
    );
  }

  return (
    <View className="absolute inset-0">

      <FlatList
        data={images}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(_, index) => index.toString()}
        onMomentumScrollEnd={(event) => {
          const index = Math.round(
            event.nativeEvent.contentOffset.x / width
          );

          setActiveIndex(index);
        }}
        renderItem={({ item: imageUri }) => (
          <Image
            source={{ uri: imageUri }}
            style={{ width, height: '100%' }}
            resizeMode="cover"
          />
        )}
      />


      {/* IMAGE COUNTER */}

      <View className="absolute top-14 right-5 bg-black/50 px-3 py-1.5 rounded-full">
        <Text className="text-white text-xs font-semibold">
          {activeIndex + 1}/{images.length}
        </Text>
      </View>


      {/* IMAGE INDICATORS */}

      <View className="absolute bottom-40 self-center flex-row items-center gap-1.5">
        {images.map((_, index) => (
          <View
            key={index}
            className={`h-1.5 rounded-full ${activeIndex === index
                ? 'w-4 bg-white'
                : 'w-1.5 bg-white/50'
              }`}
          />
        ))}
      </View>

    </View>
  );
};


// ----------------------------------
// ACTION BUTTON
// ----------------------------------

const ActionButton = ({
  icon,
  label,
  color = 'white',
  onPress,
}) => {
  return (
    <Pressable
      onPress={onPress}
      className="items-center justify-center min-w-12"
      hitSlop={8}
    >
      <Ionicons
        name={icon}
        size={29}
        color={color}
      />

      <Text className="text-white text-xs font-semibold mt-1">
        {label}
      </Text>
    </Pressable>
  );
};


// ----------------------------------
// FEED ITEM
// ----------------------------------

const FeedItem = ({
  item,
  height,
  isActive,
}) => {

  const [liked, setLiked] = useState(false);

  const [saved, setSaved] = useState(false);

  const [likes, setLikes] = useState(
    Number(item.likes) || 0
  );

  const [comments, setComments] = useState(
    Number(item.comments) || 0
  );

  const [muted, setMuted] = useState(true);

  const [commentModal, setCommentModal] = useState(false);

  const [commentText, setCommentText] = useState('');

  const [localComments, setLocalComments] = useState([]);


  // ----------------------------------
  // LIKE
  // ----------------------------------

  const handleLike = () => {
    if (liked) {
      setLikes((previous) => Math.max(0, previous - 1));
    } else {
      setLikes((previous) => previous + 1);
    }

    setLiked((previous) => !previous);
  };


  // ----------------------------------
  // SAVE
  // ----------------------------------

  const handleSave = () => {
    const nextSaved = !saved;

    setSaved(nextSaved);

    Alert.alert(
      nextSaved ? 'Post saved' : 'Post unsaved',
      nextSaved
        ? 'Post added to your saved posts.'
        : 'Post removed from your saved posts.'
    );
  };


  // ----------------------------------
  // SHARE
  // ----------------------------------

  const handleShare = async () => {
    try {
      const content = [
        item.title,
        item.description,
        item.shareUrl || item.uri || '',
      ]
        .filter(Boolean)
        .join('\n\n');

      await Share.share({
        message: content,
      });
    } catch (error) {
      Alert.alert('Error', 'Unable to share this post.');
    }
  };


  // ----------------------------------
  // COMMENT
  // ----------------------------------

  const handleComment = () => {
    const trimmedComment = commentText.trim();

    if (!trimmedComment) return;

    setLocalComments((previous) => [
      ...previous,
      {
        id: Date.now().toString(),
        text: trimmedComment,
      },
    ]);

    setComments((previous) => previous + 1);

    setCommentText('');
  };


  // ----------------------------------
  // MORE OPTIONS
  // ----------------------------------

  const handleMore = () => {
    Alert.alert(
      'Post options',
      'Choose an action',
      [
        {
          text: saved ? 'Unsave post' : 'Save post',
          onPress: handleSave,
        },
        {
          text: 'Share post',
          onPress: handleShare,
        },
        {
          text: 'Report post',
          onPress: () => {
            Alert.alert(
              'Report',
              'The report feature will be connected to the backend.'
            );
          },
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ]
    );
  };


  return (
    <View
      style={{ height }}
      className="w-full bg-black justify-center"
    >

      {/* MEDIA */}

      {item.type === 'video' && item.uri ? (
        <VideoFeedItem
          item={item}
          isActive={isActive}
          muted={muted}
          setMuted={setMuted}
          onDoubleTap={handleLike}
        />
      ) : null}

      {item.type === 'image' && item.uri ? (
        <ImageFeedItem item={item} />
      ) : null}

      {item.type === 'carousel' ? (
        <CarouselFeedItem item={item} />
      ) : null}


      {/* DARK OVERLAY */}

      <View
        pointerEvents="none"
        className="absolute inset-0 bg-black/20"
      />


      {/* RIGHT ACTION BUTTONS */}

      <View className="absolute right-4 bottom-44 items-center gap-6 z-50">

        <ActionButton
          icon={liked ? 'heart' : 'heart-outline'}
          label={formatCount(likes)}
          color={liked ? '#ff3040' : 'white'}
          onPress={handleLike}
        />

        <ActionButton
          icon="chatbubble-outline"
          label={formatCount(comments)}
          onPress={() => setCommentModal(true)}
        />

        <ActionButton
          icon="paper-plane-outline"
          label={formatCount(item.shares)}
          onPress={handleShare}
        />

        <ActionButton
          icon={saved ? 'bookmark' : 'bookmark-outline'}
          label="Save"
          color={saved ? '#22c55e' : 'white'}
          onPress={handleSave}
        />

        <ActionButton
          icon="ellipsis-horizontal"
          label="More"
          onPress={handleMore}
        />

      </View>


      {/* POST INFORMATION */}

      <View className="absolute bottom-10 left-4 right-24 z-20">

        <View className="flex-row items-center mb-3">

          <Image
            source={{
              uri: item.user?.avatar,
            }}
            className="w-10 h-10 rounded-full bg-neutral-700 mr-2"
          />

          <Text
            numberOfLines={1}
            className="text-white text-sm font-bold flex-shrink"
          >
            {item.user?.name || 'Unknown user'}
          </Text>

          <Pressable
            onPress={() =>
              Alert.alert(
                'Follow',
                'The follow feature will be connected to your backend.'
              )
            }
            className="border border-white rounded-md px-3 py-1 ml-3"
          >
            <Text className="text-white text-xs font-bold">
              Follow
            </Text>
          </Pressable>

        </View>


        <Text className="text-white text-lg font-bold mb-1">
          {item.title}
        </Text>

        <Text
          numberOfLines={3}
          className="text-neutral-200 text-sm leading-5"
        >
          {item.description || 'Swipe for more store highlights'}
        </Text>


        <View className="flex-row items-center mt-3 gap-4">

          <View className="flex-row items-center gap-1">
            <Ionicons
              name="eye-outline"
              size={15}
              color="#ddd"
            />

            <Text className="text-neutral-300 text-xs">
              {formatCount(item.views)} views
            </Text>
          </View>

          <View className="flex-row items-center gap-1">
            <Ionicons
              name="share-social-outline"
              size={15}
              color="#ddd"
            />

            <Text className="text-neutral-300 text-xs">
              {formatCount(item.shares)} shares
            </Text>
          </View>

        </View>

      </View>


      {/* COMMENT MODAL */}

      <Modal
        visible={commentModal}
        animationType="slide"
        transparent
        onRequestClose={() => setCommentModal(false)}
      >

        <KeyboardAvoidingView
          className="flex-1 justify-end"
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >

          <Pressable
            className="absolute inset-0 bg-black/50"
            onPress={() => setCommentModal(false)}
          />


          <View className="h-[65%] bg-white rounded-t-3xl px-5 pt-5 pb-4">

            {/* MODAL HEADER */}

            <View className="flex-row items-center justify-between border-b border-neutral-200 pb-4">

              <Text className="text-black text-lg font-bold">
                Comments ({comments})
              </Text>

              <Pressable
                onPress={() => setCommentModal(false)}
                hitSlop={10}
              >
                <Ionicons
                  name="close"
                  size={26}
                  color="#111"
                />
              </Pressable>

            </View>


            {/* COMMENTS LIST */}

            <FlatList
              data={localComments}
              keyExtractor={(comment) => comment.id}
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={{ paddingBottom: 15 }}
              ListEmptyComponent={
                <View className="items-center justify-center py-14">

                  <Ionicons
                    name="chatbubbles-outline"
                    size={45}
                    color="#aaa"
                  />

                  <Text className="text-neutral-500 text-sm mt-3">
                    No comments yet.
                  </Text>

                  <Text className="text-neutral-400 text-xs mt-1">
                    Be the first to comment!
                  </Text>

                </View>
              }
              renderItem={({ item: comment }) => (
                <View className="flex-row items-start mt-4 gap-3">

                  <View className="w-9 h-9 rounded-full bg-neutral-200 items-center justify-center">
                    <Ionicons
                      name="person"
                      size={18}
                      color="#666"
                    />
                  </View>

                  <View className="flex-1 bg-neutral-100 rounded-xl p-3">
                    <Text className="text-neutral-800 text-sm">
                      {comment.text}
                    </Text>
                  </View>

                </View>
              )}
            />


            {/* COMMENT INPUT */}

            <View className="flex-row items-center border-t border-neutral-200 pt-3 gap-3">

              <TextInput
                value={commentText}
                onChangeText={setCommentText}
                placeholder="Write a comment..."
                placeholderTextColor="#999"
                multiline
                className="flex-1 bg-neutral-100 rounded-full px-4 py-3 text-black max-h-24"
              />

              <Pressable
                onPress={handleComment}
                disabled={!commentText.trim()}
                className="p-2"
              >
                <Ionicons
                  name="send"
                  size={24}
                  color={
                    commentText.trim()
                      ? '#16a34a'
                      : '#aaa'
                  }
                />
              </Pressable>

            </View>

          </View>

        </KeyboardAvoidingView>

      </Modal>

    </View>
  );
};


// ----------------------------------
// EXPLORE SCREEN
// ----------------------------------

const ExploreScreen = () => {
  const { feedData } = useResource();

  const { height } = useWindowDimensions();

  const [activeItemId, setActiveItemId] = useState(null);

  const activeItemIdRef = useRef(null);


  const activeData = Array.isArray(feedData)
    ? feedData
    : [];


  // ----------------------------------
  // VIEWABILITY
  // ----------------------------------

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    const visibleItem = viewableItems.find(
      (viewable) => viewable.isViewable
    );

    const nextId = visibleItem?.item?.id?.toString() || null;

    activeItemIdRef.current = nextId;

    setActiveItemId(nextId);
  }).current;


  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 80,
  }).current;


  // Reset active video when the feed changes.
  useEffect(() => {
    if (!activeData.length) {
      setActiveItemId(null);
      activeItemIdRef.current = null;
    }
  }, [activeData.length]);


  return (
    <View className="flex-1 bg-black">

      <StatusBar
        backgroundColor="black"
        barStyle="light-content"
      />

      {activeData.length > 0 ? (

        <FlatList
          data={activeData}
          keyExtractor={(item, index) =>
            item.id?.toString() || index.toString()
          }
          pagingEnabled
          showsVerticalScrollIndicator={false}
          decelerationRate="fast"
          viewabilityConfig={viewabilityConfig}
          onViewableItemsChanged={onViewableItemsChanged}
          renderItem={({ item }) => (
            <FeedItem
              item={item}
              height={height}
              isActive={
                activeItemId === item.id?.toString()
              }
            />
          )}
          getItemLayout={(_, index) => ({
            length: height,
            offset: height * index,
            index,
          })}
        />

      ) : (

        <View className="flex-1 items-center justify-center px-8">

          <Ionicons
            name="images-outline"
            size={55}
            color="#777"
          />

          <Text className="text-white text-lg font-bold mt-4">
            Nothing to explore yet
          </Text>

          <Text className="text-neutral-400 text-sm text-center mt-2">
            Posts and store highlights will appear here.
          </Text>

        </View>

      )}

    </View>
  );
};

export default ExploreScreen;
