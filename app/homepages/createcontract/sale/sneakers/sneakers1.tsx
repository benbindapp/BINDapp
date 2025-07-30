import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { ArrowLeft, Camera, Image as ImageIcon, Plus, X } from 'lucide-react-native';
import React, { useState } from 'react';
import {
  Alert,
  Image,
  Modal,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

interface FormData {
  brand: string;
  model: string;
  colorway: string;
  size: string;
  condition: string;
  box: string;
  authentication: string;
  photos: string[];
}

interface SneakerDetailsProps {
  onBack?: () => void;
  onNext?: (formData: FormData) => void;
}

const SneakerDetails: React.FC<SneakerDetailsProps> = ({
  onBack,
  onNext,
}) => {
  const [formData, setFormData] = useState<FormData>({
    brand: '',
    model: '',
    colorway: '',
    size: '',
    condition: '',
    box: '',
    authentication: '',
    photos: [],
  });

  const router = useRouter()
  const [showPhotoOptions, setShowPhotoOptions] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const handleInputChange = (field: keyof FormData, value: string) => {
    if (field === 'photos') return;
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddPhotos = () => {
    if (formData.photos.length >= 10) {
      return;
    }
    setShowPhotoOptions(true);
  };

  const requestCameraPermission = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Camera permission is required to take photos');
      return false;
    }
    return true;
  };

  const requestMediaLibraryPermission = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Media library permission is required to select photos');
      return false;
    }
    return true;
  };

  const takePhoto = async () => {
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) return;

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      addPhotosToForm(result.assets.map(asset => asset.uri));
    }
    setShowPhotoOptions(false);
  };

  const selectFromLibrary = async () => {
    const hasPermission = await requestMediaLibraryPermission();
    if (!hasPermission) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      addPhotosToForm(result.assets.map(asset => asset.uri));
    }
    setShowPhotoOptions(false);
  };

  const addPhotosToForm = (newPhotoUris: string[]) => {
    const currentPhotos = formData.photos;
    const availableSlots = 10 - currentPhotos.length;
    const photosToAdd = newPhotoUris.slice(0, availableSlots);
    
    setFormData(prev => ({
      ...prev,
      photos: [...prev.photos, ...photosToAdd]
    }));
  };

  const removePhoto = (index: number) => {
    setFormData(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index)
    }));
  };

  const handleNext = () => {
    console.log('Form data:', formData);
    onNext?.(formData);
  };

  const DropdownButton: React.FC<{ 
    value: string; 
    placeholder: string; 
    options: string[];
    onSelect: (value: string) => void;
    fieldName: string;
  }> = ({ value, placeholder, options, onSelect, fieldName }) => {
    const isOpen = openDropdown === fieldName;

    return (
      <View style={styles.dropdownContainer}>
        <TouchableOpacity
          style={styles.dropdownButton}
          onPress={() => setOpenDropdown(isOpen ? null : fieldName)}
        >
          <Text style={value ? styles.dropdownText : styles.dropdownPlaceholder}>
            {value || placeholder}
          </Text>
          <View style={[styles.dropdownArrow, isOpen && styles.dropdownArrowOpen]}>
            <Text style={styles.dropdownArrowText}>▼</Text>
          </View>
        </TouchableOpacity>
        
        {isOpen && (
          <View style={styles.dropdownMenu}>
            <ScrollView style={styles.dropdownScrollView} nestedScrollEnabled>
              {options.map((option, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.dropdownOption,
                    index === options.length - 1 && styles.dropdownOptionLast
                  ]}
                  onPress={() => {
                    onSelect(option);
                    setOpenDropdown(null);
                  }}
                >
                  <Text style={styles.dropdownOptionText}>{option}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F9FAFB" />
      
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
          <Text style={styles.title}>Sneaker Details</Text>
          <Text style={styles.subtitle}>Fill in the details of the sneakers being sold</Text>
        </View>

        {/* Form Fields */}
        <View style={styles.formContainer}>
          {/* Brand */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Brand</Text>
            <DropdownButton
              value={formData.brand}
              placeholder="Select sneaker brand"
              fieldName="brand"
              options={[
                'Jordan',
                'Nike',
                'Adidas',
                'Yeezy',
                'Off-White',
                'Travis Scott',
                'New Balance',
                'Asics',
                'Converse',
                'Vans',
                'Puma',
                'Reebok',
                'Balenciaga',
                'Golden Goose',
                'Common Projects',
                'Fear of God',
                'Stone Island',
                'Dior',
                'Louis Vuitton',
                'Gucci',
                'Other'
              ]}
              onSelect={(value) => handleInputChange('brand', value)}
            />
          </View>

          {/* Model */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Model</Text>
            <Text style={styles.sublabel}>Specific sneaker model name</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., Air Jordan 1 High, Dunk Low, Yeezy 350 V2"
              placeholderTextColor="#9CA3AF"
              value={formData.model}
              onChangeText={(value) => handleInputChange('model', value)}
            />
          </View>

          {/* Colorway */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Colorway</Text>
            <Text style={styles.sublabel}>Official colorway name or description</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., Chicago, Bred, Triple White, Travis Scott"
              placeholderTextColor="#9CA3AF"
              value={formData.colorway}
              onChangeText={(value) => handleInputChange('colorway', value)}
            />
          </View>

          {/* Size */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Size</Text>
            <DropdownButton
              value={formData.size}
              placeholder="Select size"
              fieldName="size"
              options={[
                'US 3.5', 'US 4', 'US 4.5', 'US 5', 'US 5.5',
                'US 6', 'US 6.5', 'US 7', 'US 7.5', 'US 8',
                'US 8.5', 'US 9', 'US 9.5', 'US 10', 'US 10.5',
                'US 11', 'US 11.5', 'US 12', 'US 12.5', 'US 13',
                'US 13.5', 'US 14', 'US 14.5', 'US 15', 'US 15.5',
                'US 16', 'US 17', 'US 18'
              ]}
              onSelect={(value) => handleInputChange('size', value)}
            />
          </View>

          {/* Condition */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Condition</Text>
            <DropdownButton
              value={formData.condition}
              placeholder="Select condition"
              fieldName="condition"
              options={[
                'Deadstock (DS)',
                'New with Defects (NWD)',
                'Very Near Deadstock (VNDS)',
                '9/10',
                '8/10',
                '7/10',
                '6/10',
                '5/10 or Below',
                'Damaged/Beater'
              ]}
              onSelect={(value) => handleInputChange('condition', value)}
            />
          </View>

          {/* Box */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Box</Text>
            <Text style={styles.sublabel}>Original box condition</Text>
            <DropdownButton
              value={formData.box}
              placeholder="Select box condition"
              fieldName="box"
              options={[
                'Original Box',
                'Replacement Box',
                'Damaged Box',
                'No Box'
              ]}
              onSelect={(value) => handleInputChange('box', value)}
            />
          </View>

          {/* Authentication */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Authentication</Text>
            <Text style={styles.sublabel}>Verification status</Text>
            <DropdownButton
              value={formData.authentication}
              placeholder="Select authentication status"
              fieldName="authentication"
              options={[
                'StockX Verified',
                'GOAT Verified',
                'Flight Club Verified',
                'CheckCheck Verified',
                'Legit Check Verified',
                'eBay Authenticity Guarantee',
                'Stadium Goods Verified',
                'Not Authenticated',
                'Will Authenticate Before Sale'
              ]}
              onSelect={(value) => handleInputChange('authentication', value)}
            />
          </View>

          {/* Add Photos */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Photos</Text>
            <Text style={styles.photoLimitText}>Add up to 10 photos of your sneakers</Text>
            <TouchableOpacity
              style={[
                styles.photosButton,
                formData.photos.length >= 10 && styles.photosButtonDisabled
              ]}
              onPress={handleAddPhotos}
              disabled={formData.photos.length >= 10}
            >
              <Plus 
                size={20} 
                color={formData.photos.length >= 10 ? "#9CA3AF" : "#111827"} 
              />
              <Text style={[
                styles.photosButtonText,
                formData.photos.length >= 10 && styles.photosButtonTextDisabled
              ]}>
                {formData.photos.length === 0 ? 'Add Photos' : 
                 formData.photos.length >= 10 ? 'Maximum Photos Added' : 
                 'Add More Photos'}
              </Text>
            </TouchableOpacity>
            
            {/* Photo Grid */}
            {formData.photos.length > 0 && (
              <View style={styles.photoSection}>
                <View style={styles.photoGrid}>
                  {formData.photos.map((photo, index) => (
                    <View key={index} style={styles.photoItem}>
                      <Image
                        source={{ uri: photo }}
                        style={styles.photoImage}
                        resizeMode="cover"
                      />
                      <TouchableOpacity
                        style={styles.photoRemove}
                        onPress={() => removePhoto(index)}
                      >
                        <X size={14} color="white" />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
                <Text style={styles.photoCount}>
                  {formData.photos.length} of 10 photos added
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressText}>Step 1 of 5</Text>
            <Text style={styles.progressText}>20%</Text>
          </View>
          <View style={styles.progressBarContainer}>
            <View style={styles.progressBar} />
          </View>
        </View>

        {/* Next Button */}
        <View style={styles.nextButtonContainer}>
          <TouchableOpacity style={styles.nextButton} onPress={() => router.push('/homepages/createcontract/sale/sneakers/sneakers2')}>
            <Text style={styles.nextButtonText}>Next</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Photo Options Modal */}
      <Modal
        visible={showPhotoOptions}
        transparent
        animationType="slide"
        onRequestClose={() => setShowPhotoOptions(false)}
      >
        <TouchableOpacity 
          style={styles.photoOptionsModal}
          activeOpacity={1}
          onPress={() => setShowPhotoOptions(false)}
        >
          <View style={styles.photoOptionsContainer}>
            <Text style={styles.photoOptionsTitle}>Add Photos</Text>
            <Text style={styles.photoOptionsSubtitle}>
              Choose how you'd like to add photos ({10 - formData.photos.length} remaining)
            </Text>
            
            {/* Take Photo Option */}
            <TouchableOpacity style={styles.photoOptionButton} onPress={takePhoto}>
              <View style={styles.photoOptionIcon}>
                <Camera size={20} color="white" />
              </View>
              <View style={styles.photoOptionText}>
                <Text style={styles.photoOptionTitle}>Take Photos</Text>
                <Text style={styles.photoOptionDesc}>Use your camera to take new photos</Text>
              </View>
            </TouchableOpacity>
            
            {/* Choose from Library Option */}
            <TouchableOpacity style={styles.photoOptionButton} onPress={selectFromLibrary}>
              <View style={styles.photoOptionIcon}>
                <ImageIcon size={20} color="white" />
              </View>
              <View style={styles.photoOptionText}>
                <Text style={styles.photoOptionTitle}>Choose from Library</Text>
                <Text style={styles.photoOptionDesc}>Select existing photos from your device</Text>
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setShowPhotoOptions(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
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
    padding: 16,
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
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 4,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 16,
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
  },
  formContainer: {
    gap: 16,
    marginBottom: 24,
  },
  fieldContainer: {
    gap: 8,
  },
  label: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    textAlign: 'left',
  },
  sublabel: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'left',
    marginBottom: 12,
    marginTop: -4,
  },
  input: {
    width: '100%',
    backgroundColor: 'white',
    color: '#111827',
    borderRadius: 12,
    padding: 16,
    fontSize: 18,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  dropdownContainer: {
    position: 'relative',
    zIndex: 1000,
  },
  dropdownButton: {
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownText: {
    fontSize: 18,
    color: '#111827',
  },
  dropdownPlaceholder: {
    fontSize: 18,
    color: '#9CA3AF',
  },
  dropdownArrow: {
    transform: [{ rotate: '0deg' }],
  },
  dropdownArrowOpen: {
    transform: [{ rotate: '180deg' }],
  },
  dropdownArrowText: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  dropdownMenu: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    marginTop: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
    maxHeight: 200,
    zIndex: 2000,
  },
  dropdownScrollView: {
    maxHeight: 200,
  },
  dropdownOption: {
    padding: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  dropdownOptionLast: {
    borderBottomWidth: 0,
  },
  dropdownOptionText: {
    fontSize: 16,
    color: '#111827',
  },
  photoLimitText: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 12,
    marginTop: -4,
    textAlign: 'left',
  },
  photosButton: {
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  photosButtonDisabled: {
    backgroundColor: '#F3F4F6',
  },
  photosButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  photosButtonTextDisabled: {
    color: '#9CA3AF',
  },
  photoSection: {
    marginTop: 16,
  },
  photoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  photoItem: {
    width: 80,
    height: 80,
    position: 'relative',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  photoImage: {
    width: '100%',
    height: '100%',
  },
  photoRemove: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 24,
    height: 24,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoCount: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 8,
    textAlign: 'center',
  },
  progressContainer: {
    marginBottom: 16,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressText: {
    fontSize: 14,
    color: '#6B7280',
  },
  progressBarContainer: {
    width: '100%',
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
  },
  progressBar: {
    width: '20%',
    height: '100%',
    backgroundColor: '#10B981',
    borderRadius: 4,
  },
  nextButtonContainer: {
    marginBottom: 80,
  },
  nextButton: {
    width: '100%',
    backgroundColor: '#10B981',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  nextButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  photoOptionsModal: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
    padding: 20,
  },
  photoOptionsContainer: {
    backgroundColor: 'white',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 24,
    width: '100%',
  },
  photoOptionsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
    textAlign: 'center',
  },
  photoOptionsSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 24,
    textAlign: 'center',
  },
  photoOptionButton: {
    width: '100%',
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  photoOptionIcon: {
    width: 40,
    height: 40,
    backgroundColor: '#10B981',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoOptionText: {
    flex: 1,
  },
  photoOptionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  photoOptionDesc: {
    fontSize: 14,
    color: '#6B7280',
  },
  cancelButton: {
    width: '100%',
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 4,
  },
  cancelButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6B7280',
  }
});

export default SneakerDetails;

