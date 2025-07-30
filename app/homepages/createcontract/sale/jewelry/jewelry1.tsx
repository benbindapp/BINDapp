import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import {
  ArrowLeft
} from 'lucide-react-native';
import React, { useState } from 'react';
import {
  Alert,
  Image,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

interface FormData {
  type: string;
  metal: string;
  gemstone: string;
  brand: string;
  condition: string;
  caratWeight: string;
  size: string;
  certification: string;
  photos: ImagePicker.ImagePickerAsset[];
}

interface JewelryDetailsProps {
  onBack?: () => void;
  onNext?: (formData: FormData) => void;
  onAddPhotos?: () => void;
}

const JewelryDetails: React.FC<JewelryDetailsProps> = ({
  onBack,
  onNext,
  onAddPhotos,
}) => {
  const [formData, setFormData] = useState<FormData>({
    type: '',
    metal: '',
    gemstone: '',
    brand: '',
    condition: '',
    caratWeight: '',
    size: '',
    certification: '',
    photos: [],
  });
  const router = useRouter()
  const [showPhotoOptions, setShowPhotoOptions] = useState(false);
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const [showMetalDropdown, setShowMetalDropdown] = useState(false);
  const [showGemstoneDropdown, setShowGemstoneDropdown] = useState(false);
  const [showConditionDropdown, setShowConditionDropdown] = useState(false);
  const [showCertificationDropdown, setShowCertificationDropdown] = useState(false);

  const typeOptions = [
    'Ring',
    'Necklace',
    'Bracelet',
    'Earrings',
    'Watch',
    'Pendant',
    'Brooch',
    'Anklet',
    'Cufflinks',
    'Chain',
    'Other'
  ];

  const metalOptions = [
    'Gold (10K)',
    'Gold (14K)',
    'Gold (18K)',
    'Gold (24K)',
    'White Gold',
    'Rose Gold',
    'Sterling Silver',
    'Silver',
    'Platinum',
    'Titanium',
    'Stainless Steel',
    'Other'
  ];

  const gemstoneOptions = [
    'None',
    'Diamond',
    'Ruby',
    'Sapphire',
    'Emerald',
    'Pearl',
    'Amethyst',
    'Topaz',
    'Garnet',
    'Opal',
    'Turquoise',
    'Jade',
    'Other'
  ];

  const conditionOptions = [
    'New with Tags',
    'New without Tags',
    'Like New',
    'Excellent',
    'Very Good',
    'Good',
    'Fair',
    'Needs Repair'
  ];

  const certificationOptions = [
    'No Certification',
    'GIA Certified',
    'AGS Certified',
    'EGL Certified',
    'Professionally Appraised',
    'Insurance Appraisal',
    'Other Certification'
  ];

  const handleInputChange = (field: keyof FormData, value: string) => {
    if (field === 'photos') return; // Handle photos separately
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddPhotos = () => {
    if (formData.photos.length >= 5) {
      return; // Max photos reached
    }
    setShowPhotoOptions(true);
  };

  const addPhotosToForm = (newAssets: ImagePicker.ImagePickerAsset[]) => {
    const currentPhotos = formData.photos;
    const availableSlots = 5 - currentPhotos.length;
    const assetsToAdd = newAssets.slice(0, availableSlots);
    
    setFormData(prev => ({
      ...prev,
      photos: [...prev.photos, ...assetsToAdd]
    }));
    
    setShowPhotoOptions(false);
  };

  const takePhotos = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Camera Permission', 'Camera permission is required to take photos.');
      return;
    }

    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets) {
        addPhotosToForm(result.assets);
      }
    } catch (error) {
      console.error('Camera error:', error);
    }
  };

  const pickFromLibrary = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Library Permission', 'Photo library permission is required to select photos.');
      return;
    }

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        allowsMultipleSelection: true,
        selectionLimit: 5 - formData.photos.length,
        quality: 0.8,
      });

      if (!result.canceled && result.assets) {
        addPhotosToForm(result.assets);
      }
    } catch (error) {
      console.error('Library error:', error);
    }
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
    isOpen: boolean;
    onToggle: () => void;
  }> = ({ value, placeholder, options, onSelect, isOpen, onToggle }) => (
    <View style={styles.dropdownContainer}>
      <TouchableOpacity style={styles.dropdownButton} onPress={onToggle}>
        <Text style={[styles.dropdownText, !value && styles.dropdownPlaceholder]}>
          {value || placeholder}
        </Text>
        <Ionicons 
          name={isOpen ? "chevron-up" : "chevron-down"} 
          size={20} 
          color="#9CA3AF" 
        />
      </TouchableOpacity>
      
      {isOpen && (
        <View style={styles.dropdownMenu}>
          <ScrollView style={styles.dropdownScroll} nestedScrollEnabled>
            {options.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={styles.dropdownOption}
                onPress={() => {
                  onSelect(option);
                  onToggle();
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

  const shouldShowCaratWeight = () => {
    return formData.gemstone && formData.gemstone !== 'None';
  };

  const shouldShowSize = () => {
    return ['Ring', 'Bracelet', 'Watch', 'Anklet'].includes(formData.type);
  };

  const getSizePlaceholder = () => {
    if (formData.type === 'Ring') return 'e.g., 7, 7.5, 8';
    if (formData.type === 'Watch') return 'e.g., Small, Medium, Large';
    return 'e.g., 7 inches, Medium';
  };

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
          <Text style={styles.title}>Jewelry Details</Text>
          <Text style={styles.subtitle}>Fill in the details of the jewelry being sold</Text>
        </View>

        {/* Form Fields */}
        <View style={styles.formContainer}>
          {/* Type */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Type</Text>
            <DropdownButton
              value={formData.type}
              placeholder="Select jewelry type"
              options={typeOptions}
              onSelect={(value) => handleInputChange('type', value)}
              isOpen={showTypeDropdown}
              onToggle={() => setShowTypeDropdown(!showTypeDropdown)}
            />
          </View>

          {/* Metal */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Metal</Text>
            <DropdownButton
              value={formData.metal}
              placeholder="Select metal type"
              options={metalOptions}
              onSelect={(value) => handleInputChange('metal', value)}
              isOpen={showMetalDropdown}
              onToggle={() => setShowMetalDropdown(!showMetalDropdown)}
            />
          </View>

          {/* Gemstone */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Gemstone</Text>
            <DropdownButton
              value={formData.gemstone}
              placeholder="Select gemstone (if any)"
              options={gemstoneOptions}
              onSelect={(value) => handleInputChange('gemstone', value)}
              isOpen={showGemstoneDropdown}
              onToggle={() => setShowGemstoneDropdown(!showGemstoneDropdown)}
            />
          </View>

          {/* Brand */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Brand</Text>
            <TextInput
              style={styles.input}
              placeholder="Tiffany & Co., Cartier, Pandora, etc."
              placeholderTextColor="#9CA3AF"
              value={formData.brand}
              onChangeText={(value) => handleInputChange('brand', value)}
            />
          </View>

          {/* Condition */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Condition</Text>
            <DropdownButton
              value={formData.condition}
              placeholder="Select condition"
              options={conditionOptions}
              onSelect={(value) => handleInputChange('condition', value)}
              isOpen={showConditionDropdown}
              onToggle={() => setShowConditionDropdown(!showConditionDropdown)}
            />
          </View>

          {/* Carat Weight (conditional for gemstone jewelry) */}
          {shouldShowCaratWeight() && (
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Carat Weight</Text>
              <Text style={styles.sublabel}>Total carat weight of gemstones (if known)</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., 1.5 ct, 0.75 ct"
                placeholderTextColor="#9CA3AF"
                value={formData.caratWeight}
                onChangeText={(value) => handleInputChange('caratWeight', value)}
              />
            </View>
          )}

          {/* Size (conditional for rings, bracelets, etc.) */}
          {shouldShowSize() && (
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Size</Text>
              <TextInput
                style={styles.input}
                placeholder={getSizePlaceholder()}
                placeholderTextColor="#9CA3AF"
                value={formData.size}
                onChangeText={(value) => handleInputChange('size', value)}
              />
            </View>
          )}

          {/* Certification */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Certification</Text>
            <Text style={styles.sublabel}>Any appraisal or certification documents</Text>
            <DropdownButton
              value={formData.certification}
              placeholder="Select certification status"
              options={certificationOptions}
              onSelect={(value) => handleInputChange('certification', value)}
              isOpen={showCertificationDropdown}
              onToggle={() => setShowCertificationDropdown(!showCertificationDropdown)}
            />
          </View>

          {/* Add Photos */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Photos</Text>
            <View style={styles.photoSection}>
              <Text style={styles.photoLimitText}>Add up to 5 photos of your jewelry</Text>
              <TouchableOpacity
                style={[styles.photosButton, formData.photos.length >= 5 && styles.photosButtonDisabled]}
                onPress={handleAddPhotos}
                disabled={formData.photos.length >= 5}
                activeOpacity={0.8}
              >
                <Ionicons 
                  name="add" 
                  size={20} 
                  color={formData.photos.length >= 5 ? "#9CA3AF" : "#111827"} 
                />
                <Text style={[styles.photosButtonText, formData.photos.length >= 5 && styles.photosButtonTextDisabled]}>
                  {formData.photos.length === 0 ? 'Add Photos' : 
                   formData.photos.length >= 5 ? 'Maximum Photos Added' : 
                   'Add More Photos'}
                </Text>
              </TouchableOpacity>
              
              {/* Photo Grid */}
              {formData.photos.length > 0 && (
                <>
                  <View style={styles.photoGrid}>
                    {formData.photos.map((photo, index) => (
                      <View key={index} style={styles.photoItem}>
                        <Image
                          source={{ uri: photo.uri }}
                          style={styles.photoImage}
                        />
                        <TouchableOpacity
                          style={styles.photoRemove}
                          onPress={() => removePhoto(index)}
                        >
                          <Ionicons name="close" size={14} color="white" />
                        </TouchableOpacity>
                      </View>
                    ))}
                  </View>
                  <Text style={styles.photoCount}>
                    {formData.photos.length} of 5 photos added
                  </Text>
                </>
              )}
            </View>
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
          <TouchableOpacity
            style={styles.nextButton}
            onPress={() => router.push('/homepages/createcontract/sale/jewelry/jewelry2')}
            activeOpacity={0.8}
          >
            <Text style={styles.nextButtonText}>Next</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Photo Options Modal */}
      <Modal
        visible={showPhotoOptions}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowPhotoOptions(false)}
      >
        <View style={styles.photoOptionsModal}>
          <View style={styles.photoOptionsContainer}>
            <Text style={styles.photoOptionsTitle}>Add Photos</Text>
            <Text style={styles.photoOptionsSubtitle}>
              Choose how you'd like to add photos ({5 - formData.photos.length} remaining)
            </Text>
            
            {/* Take Photo Option */}
            <TouchableOpacity style={styles.photoOptionButton} onPress={takePhotos}>
              <View style={styles.photoOptionIcon}>
                <Ionicons name="camera" size={20} color="white" />
              </View>
              <View style={styles.photoOptionText}>
                <Text style={styles.photoOptionTitle}>Take Photos</Text>
                <Text style={styles.photoOptionDesc}>Use your camera to take new photos</Text>
              </View>
            </TouchableOpacity>
            
            {/* Choose from Library Option */}
            <TouchableOpacity style={styles.photoOptionButton} onPress={pickFromLibrary}>
              <View style={styles.photoOptionIcon}>
                <Ionicons name="images" size={20} color="white" />
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
        </View>
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
    paddingHorizontal: 24,
    paddingVertical: 4,
    flex: 1,
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
    textAlign: 'center',
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
    paddingHorizontal: 16,
    paddingVertical: 16,
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
    color: '#111827',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 18,
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
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
    zIndex: 1001,
    maxHeight: 200,
  },
  dropdownScroll: {
    maxHeight: 200,
  },
  dropdownOption: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  dropdownOptionText: {
    fontSize: 16,
    color: '#111827',
  },
  photoSection: {
    marginTop: 8,
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
    paddingVertical: 16,
    paddingHorizontal: 16,
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
  photoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 16,
  },
  photoItem: {
    position: 'relative',
    width: 80,
    height: 80,
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
  photoOptionsModal: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  photoOptionsContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
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
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6B7280',
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
    paddingVertical: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  nextButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  }
});

export default JewelryDetails;

