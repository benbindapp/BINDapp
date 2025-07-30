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
  category: string;
  brand: string;
  size: string;
  color: string;
  condition: string;
  material: string;
  photos: string[];
}

interface ClothingDetailsProps {
  onBack?: () => void;
  onNext?: (formData: FormData) => void;
}

const ClothingDetails: React.FC<ClothingDetailsProps> = ({
  onBack,
  onNext,
}) => {
  const [formData, setFormData] = useState<FormData>({
    category: '',
    brand: '',
    size: '',
    color: '',
    condition: '',
    material: '',
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
    if (formData.photos.length >= 8) {
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
    const availableSlots = 8 - currentPhotos.length;
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
          <Text style={styles.title}>Clothing Details</Text>
          <Text style={styles.subtitle}>Fill in the details of the clothing being sold</Text>
        </View>

        {/* Form Fields */}
        <View style={styles.formContainer}>
          {/* Category */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Category</Text>
            <DropdownButton
              value={formData.category}
              placeholder="Select clothing category"
              fieldName="category"
              options={[
                'Tops',
                'Bottoms',
                'Dresses & Skirts',
                'Outerwear & Jackets',
                'Activewear',
                'Swimwear',
                'Undergarments',
                'Sleepwear',
                'Shoes',
                'Accessories',
                'Suits & Formal',
                'Vintage & Specialty'
              ]}
              onSelect={(value) => handleInputChange('category', value)}
            />
          </View>

          {/* Brand */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Brand</Text>
            <TextInput
              style={styles.input}
              placeholder="Nike, Zara, H&M, Levi's, etc."
              placeholderTextColor="#9CA3AF"
              value={formData.brand}
              onChangeText={(value) => handleInputChange('brand', value)}
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
                'XS',
                'S',
                'M',
                'L',
                'XL',
                'XXL',
                'XXXL',
                '0',
                '2',
                '4',
                '6',
                '8',
                '10',
                '12',
                '14',
                '16',
                '18',
                '20+',
                'One Size',
                'Custom/Other'
              ]}
              onSelect={(value) => handleInputChange('size', value)}
            />
          </View>

          {/* Color */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Color</Text>
            <DropdownButton
              value={formData.color}
              placeholder="Select primary color"
              fieldName="color"
              options={[
                'Black',
                'White',
                'Gray',
                'Navy',
                'Blue',
                'Red',
                'Pink',
                'Purple',
                'Green',
                'Yellow',
                'Orange',
                'Brown',
                'Beige/Tan',
                'Multi-Color',
                'Print/Pattern'
              ]}
              onSelect={(value) => handleInputChange('color', value)}
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
                'New with Tags',
                'New without Tags',
                'Like New',
                'Excellent',
                'Very Good',
                'Good',
                'Fair',
                'Needs Repair'
              ]}
              onSelect={(value) => handleInputChange('condition', value)}
            />
          </View>

          {/* Material */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Material</Text>
            <Text style={styles.sublabel}>Primary fabric or material</Text>
            <DropdownButton
              value={formData.material}
              placeholder="Select material"
              fieldName="material"
              options={[
                'Cotton',
                'Polyester',
                'Wool',
                'Silk',
                'Linen',
                'Denim',
                'Leather',
                'Suede',
                'Cashmere',
                'Viscose/Rayon',
                'Nylon',
                'Spandex/Elastane',
                'Blend',
                'Other'
              ]}
              onSelect={(value) => handleInputChange('material', value)}
            />
          </View>

          {/* Add Photos */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Photos</Text>
            <Text style={styles.photoLimitText}>Add up to 8 photos of your clothing item</Text>
            <TouchableOpacity
              style={[
                styles.photosButton,
                formData.photos.length >= 8 && styles.photosButtonDisabled
              ]}
              onPress={handleAddPhotos}
              disabled={formData.photos.length >= 8}
            >
              <Plus 
                size={20} 
                color={formData.photos.length >= 8 ? "#9CA3AF" : "#111827"} 
              />
              <Text style={[
                styles.photosButtonText,
                formData.photos.length >= 8 && styles.photosButtonTextDisabled
              ]}>
                {formData.photos.length === 0 ? 'Add Photos' : 
                 formData.photos.length >= 8 ? 'Maximum Photos Added' : 
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
                  {formData.photos.length} of 8 photos added
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
          <TouchableOpacity style={styles.nextButton} onPress={() => router.push('/homepages/createcontract/sale/clothing/clothing2')}>
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
              Choose how you'd like to add photos ({8 - formData.photos.length} remaining)
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

export default ClothingDetails;

