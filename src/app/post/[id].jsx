
import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  Pressable,
  StatusBar,
  TextInput,
  Modal,
  Share,
  Alert,
  Linking,
} from 'react-native';

import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useResource } from '../../contexts/resourceProvider';

const PostDetails = () => {
  const { id } = useLocalSearchParams();
  const { blogs } = useResource();

  const post = blogs?.find(
    (item, index) => String(item.id ?? index) === String(id)
  );

  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(post?.likes || 0);
  const [comments, setComments] = useState(post?.comments || []);
  const [commentText, setCommentText] = useState('');
  const [showShareModal, setShowShareModal] = useState(false);

  if (!post) {
    return (
      <View className="flex-1 bg-white items-center justify-center">
        <Text className="text-gray-700">Post not found.</Text>
        <Pressable onPress={() => router.back()} className="mt-4">
          <Text className="text-blue-600 font-semibold">Go back</Text>
        </Pressable>
      </View>
    );
  }

  // LIKE
  const handleLike = () => {
    setLiked(previous => !previous);
    setLikes(previous => Math.max(0, previous + (liked ? -1 : 1)));
  };

  // COMMENT
  const handleComment = () => {
    if (!commentText.trim()) return;

    setComments(previous => [
      ...previous,
      {
        id: Date.now().toString(),
        text: commentText.trim(),
        author: 'Store Owner',
      },
    ]);

    setCommentText('');
  };

  // SHARE CONTENT
  const getShareContent = () => [
    post.text,
    post.shareUrl || '',
  ].filter(Boolean).join('\n\n');

  // SHARE
  const shareTo = async (platform) => {
    const message = getShareContent();
    const encodedMessage = encodeURIComponent(message);
    const encodedUrl = encodeURIComponent(post.shareUrl || '');

    try {
      let url = '';

      switch (platform) {
        case 'whatsapp':
          url = `https://wa.me/?text=${encodedMessage}`;
          break;

        case 'facebook':
          if (!post.shareUrl) {
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

      if (url) await Linking.openURL(url);

      setShowShareModal(false);
    } catch (error) {
      Alert.alert('Error', 'Unable to share this post.');
    }
  };

  return (
    <View className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" backgroundColor="white" />

      {/*
      <View className="flex-row items-center p-4 border-b border-gray-100">
        <Pressable onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={25} color="#111" />
        </Pressable>

        <Text className="text-lg font-bold ml-4">Post Details</Text>
      </View> */}

      <ScrollView showsVerticalScrollIndicator={false}>

        {/* USER */}
        <View className="p-4 flex-row items-center gap-3">
          <Image
            source={{
              uri: post.user?.avatar || 'https://via.placeholder.com/150',
            }}
            className="w-12 h-12 rounded-full bg-gray-200"
          />

          <View>
            <Text className="font-bold text-gray-900">
              {post.user?.name || 'Store Update'}
            </Text>

            <Text className="text-xs text-gray-500">
              {post.createdAt}
            </Text>
          </View>
        </View>

        {/* POST TEXT */}
        <View className="px-4 pb-4">
          <Text className="text-gray-900 text-base leading-7">
            {post.text}
          </Text>
        </View>

        {/* POST IMAGE */}
        {post.image && (
          <Image
            source={{ uri: post.image }}
            className="w-full h-80 bg-gray-100"
            resizeMode="cover"
          />
        )}

        {/* STATS */}
        <View className="flex-row justify-between p-4 border-b border-gray-100">
          <Text className="text-gray-500">
            {likes} Likes
          </Text>

          <Text className="text-gray-500">
            {comments.length} Comments
          </Text>
        </View>

        {/* ACTIONS */}
        <View className="flex-row justify-around py-3 border-b border-gray-100">

          <Pressable onPress={handleLike} className="flex-row items-center gap-2">
            <Ionicons
              name={liked ? 'thumbs-up' : 'thumbs-up-outline'}
              size={21}
              color={liked ? '#2563eb' : '#4b5563'}
            />
            <Text className={liked ? 'text-blue-600 font-semibold' : 'text-gray-600'}>
              Like
            </Text>
          </Pressable>

          <Pressable
            onPress={() => {
              // Focus the comment input
            }}
            className="flex-row items-center gap-2"
          >
            <Ionicons name="chatbox-ellipses-outline" size={21} color="#4b5563" />
            <Text className="text-gray-600">Comment</Text>
          </Pressable>

          <Pressable
            onPress={() => setShowShareModal(true)}
            className="flex-row items-center gap-2"
          >
            <Ionicons name="arrow-redo-outline" size={21} color="#4b5563" />
            <Text className="text-gray-600">Share</Text>
          </Pressable>

        </View>

        {/* COMMENTS */}
        <View className="p-4">

          <Text className="font-bold text-lg mb-4">
            Comments ({comments.length})
          </Text>

          {comments.length > 0 ? (
            comments.map((comment, index) => (
              <View
                key={comment.id || index}
                className="bg-gray-50 p-3 rounded-xl mb-3"
              >
                <Text className="font-semibold text-gray-700">
                  {comment.author || 'User'}
                </Text>

                <Text className="text-gray-600 mt-1">
                  {comment.text}
                </Text>
              </View>
            ))
          ) : (
            <Text className="text-gray-400 mb-4">
              No comments yet. Be the first to comment!
            </Text>
          )}

          {/* COMMENT INPUT */}
          <View className="flex-row items-center gap-2 mt-3">
            <TextInput
              value={commentText}
              onChangeText={setCommentText}
              placeholder="Write a comment..."
              placeholderTextColor="#999"
              multiline
              className="flex-1 bg-gray-100 rounded-xl px-4 py-3 text-gray-900"
            />

            <Pressable
              onPress={handleComment}
              disabled={!commentText.trim()}
              className="bg-blue-600 p-3 rounded-xl"
            >
              <Ionicons
                name="send"
                size={20}
                color="white"
              />
            </Pressable>
          </View>

        </View>

      </ScrollView>

      {/* SHARE MODAL */}
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
            onPress={() => {}}
            className="bg-white rounded-t-3xl px-5 pt-5 pb-10"
          >

            <View className="flex-row items-center justify-between mb-6">
              <Text className="text-lg font-bold text-gray-900">
                Share post
              </Text>

              <Pressable onPress={() => setShowShareModal(false)}>
                <Ionicons name="close" size={25} color="#333" />
              </Pressable>
            </View>

            <View className="flex-row flex-wrap justify-between">

              <ShareOption
                icon="logo-whatsapp"
                label="WhatsApp"
                color="#16a34a"
                background="#dcfce7"
                onPress={() => shareTo('whatsapp')}
              />

              <ShareOption
                icon="logo-facebook"
                label="Facebook"
                color="#1877F2"
                background="#dbeafe"
                onPress={() => shareTo('facebook')}
              />

              <ShareOption
                icon="logo-twitter"
                label="X"
                color="#111"
                background="#e5e7eb"
                onPress={() => shareTo('x')}
              />

              <ShareOption
                icon="share-outline"
                label="More apps"
                color="#9333ea"
                background="#f3e8ff"
                onPress={() => shareTo('more')}
              />

            </View>
          </Pressable>
        </Pressable>
      </Modal>

    </View>
  );
};

const ShareOption = ({ icon, label, color, background, onPress }) => (
  <Pressable
    onPress={onPress}
    className="w-[23%] items-center mb-5"
  >
    <View
      style={{ backgroundColor: background }}
      className="w-14 h-14 rounded-full items-center justify-center"
    >
      <Ionicons name={icon} size={27} color={color} />
    </View>

    <Text className="text-xs text-gray-700 mt-2">
      {label}
    </Text>
  </Pressable>
);

export default PostDetails;
