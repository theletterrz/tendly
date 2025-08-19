import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Heart, MessageCircle, Share2, Trophy, Star, Users } from 'lucide-react-native';
import { useAuth } from '@/hooks/useAuth';

export default function SocialScreen() {
  const { profile } = useAuth();
  
  // Sample posts - in real app, these would come from Supabase
  const [posts, setPosts] = useState([
    {
      id: '1',
      user: {
        name: 'Sarah Chen',
        avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
        level: 8,
      },
      achievement: 'Completed 50 focus sessions! 🎉',
      gardenImage: 'https://images.pexels.com/photos/1072824/pexels-photo-1072824.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
      likes: 24,
      comments: 3,
      isLiked: true,
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    },
    {
      id: '2',
      user: {
        name: 'Alex Rivera',
        avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
        level: 12,
      },
      achievement: 'Growing rare Midnight Orchid! 🌺',
      gardenImage: 'https://images.pexels.com/photos/1166209/pexels-photo-1166209.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
      likes: 18,
      comments: 7,
      isLiked: false,
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
    },
    {
      id: '3',
      user: {
        name: 'Maya Patel',
        avatar: 'https://images.pexels.com/photos/762080/pexels-photo-762080.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
        level: 6,
      },
      achievement: '30-day streak achieved! 🔥',
      gardenImage: 'https://images.pexels.com/photos/1382394/pexels-photo-1382394.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
      likes: 42,
      comments: 12,
      isLiked: true,
      timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000),
    },
  ]);

  const toggleLike = (postId: string) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { 
            ...post, 
            isLiked: !post.isLiked,
            likes: post.isLiked ? post.likes - 1 : post.likes + 1
          }
        : post
    ));
  };

  const formatTimeAgo = (date: Date) => {
    const hours = Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60));
    if (hours < 1) return 'Just now';
    if (hours === 1) return '1 hour ago';
    return `${hours} hours ago`;
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#E8F4E6', '#F5F1E8']}
        style={styles.gradient}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.title}>Garden Community</Text>
              <Text style={styles.subtitle}>Share your growth journey</Text>
            </View>
            <TouchableOpacity style={styles.shareButton}>
              <Share2 size={20} color="#87A96B" />
            </TouchableOpacity>
          </View>

          {/* Weekly Challenge */}
          <View style={styles.challengeCard}>
            <LinearGradient
              colors={['#87A96B', '#6B8E5A']}
              style={styles.challengeGradient}
            >
              <View style={styles.challengeHeader}>
                <Trophy size={24} color="#F5F1E8" />
                <Text style={styles.challengeTitle}>Weekly Challenge</Text>
              </View>
              <Text style={styles.challengeDescription}>
                Complete 20 focus sessions this week
              </Text>
              <View style={styles.challengeProgress}>
                <View style={styles.progressBar}>
                  <View style={[styles.progressFill, { width: '65%' }]} />
                </View>
                <Text style={styles.progressText}>13/20 sessions</Text>
              </View>
            </LinearGradient>
          </View>

          {/* Leaderboard Preview */}
          <View style={styles.leaderboardCard}>
            <View style={styles.leaderboardHeader}>
              <Users size={20} color="#87A96B" />
              <Text style={styles.leaderboardTitle}>This Week's Leaders</Text>
            </View>
            <View style={styles.leaderboardList}>
              {[
                { name: 'Emma Watson', level: 15, sessions: 28, rank: 1 },
                { name: profile?.display_name || 'You', level: profile?.level || 1, sessions: 13, rank: 2 },
                { name: 'John Doe', level: 11, sessions: 12, rank: 3 },
              ].map((leader, index) => (
                <View key={index} style={styles.leaderItem}>
                  <View style={styles.leaderLeft}>
                    <Text style={styles.leaderRank}>#{leader.rank}</Text>
                    <Text style={styles.leaderName}>{leader.name}</Text>
                    <View style={styles.levelBadge}>
                      <Star size={12} color="#F59E0B" />
                      <Text style={styles.levelText}>{leader.level}</Text>
                    </View>
                  </View>
                  <Text style={styles.leaderSessions}>{leader.sessions}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Community Posts */}
          <View style={styles.postsSection}>
            <Text style={styles.sectionTitle}>Community Gardens</Text>
            
            {posts.map((post) => (
              <View key={post.id} style={styles.postCard}>
                <View style={styles.postHeader}>
                  <Image source={{ uri: post.user.avatar }} style={styles.avatar} />
                  <View style={styles.userInfo}>
                    <View style={styles.userNameRow}>
                      <Text style={styles.userName}>{post.user.name}</Text>
                      <View style={styles.levelBadge}>
                        <Star size={12} color="#F59E0B" />
                        <Text style={styles.levelText}>{post.user.level}</Text>
                      </View>
                    </View>
                    <Text style={styles.timestamp}>{formatTimeAgo(post.timestamp)}</Text>
                  </View>
                </View>

                <Text style={styles.achievement}>{post.achievement}</Text>
                
                <Image source={{ uri: post.gardenImage }} style={styles.gardenImage} />
                
                <View style={styles.postActions}>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => toggleLike(post.id)}
                  >
                    <Heart 
                      size={20} 
                      color={post.isLiked ? '#D97757' : '#8B7355'} 
                      fill={post.isLiked ? '#D97757' : 'transparent'}
                    />
                    <Text style={[styles.actionText, post.isLiked && styles.likedText]}>
                      {post.likes}
                    </Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity style={styles.actionButton}>
                    <MessageCircle size={20} color="#8B7355" />
                    <Text style={styles.actionText}>{post.comments}</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity style={styles.actionButton}>
                    <Share2 size={20} color="#8B7355" />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F1E8',
  },
  gradient: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#2C5F41',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
  },
  shareButton: {
    backgroundColor: 'rgba(135, 169, 107, 0.1)',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(135, 169, 107, 0.2)',
  },
  challengeCard: {
    borderRadius: 20,
    marginBottom: 24,
    overflow: 'hidden',
  },
  challengeGradient: {
    padding: 20,
  },
  challengeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  challengeTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#F5F1E8',
  },
  challengeDescription: {
    fontSize: 14,
    color: 'rgba(245, 241, 232, 0.9)',
    marginBottom: 16,
  },
  challengeProgress: {
    gap: 8,
  },
  progressBar: {
    height: 6,
    backgroundColor: 'rgba(245, 241, 232, 0.3)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#F5F1E8',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    color: '#F5F1E8',
    fontWeight: '500',
  },
  leaderboardCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: 'rgba(229, 221, 208, 0.6)',
  },
  leaderboardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  leaderboardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C5F41',
  },
  leaderboardList: {
    gap: 12,
  },
  leaderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  leaderRank: {
    fontSize: 16,
    fontWeight: '700',
    color: '#87A96B',
    width: 24,
  },
  leaderName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#2C5F41',
    flex: 1,
  },
  levelBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  levelText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#F59E0B',
  },
  leaderSessions: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  postsSection: {
    gap: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2C5F41',
    marginBottom: 16,
  },
  postCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(229, 221, 208, 0.6)',
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  userInfo: {
    flex: 1,
  },
  userNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 2,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C5F41',
  },
  timestamp: {
    fontSize: 12,
    color: '#8B7355',
  },
  achievement: {
    fontSize: 14,
    color: '#2C5F41',
    marginBottom: 12,
    lineHeight: 20,
  },
  gardenImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 12,
  },
  postActions: {
    flexDirection: 'row',
    gap: 20,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  actionText: {
    fontSize: 14,
    color: '#8B7355',
    fontWeight: '500',
  },
  likedText: {
    color: '#D97757',
  },
});