import { Dimensions, FlatList, Image, Pressable, StyleSheet, Modal, Text, TextInput, View, Alert, Share } from 'react-native'
import React, { useState } from 'react'
import { useResource } from '../../contexts/resourceProvider'
import CustomView from '../../components/customView';
import { ActivityIndicator } from 'react-native';
import Placeholder from "../../../assets/images/logo-glow.png"
import Favicon from "../../../assets/images/favicon.png"
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
const HomeScreen = () => {
  const { width } = Dimensions.get("window")
  const [blogFinished, setFinished] = useState(false);
  const { blogs } = useResource();
  const Placeholder = "https://via.placeholder.com/150";

  const PostCard = ({ item, onLike, onComment }) => {
    const [showShareModal, setShowShareModal] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const [likes, setLikes] = useState(item.likes || 0);
    const [isLiked, setIsLiked] = useState(false);
    const [showCommentInput, setShowCommentInput] = useState(false);
    const [commentText, setCommentText] = useState("");
    const [comments, setComments] = useState(item.comments || []);

    const maxLength = 300;
    const shouldTruncate = item.text.length > maxLength;
    const displayedText = !isExpanded && shouldTruncate
      ? item.text.substring(0, maxLength) + "..."
      : item.text;

    const handleLikeToggle = () => {
      if (isLiked) {
        setLikes(likes - 1);
        setIsLiked(false);
      } else {
        setLikes(likes + 1);
        setIsLiked(true);
      }
    };
    const openPostDetails = () => {
      const postId = item.id ?? blogs.indexOf(item);

      router.push(`/post/${postId}`);
    };
    const handleAddComment = () => {
      if (!commentText.trim()) return;
      setComments([...comments, { id: Date.now(), text: commentText, author: "Store Owner" }]);
      setCommentText("");
      setShowCommentInput(false);
    };
    const getShareContent = () => {
      return [
        item.text,
        item.shareUrl || ''
      ].filter(Boolean).join('\n\n');
    };

    const shareTo = async (platform) => {
      const message = getShareContent();
      const encodedMessage = encodeURIComponent(message);
      const encodedUrl = encodeURIComponent(item.shareUrl || '');

      try {
        let url = '';

        switch (platform) {
          case 'whatsapp':
            url = `https://wa.me/?text=${encodedMessage}`;
            break;

          case 'facebook':
            if (!item.shareUrl) {
              Alert.alert('Unavailable', 'This post has no shareable link yet.');
              return;
            }
            url = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
            break;

          case 'x':
            url = `https://twitter.com/intent/tweet?text=${encodedMessage}`;
            break;

          case 'more':
            await Share.share({ message });
            setShowShareModal(false);
            return;
        }

        if (url) {
          await Linking.openURL(url);
        }

        setShowShareModal(false);
      } catch (error) {
        Alert.alert('Error', 'Unable to share this post.');
      }
    };
    return (
      <View className="mb-4 bg-white border-b-[5px] border-gray-200 shadow-sm">
        <Pressable onPress={openPostDetails}>
          {/* Post Header */}
        <View className="p-3 border-b border-gray-100">
          <View className="flex-row items-center gap-3">
            <Image
              source={{ uri: item?.user?.avatar || Placeholder }}
              style={{ width: 40, height: 40 }}
              className="border border-gray-300 rounded-full"
              resizeMode='cover'
            />
            <View>
              <Text className="font-bold text-[15px] text-gray-900">{item?.user?.name || "Store Update"}</Text>
              <View className="flex-row items-center gap-1 mt-0.5">
                <Ionicons name='time-outline' size={12} color="gray" />
                <Text className="text-xs text-gray-500">{item?.createdAt}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Post Body / Text */}
        <View className="p-3">
          <Text className="leading-relaxed text-gray-800">
            {displayedText}
          </Text>
          {shouldTruncate && (
            <Pressable onPress={() => setIsExpanded(!isExpanded)} className="mt-2">
              <Text className="font-semibold text-blue-600">
                {isExpanded ? "Show less" : "...see more"}
              </Text>
            </Pressable>
          )}
        </View>

        {/* Post Media / Image (if available) */}
        {item?.image && (
          <View className="bg-black">
            <Image
              source={{ uri: item.image }}
              style={{ width: "100%", height: 250 }}
              resizeMode='cover'
            />
          </View>
        )}
        </Pressable>

        {/* Interaction Stats */}
        <View className="flex-row justify-between px-4 py-2 text-xs text-gray-500 border-t border-gray-100">
          <Text>{likes} Likes</Text>
          <Text>{comments.length} Comments</Text>
        </View>

        {/* Action Footer */}
        <View className="flex-row justify-around py-1 border-t border-gray-200 bg-gray-50">
          <Pressable onPress={handleLikeToggle} className="flex-row items-center gap-2 p-2">
            <Ionicons size={20} name={isLiked ? 'thumbs-up' : 'thumbs-up-outline'} color={isLiked ? '#2563eb' : '#4b5563'} />
            <Text className={isLiked ? "text-blue-600 font-medium" : "text-gray-600"}>Like</Text>
          </Pressable>

          <Pressable onPress={() => setShowCommentInput(!showCommentInput)} className="flex-row items-center gap-2 p-2">
            <Ionicons size={20} name='chatbox-ellipses-outline' color="#4b5563" />
            <Text className="text-gray-600">Comment</Text>
          </Pressable>

          <Pressable
            onPress={() => setShowShareModal(true)}
            className="flex-row items-center gap-2 p-2"
          >
            <Ionicons
              size={20}
              name="arrow-redo-outline"
              color="#4b5563"
            />
            <Text className="text-gray-600">Share</Text>
          </Pressable>
        </View>

        {/* Comment Input Section */}
        {showCommentInput && (
          <View className="p-3 border-t border-gray-200 bg-gray-50">
            <View className="flex-row gap-2">
              <TextInput
                className="flex-1 px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg"
                placeholder="Write a comment..."
                value={commentText}
                onChangeText={setCommentText}
              />
              <Pressable onPress={handleAddComment} className="justify-center px-4 py-2 bg-blue-600 rounded-lg">
                <Text className="text-sm font-semibold text-white">Post</Text>
              </Pressable>
            </View>

            {/* Render Comments */}
            {comments.length > 0 && (
              <View className="gap-2 mt-3">
                {comments.map((c) => (
                  <View key={c.id} className="p-2 bg-white border border-gray-200 rounded">
                    <Text className="text-xs font-bold text-gray-700">{c.author}</Text>
                    <Text className="text-sm text-gray-800">{c.text}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        )}
        <Modal
          visible={showShareModal}
          transparent
          animationType="slide"
          onRequestClose={() => setShowShareModal(false)}
        >
          <Pressable
            onPress={() => setShowShareModal(false)}
            className="flex-1 justify-end bg-black/50"
          >
            <Pressable
              onPress={() => { }}
              className="bg-white rounded-t-3xl px-5 pt-5 pb-10"
            >

              {/* HEADER */}

              <View className="flex-row items-center justify-between mb-5">
                <Text className="text-lg font-bold text-gray-900">
                  Share post
                </Text>

                <Pressable onPress={() => setShowShareModal(false)}>
                  <Ionicons name="close" size={25} color="#333" />
                </Pressable>
              </View>

              {/* SHARE OPTIONS */}

              <View className="flex-row flex-wrap justify-between">

                <Pressable
                  onPress={() => shareTo('whatsapp')}
                  className="w-[23%] items-center mb-6"
                >
                  <View className="w-14 h-14 rounded-full bg-green-100 items-center justify-center">
                    <Ionicons name="logo-whatsapp" size={28} color="#16a34a" />
                  </View>
                  <Text className="text-xs text-gray-700 mt-2">WhatsApp</Text>
                </Pressable>

                <Pressable
                  onPress={() => shareTo('facebook')}
                  className="w-[23%] items-center mb-6"
                >
                  <View className="w-14 h-14 rounded-full bg-blue-100 items-center justify-center">
                    <Ionicons name="logo-facebook" size={28} color="#1877F2" />
                  </View>
                  <Text className="text-xs text-gray-700 mt-2">Facebook</Text>
                </Pressable>

                <Pressable
                  onPress={() => shareTo('x')}
                  className="w-[23%] items-center mb-6"
                >
                  <View className="w-14 h-14 rounded-full bg-gray-200 items-center justify-center">
                    <Ionicons name="logo-twitter" size={27} color="#111" />
                  </View>
                  <Text className="text-xs text-gray-700 mt-2">X</Text>
                </Pressable>

                <Pressable
                  onPress={() => shareTo('more')}
                  className="w-[23%] items-center mb-6"
                >
                  <View className="w-14 h-14 rounded-full bg-purple-100 items-center justify-center">
                    <Ionicons name="share-outline" size={27} color="#9333ea" />
                  </View>
                  <Text className="text-xs text-gray-700 mt-2">More apps</Text>
                </Pressable>

              </View>

            </Pressable>
          </Pressable>
        </Modal>
      </View>
    );
  };
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
            <PostCard item={item} />
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