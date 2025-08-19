import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Settings, Trophy, Star, Calendar, Zap, Leaf, Crown, Gift } from 'lucide-react-native';
import { useAuth } from '@/hooks/useAuth';
import { useTaskGarden } from '@/hooks/useTaskGarden';

export default function ProfileScreen() {
  const { profile, signOut } = useAuth();
  const { compost, level } = useTaskGarden();

  const [achievements] = useState([
    { id: '1', name: 'First Sprout', description: 'Completed your first task', icon: '🌱', unlocked: true },
    { id: '2', name: 'Focus Master', description: 'Complete 50 focus sessions', icon: '🧘‍♀️', unlocked: true },
    { id: '3', name: 'Green Thumb', description: 'Grow 25 plants', icon: '👍', unlocked: true },
    { id: '4', name: 'Streak Warrior', description: 'Maintain a 30-day streak', icon: '🔥', unlocked: false },
    { id: '5', name: 'Garden Guardian', description: 'Complete 500 tasks', icon: '🛡️', unlocked: false },
    { id: '6', name: 'Zen Master', description: 'Complete 200 focus sessions', icon: '☯️', unlocked: false },
  ]);

  if (!profile) {
    return (
      <View style={styles.container}>
        <Text>Loading profile...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#E8F4E6', '#F5F1E8']}
        style={styles.gradient}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.profileSection}>
              <Image
                source={{ 
                  uri: profile.avatar_url || 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=120&h=120&fit=crop' 
                }}
                style={styles.avatar}
              />
              <View style={styles.profileInfo}>
                <Text style={styles.name}>{profile.display_name || 'Garden Keeper'}</Text>
                <View style={styles.levelContainer}>
                  <Star size={16} color="#F59E0B" />
                  <Text style={styles.level}>Level {profile.level}</Text>
                </View>
                <Text style={styles.subtitle}>Cultivating focus and growth</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.settingsButton} onPress={signOut}>
              <Settings size={24} color="#8B7355" />
            </TouchableOpacity>
          </View>

          {/* Stats Grid */}
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Leaf size={24} color="#87A96B" />
              <Text style={styles.statNumber}>{profile.compost}</Text>
              <Text style={styles.statLabel}>Compost</Text>
            </View>
            
            <View style={styles.statCard}>
              <Calendar size={24} color="#87A96B" />
              <Text style={styles.statNumber}>{profile.current_streak}</Text>
              <Text style={styles.statLabel}>Day Streak</Text>
            </View>
            
            <View style={styles.statCard}>
              <Zap size={24} color="#87A96B" />
              <Text style={styles.statNumber}>{profile.focus_hours}</Text>
              <Text style={styles.statLabel}>Focus Hours</Text>
            </View>
            
            <View style={styles.statCard}>
              <Trophy size={24} color="#87A96B" />
              <Text style={styles.statNumber}>{profile.plants_grown}</Text>
              <Text style={styles.statLabel}>Plants Grown</Text>
            </View>
          </View>

          {/* Inventory */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Seed Inventory</Text>
            <View style={styles.inventoryGrid}>
              <TouchableOpacity style={styles.seedCard}>
                <Text style={styles.seedEmoji}>🌱</Text>
                <Text style={styles.seedName}>Basic Seeds</Text>
                <Text style={styles.seedCount}>∞</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.seedCard}>
                <Text style={styles.seedEmoji}>🌺</Text>
                <Text style={styles.seedName}>Rare Orchid</Text>
                <Text style={styles.seedCount}>{profile.rare_seeds}</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.seedCard}>
                <Text style={styles.seedEmoji}>🌳</Text>
                <Text style={styles.seedName}>Ancient Oak</Text>
                <Text style={styles.seedCount}>{Math.floor(profile.rare_seeds / 2)}</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.shopCard}>
                <Gift size={20} color="#87A96B" />
                <Text style={styles.shopText}>Shop</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Achievements */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Achievements</Text>
            <View style={styles.achievementsList}>
              {achievements.map((achievement) => (
                <View
                  key={achievement.id}
                  style={[
                    styles.achievementCard,
                    !achievement.unlocked && styles.lockedAchievement
                  ]}
                >
                  <Text style={[
                    styles.achievementIcon,
                    !achievement.unlocked && styles.lockedIcon
                  ]}>
                    {achievement.unlocked ? achievement.icon : '🔒'}
                  </Text>
                  <View style={styles.achievementContent}>
                    <Text style={[
                      styles.achievementName,
                      !achievement.unlocked && styles.lockedText
                    ]}>
                      {achievement.name}
                    </Text>
                    <Text style={[
                      styles.achievementDescription,
                      !achievement.unlocked && styles.lockedText
                    ]}>
                      {achievement.description}
                    </Text>
                  </View>
                  {achievement.unlocked && (
                    <Crown size={16} color="#F59E0B" />
                  )}
                </View>
              ))}
            </View>
          </View>

          {/* XION Integration Status */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Blockchain Integration</Text>
            <View style={styles.blockchainCard}>
              <View style={styles.blockchainHeader}>
                <Text style={styles.blockchainTitle}>XION Wallet</Text>
                <View style={styles.statusBadge}>
                  <Text style={styles.statusText}>Connected</Text>
                </View>
              </View>
              <Text style={styles.blockchainDescription}>
                Your achievements are secured on-chain with zkTLS verification
              </Text>
              <TouchableOpacity style={styles.blockchainButton}>
                <Text style={styles.blockchainButtonText}>View on Explorer</Text>
              </TouchableOpacity>
            </View>
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
    marginBottom: 32,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    flex: 1,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 3,
    borderColor: '#87A96B',
  },
  profileInfo: {
    flex: 1,
  },
  name: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2C5F41',
    marginBottom: 4,
  },
  levelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  level: {
    fontSize: 14,
    fontWeight: '600',
    color: '#F59E0B',
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  settingsButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(229, 221, 208, 0.6)',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 32,
  },
  statCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    width: '47%',
    borderWidth: 1,
    borderColor: 'rgba(229, 221, 208, 0.6)',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2C5F41',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2C5F41',
    marginBottom: 16,
  },
  inventoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  seedCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    width: '47%',
    borderWidth: 1,
    borderColor: 'rgba(229, 221, 208, 0.6)',
  },
  seedEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  seedName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#2C5F41',
    textAlign: 'center',
    marginBottom: 4,
  },
  seedCount: {
    fontSize: 12,
    color: '#87A96B',
    fontWeight: '600',
  },
  shopCard: {
    backgroundColor: 'rgba(135, 169, 107, 0.1)',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    width: '47%',
    borderWidth: 2,
    borderColor: '#87A96B',
    borderStyle: 'dashed',
  },
  shopText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#87A96B',
    marginTop: 4,
  },
  achievementsList: {
    gap: 12,
  },
  achievementCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: 'rgba(229, 221, 208, 0.6)',
  },
  lockedAchievement: {
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    borderColor: 'rgba(229, 221, 208, 0.3)',
  },
  achievementIcon: {
    fontSize: 24,
  },
  lockedIcon: {
    opacity: 0.3,
  },
  achievementContent: {
    flex: 1,
  },
  achievementName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C5F41',
    marginBottom: 2,
  },
  achievementDescription: {
    fontSize: 14,
    color: '#6B7280',
  },
  lockedText: {
    opacity: 0.5,
  },
  blockchainCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(229, 221, 208, 0.6)',
  },
  blockchainHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  blockchainTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C5F41',
  },
  statusBadge: {
    backgroundColor: 'rgba(135, 169, 107, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 12,
    color: '#87A96B',
    fontWeight: '500',
  },
  blockchainDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 16,
    lineHeight: 20,
  },
  blockchainButton: {
    backgroundColor: '#87A96B',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
  },
  blockchainButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#F5F1E8',
  },
});