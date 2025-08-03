import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Sun, Cloud, CloudRain } from 'lucide-react-native';

interface WeatherMoodProps {
  mood: 'sunny' | 'cloudy' | 'rainy';
  onMoodChange: (mood: 'sunny' | 'cloudy' | 'rainy') => void;
}

export function WeatherMood({ mood, onMoodChange }: WeatherMoodProps) {
  const getWeatherInfo = () => {
    switch (mood) {
      case 'sunny':
        return {
          icon: <Sun size={24} color="#F59E0B" />,
          text: 'Feeling bright and motivated',
          gradient: ['#FEF3C7', '#FDE68A'],
        };
      case 'cloudy':
        return {
          icon: <Cloud size={24} color="#6B7280" />,
          text: 'Taking things steady',
          gradient: ['#F3F4F6', '#E5E7EB'],
        };
      case 'rainy':
        return {
          icon: <CloudRain size={24} color="#3B82F6" />,
          text: 'Nurturing and reflective',
          gradient: ['#DBEAFE', '#BFDBFE'],
        };
    }
  };

  const weatherInfo = getWeatherInfo();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Today's Garden Weather</Text>
      
      <View style={styles.weatherSelector}>
        {(['sunny', 'cloudy', 'rainy'] as const).map((weatherType) => {
          const isSelected = mood === weatherType;
          const weatherTypeInfo = weatherType === 'sunny' 
            ? { icon: <Sun size={20} color={isSelected ? "#F59E0B" : "#C4B59A"} />, label: 'Sunny' }
            : weatherType === 'cloudy'
            ? { icon: <Cloud size={20} color={isSelected ? "#6B7280" : "#C4B59A"} />, label: 'Cloudy' }
            : { icon: <CloudRain size={20} color={isSelected ? "#3B82F6" : "#C4B59A"} />, label: 'Rainy' };
          
          return (
            <TouchableOpacity
              key={weatherType}
              style={[
                styles.weatherOption,
                isSelected && styles.selectedWeather
              ]}
              onPress={() => onMoodChange(weatherType)}
            >
              {weatherTypeInfo.icon}
              <Text style={[
                styles.weatherLabel,
                isSelected && styles.selectedLabel
              ]}>
                {weatherTypeInfo.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={styles.currentWeather}>
        {weatherInfo.icon}
        <Text style={styles.weatherText}>{weatherInfo.text}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C5F41',
    marginBottom: 12,
  },
  weatherSelector: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  weatherOption: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    gap: 4,
    borderWidth: 1,
    borderColor: 'rgba(229, 221, 208, 0.6)',
  },
  selectedWeather: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderColor: '#87A96B',
  },
  weatherLabel: {
    fontSize: 12,
    color: '#8B7355',
    fontWeight: '500',
  },
  selectedLabel: {
    color: '#2C5F41',
  },
  currentWeather: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(229, 221, 208, 0.6)',
  },
  weatherText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
});