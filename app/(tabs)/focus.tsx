import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Play, Pause, RotateCcw, Settings, Leaf } from 'lucide-react-native';

export default function FocusScreen() {
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<'focus' | 'break'>('focus');
  const [sessions, setSessions] = useState(0);
  
  const totalSeconds = minutes * 60 + seconds;
  const initialSeconds = mode === 'focus' ? 25 * 60 : 5 * 60;
  const progress = 1 - (totalSeconds / initialSeconds);
  
  const progressAnim = useRef(new Animated.Value(0)).current;
  const plantGrowthAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isActive && totalSeconds > 0) {
      interval = setInterval(() => {
        if (seconds > 0) {
          setSeconds(seconds - 1);
        } else if (minutes > 0) {
          setMinutes(minutes - 1);
          setSeconds(59);
        }
      }, 1000);
    } else if (totalSeconds === 0) {
      setIsActive(false);
      completeSession();
    }
    
    return () => clearInterval(interval);
  }, [isActive, minutes, seconds, totalSeconds]);

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: progress,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [progress]);

  const completeSession = () => {
    if (mode === 'focus') {
      setSessions(prev => prev + 1);
      setMode('break');
      setMinutes(5);
      setSeconds(0);
      
      // Animate plant growth
      Animated.spring(plantGrowthAnim, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }).start(() => {
        plantGrowthAnim.setValue(0);
      });
    } else {
      setMode('focus');
      setMinutes(25);
      setSeconds(0);
    }
  };

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setMinutes(mode === 'focus' ? 25 : 5);
    setSeconds(0);
  };

  const formatTime = (mins: number, secs: number) => {
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={mode === 'focus' ? ['#E8F4E6', '#F0F8EE'] : ['#FFF7ED', '#FEF3E2']}
        style={styles.gradient}
      >
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>
              {mode === 'focus' ? 'Focus Time' : 'Break Time'}
            </Text>
            <Text style={styles.subtitle}>
              Session {sessions + 1} • {mode === 'focus' ? 'Grow your plants' : 'Rest and recharge'}
            </Text>
          </View>

          {/* Timer Circle */}
          <View style={styles.timerContainer}>
            <View style={styles.timerCircle}>
              <Animated.View
                style={[
                  styles.progressRing,
                  {
                    transform: [{
                      rotate: progressAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: ['0deg', '360deg'],
                      }),
                    }],
                  },
                ]}
              />
              
              {/* Plant Growth Animation */}
              <Animated.View
                style={[
                  styles.plantContainer,
                  {
                    transform: [{
                      scale: plantGrowthAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [1, 1.2],
                      }),
                    }],
                  },
                ]}
              >
                <Text style={styles.plantEmoji}>
                  {progress < 0.3 ? '🌱' : progress < 0.7 ? '🌿' : '🌳'}
                </Text>
              </Animated.View>
              
              <Text style={styles.timerText}>
                {formatTime(minutes, seconds)}
              </Text>
              
              <Text style={styles.modeText}>
                {mode === 'focus' ? 'Focus deeply' : 'Take a break'}
              </Text>
            </View>
          </View>

          {/* Controls */}
          <View style={styles.controls}>
            <TouchableOpacity
              style={styles.controlButton}
              onPress={resetTimer}
            >
              <RotateCcw size={24} color="#8B7355" />
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.mainButton, isActive && styles.pauseButton]}
              onPress={toggleTimer}
            >
              {isActive ? (
                <Pause size={32} color="#F5F1E8" />
              ) : (
                <Play size={32} color="#F5F1E8" />
              )}
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.controlButton}
            >
              <Settings size={24} color="#8B7355" />
            </TouchableOpacity>
          </View>

          {/* Stats */}
          <View style={styles.stats}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{sessions}</Text>
              <Text style={styles.statLabel}>Sessions Today</Text>
            </View>
            
            <View style={styles.statCard}>
              <View style={styles.compostReward}>
                <Leaf size={16} color="#87A96B" />
                <Text style={styles.compostText}>+{sessions * 5}</Text>
              </View>
              <Text style={styles.statLabel}>Compost Earned</Text>
            </View>
            
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>7</Text>
              <Text style={styles.statLabel}>Day Streak</Text>
            </View>
          </View>

          {/* Focus Tips */}
          <View style={styles.tipCard}>
            <Text style={styles.tipTitle}>🧘‍♀️ Focus Tip</Text>
            <Text style={styles.tipText}>
              Remove distractions from your workspace. Put your phone in another room or use app blockers.
            </Text>
          </View>
        </View>
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
  content: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#2C5F41',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 22,
  },
  timerContainer: {
    marginBottom: 48,
  },
  timerCircle: {
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderWidth: 8,
    borderColor: 'rgba(229, 221, 208, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  progressRing: {
    position: 'absolute',
    width: 296,
    height: 296,
    borderRadius: 148,
    borderWidth: 4,
    borderColor: '#87A96B',
    borderRightColor: 'transparent',
    borderBottomColor: 'transparent',
  },
  plantContainer: {
    position: 'absolute',
    top: 40,
  },
  plantEmoji: {
    fontSize: 48,
  },
  timerText: {
    fontSize: 48,
    fontWeight: '300',
    color: '#2C5F41',
    marginTop: 20,
  },
  modeText: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 8,
    fontWeight: '500',
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 24,
    marginBottom: 48,
  },
  controlButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(229, 221, 208, 0.6)',
  },
  mainButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#87A96B',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  pauseButton: {
    backgroundColor: '#D97757',
  },
  stats: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 32,
  },
  statCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    minWidth: 80,
    borderWidth: 1,
    borderColor: 'rgba(229, 221, 208, 0.6)',
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
    textAlign: 'center',
    lineHeight: 16,
  },
  compostReward: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  compostText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#87A96B',
  },
  tipCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 16,
    padding: 20,
    width: '100%',
    borderWidth: 1,
    borderColor: 'rgba(229, 221, 208, 0.6)',
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C5F41',
    marginBottom: 8,
  },
  tipText: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
});