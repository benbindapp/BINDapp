import { useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import React, { useState } from 'react';
import {
    Alert,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
interface InfluencerCampaignDetailsProps {
  onBack?: () => void;
  onNext?: (formData: FormData) => void;
}

interface FormData {
  platforms: {
    youtube: { selected: boolean; handle: string };
    tiktok: { selected: boolean; handle: string };
    instagram: { selected: boolean; handle: string };
    twitter: { selected: boolean; handle: string };
    twitch: { selected: boolean; handle: string };
  };
}

const InfluencerCampaignDetails: React.FC<InfluencerCampaignDetailsProps> = ({
  onBack,
  onNext,
}) => {
  const router = useRouter()
  const [formData, setFormData] = useState<FormData>({
    platforms: {
      youtube: { selected: false, handle: '' },
      tiktok: { selected: false, handle: '' },
      instagram: { selected: false, handle: '' },
      twitter: { selected: false, handle: '' },
      twitch: { selected: false, handle: '' },
    },
  });

  const handleInputChange = (platform: keyof FormData['platforms'], handle: string) => {
    setFormData(prev => ({
      ...prev,
      platforms: {
        ...prev.platforms,
        [platform]: {
          ...prev.platforms[platform],
          handle: handle
        }
      }
    }));
  };

  const handlePlatformSelect = (platform: keyof FormData['platforms']) => {
    setFormData(prev => ({
      ...prev,
      platforms: {
        ...prev.platforms,
        [platform]: {
          ...prev.platforms[platform],
          selected: !prev.platforms[platform].selected
        }
      }
    }));
  };

  const handleNext = () => {
    // Check if at least one platform is selected and has a handle
    const selectedPlatforms = Object.entries(formData.platforms).filter(([_, data]) => data.selected);
    const hasValidHandles = selectedPlatforms.every(([_, data]) => data.handle.trim() !== '');
    
    if (selectedPlatforms.length === 0) {
      Alert.alert('Missing Selection', 'Please select at least one platform.');
      return;
    }
    
    if (!hasValidHandles) {
      Alert.alert('Missing Information', 'Please enter handles for all selected platforms.');
      return;
    }

    console.log('Influencer campaign data:', formData);
    onNext?.(formData);
  };

  const platforms = [
    { id: 'youtube', name: 'YouTube', desc: 'Long-form video content' },
    { id: 'tiktok', name: 'TikTok', desc: 'Short-form vertical videos' },
    { id: 'instagram', name: 'Instagram', desc: 'Posts, stories, and reels' },
    { id: 'twitter', name: 'Twitter/X', desc: 'Tweets and threads' },
    { id: 'twitch', name: 'Twitch', desc: 'Live streaming content' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
            <ArrowLeft width={24} height={24} color="#000000" />
        </TouchableOpacity>
        <View style={styles.headerSpacer} />
      </View>

      {/* Main Content */}
      <ScrollView style={styles.mainContent} showsVerticalScrollIndicator={false}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Influencer Marketing</Text>
          <Text style={styles.subtitle}>Set up your influencer campaign details</Text>
        </View>

        {/* Form Fields */}
        <View style={styles.formContainer}>
          {/* Your Profile - Auto-filled */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Your Profile</Text>
            <View style={styles.autoFilledField}>
              <Text style={styles.autoFilledText}>Your Company Profile (Auto-filled)</Text>
            </View>
          </View>

          {/* Counter Party Profile - Auto-filled */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Counter Party Profile</Text>
            <View style={styles.autoFilledField}>
              <Text style={styles.autoFilledText}>Influencer Contact (Auto-filled)</Text>
            </View>
          </View>

          {/* Platform Selection */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Platforms</Text>
            <Text style={styles.subtext}>Select all platforms where the influencer will promote</Text>
            <View style={styles.platformsContainer}>
              {platforms.map((platform) => (
                <View key={platform.id} style={styles.platformItem}>
                  <TouchableOpacity
                    style={[
                      styles.platformButton,
                      formData.platforms[platform.id as keyof FormData['platforms']].selected && styles.platformButtonActive,
                    ]}
                    onPress={() => handlePlatformSelect(platform.id as keyof FormData['platforms'])}
                    activeOpacity={0.8}
                  >
                    <Text
                      style={[
                        styles.platformName,
                        formData.platforms[platform.id as keyof FormData['platforms']].selected && styles.platformNameActive,
                      ]}
                    >
                      {platform.name}
                    </Text>
                    <Text
                      style={[
                        styles.platformDesc,
                        formData.platforms[platform.id as keyof FormData['platforms']].selected && styles.platformDescActive,
                      ]}
                    >
                      {platform.desc}
                    </Text>
                  </TouchableOpacity>
                  
                  {/* Handle Input - Shows directly under selected platform */}
                  {formData.platforms[platform.id as keyof FormData['platforms']].selected && (
                    <View style={styles.handleInputContainer}>
                      <Text style={styles.handleLabel}>
                        {platform.id === 'youtube' ? 'YouTube Channel Handle' :
                         platform.id === 'tiktok' ? 'TikTok Handle' :
                         platform.id === 'instagram' ? 'Instagram Handle' :
                         platform.id === 'twitter' ? 'Twitter/X Handle' :
                         platform.id === 'twitch' ? 'Twitch Handle' : 'Handle'}
                      </Text>
                      <TextInput
                        style={styles.handleInput}
                        placeholder={
                          platform.id === 'youtube' ? '@channelname or channel URL' :
                          platform.id === 'tiktok' ? '@username' :
                          platform.id === 'instagram' ? '@username' :
                          platform.id === 'twitter' ? '@username' :
                          platform.id === 'twitch' ? 'username' : '@username'
                        }
                        placeholderTextColor="#9CA3AF"
                        value={formData.platforms[platform.id as keyof FormData['platforms']].handle}
                        onChangeText={(text) => handleInputChange(platform.id as keyof FormData['platforms'], text)}
                      />
                    </View>
                  )}
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressText}>Step 1 of 6</Text>
            <Text style={styles.progressText}>17%</Text>
          </View>
          <View style={styles.progressBarContainer}>
            <View style={styles.progressBar} />
          </View>
        </View>

        {/* Next Button */}
        <View style={styles.nextButtonContainer}>
          <TouchableOpacity
            style={styles.nextButton}
            onPress={handleNext}
            activeOpacity={0.8}
          >
            <Text style={styles.nextButtonText}>Next</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    backgroundColor: '#F9FAFB',
    paddingHorizontal: 16,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  headerSpacer: {
    width: 40,
  },
  mainContent: {
    paddingHorizontal: 16,
    paddingVertical: 4,
    flex: 1,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
  formContainer: {
    gap: 12,
    marginBottom: 20,
  },
  fieldContainer: {
    gap: 12,
  },
  label: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    textAlign: 'left',
  },
  subtext: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: -8,
    marginBottom: 4,
  },
  autoFilledField: {
    width: '100%',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  autoFilledText: {
    fontSize: 18,
    color: '#6B7280',
  },
  platformsContainer: {
    gap: 12,
  },
  platformItem: {
    marginBottom: 4,
  },
  platformButton: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: 'white',
  },
  platformButtonActive: {
    borderColor: '#2fb035',
    backgroundColor: '#f0fdf4',
  },
  platformName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 4,
  },
  platformNameActive: {
    color: '#16a34a',
  },
  platformDesc: {
    fontSize: 14,
    color: '#6B7280',
  },
  platformDescActive: {
    color: '#16a34a',
  },
  handleInputContainer: {
    marginTop: 12,
  },
  handleLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  handleInput: {
    width: '100%',
    backgroundColor: 'white',
    color: '#111827',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
    fontSize: 18,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  progressContainer: {
    marginBottom: 20,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  progressBarContainer: {
    width: '100%',
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#2fb035',
    width: '17%',
    borderRadius: 4,
  },
  nextButtonContainer: {
    marginBottom: 20,
  },
  nextButton: {
    width: '100%',
    backgroundColor: '#2fb035',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default InfluencerCampaignDetails;

