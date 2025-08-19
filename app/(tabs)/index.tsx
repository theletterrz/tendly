import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Sprout, Sun, Cloud, CloudRain, Droplets } from 'lucide-react-native';
import { GardenPlant } from '@/components/GardenPlant';
import { WeatherMood } from '@/components/WeatherMood';
import { CompostCounter } from '@/components/CompostCounter';
import { useTaskGarden } from '@/hooks/useTaskGarden';
import { useAuth } from '@/hooks/useAuth';

const { width } = Dimensions.get('window');

export default function GardenScreen() {
  const { plants, compost, level, tasks, profile } = useTaskGarden();
  const { updateProfile } = useAuth();
  
  const [mood, setMood] = useState<'sunny' | 'cloudy' | 'rainy'>(profile?.mood || 'sunny');

  const handleMoodChange = async (newMood: 'sunny' | 'cloudy' | 'rainy') => {
    setMood(newMood);
    if (updateProfile) {
      await updateProfile({ mood: newMood });
    }
  };

  const completedTasks = tasks.filter(task => task.completed);
  const pendingTasks = tasks.filter(task => !task.completed);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#E8F4E6', '#F5F1E8', '#E5DDD0']}
        style={styles.gradient}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <Text style={styles.greeting}>Good morning! 🌱</Text>
              <Text style={styles.subtitle}>Your garden is flourishing</Text>
            </View>
            <CompostCounter count={compost} />
          </View>

          {/* Weather Mood */}
          <WeatherMood mood={mood} onMoodChange={handleMoodChange} />

          {/* Garden Area */}
          <View style={styles.gardenContainer}>
            <Text style={styles.gardenTitle}>My Garden</Text>

            <View style={styles.garden}>
              {plants.map((plant) => (
                <GardenPlant
                  key={plant.id}
                  plant={{
                    id: plant.id,
                    type: plant.type,
                    taskName: tasks.find(t => t.id === plant.task_id)?.title || 'Unknown task',
                    growth: plant.growth,
                    position: { x: plant.position_x, y: plant.position_y },
                    planted: new Date(plant.planted_at),
                  }}
                  style={{
                    ...styles.plantPosition,
                    left: plant.position_x,
                    top: plant.position_y,
                  }}
                />
              ))}

              {/* Empty plot indicator */}
              <TouchableOpacity
                style={[styles.emptyPlot, { left: 80, top: 280 }]}
              >
                <View style={styles.emptyPlotInner}>
                  <Sprout size={24} color="#C4B59A" />
                  <Text style={styles.emptyPlotText}>Plant a task</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>

          {/* Quick Actions */}
          <View style={styles.quickActions}>
            <TouchableOpacity style={styles.actionButton}>
              {/* <CheckSquare size={20} color="#87A96B" /> */}
              <Text style={styles.actionText}>Add Task</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton}>
              {/* <Timer size={20} color="#87A96B" /> */}
              <Text style={styles.actionText}>Start Focus</Text>
            </TouchableOpacity>
          </View>

          {/* Garden Stats */}
          <View style={styles.stats}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{plants.length}</Text>
              <Text style={styles.statLabel}>Plants</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{profile?.current_streak || 0}</Text>
              <Text style={styles.statLabel}>Day Streak</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{profile?.focus_hours || 0}</Text>
              <Text style={styles.statLabel}>Focus Hours</Text>
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
    marginBottom: 24,
  },
  headerLeft: {
    flex: 1,
  },
  greeting: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2C5F41',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '400',
  },
  gardenContainer: {
    marginBottom: 32,
  },
  gardenTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2C5F41',
    marginBottom: 16,
  },
  garden: {
    backgroundColor: 'rgba(229, 221, 208, 0.3)',
    borderRadius: 20,
    minHeight: 400,
    position: 'relative',
    borderWidth: 2,
    borderColor: 'rgba(196, 181, 154, 0.3)',
  },
  plantPosition: {
    position: 'absolute',
  },
  emptyPlot: {
    position: 'absolute',
    width: 60,
    height: 60,
  },
  emptyPlotInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(196, 181, 154, 0.2)',
    borderWidth: 2,
    borderColor: '#C4B59A',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyPlotText: {
    fontSize: 10,
    color: '#8B7355',
    fontWeight: '500',
    marginTop: 2,
  },
  quickActions: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 32,
  },
  actionButton: {
    flex: 1,
    backgroundColor: 'rgba(135, 169, 107, 0.1)',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: 'rgba(135, 169, 107, 0.2)',
  },
  actionText: {
    color: '#87A96B',
    fontWeight: '600',
    fontSize: 14,
  },
  stats: {
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderRadius: 20,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderWidth: 1,
    borderColor: 'rgba(229, 221, 208, 0.8)',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2C5F41',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
});
