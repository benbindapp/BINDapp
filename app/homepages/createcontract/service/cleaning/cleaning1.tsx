import { useRouter } from 'expo-router';
import {
  Anchor,
  ArrowLeft,
  Brush,
  Building2,
  Car,
  Droplets,
  Home,
  MapPin,
  Plane,
  Sparkles,
  Wind,
  Wrench,
} from 'lucide-react-native';
import React, { useState } from 'react';
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

interface FormData {
  serviceCategory: 'short_term_rental' | 'automotive' | 'residential' | 'marine' | 'aviation' | 'commercial' | '';
  serviceType: string;
  make: string;
  model: string;
  year: string;
  address: string;
  buildingName: string;
  cleaningType: string;
  specialRequests: string;
  preferredDate: string;
  estimatedDuration: string;
  serviceProvider: string;
  counterParty: string;
}

const CleaningServiceApp = () => {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    serviceCategory: '',
    serviceType: '',
    make: '',
    model: '',
    year: '',
    address: '',
    buildingName: '',
    cleaningType: '',
    specialRequests: '',
    preferredDate: '',
    estimatedDuration: '',
    serviceProvider: 'John Smith - CleanPro Services',
    counterParty: '',
  });

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCategorySelect = (category: FormData['serviceCategory']) => {
    setFormData(prev => ({
      ...prev,
      serviceCategory: category,
      serviceType: '',
      make: '',
      model: '',
      year: '',
      address: '',
      buildingName: '',
      cleaningType: '',
    }));
  };

  const handleServiceTypeSelect = (type: string) => {
    setFormData(prev => ({
      ...prev,
      serviceType: type,
      make: '',
      model: '',
      cleaningType: '',
    }));
  };

  const handleNext = () => {
    if (currentStep === 1) {
      if (!formData.serviceCategory || !formData.serviceType) {
        Alert.alert('Missing Information', 'Please select a service category and type.');
        return;
      }
      
      if (['automotive', 'marine', 'aviation'].includes(formData.serviceCategory)) {
        if (!formData.make || !formData.model) {
          Alert.alert('Missing Information', 'Please enter make and model.');
          return;
        }
      }
      
      if (['residential', 'commercial', 'short_term_rental'].includes(formData.serviceCategory)) {
        if (!formData.address) {
          Alert.alert('Missing Information', 'Please enter a service address.');
          return;
        }
      }
      
      setCurrentStep(2);
    } else if (currentStep === 2) {
      if (!formData.cleaningType) {
        Alert.alert('Missing Information', 'Please select a cleaning type.');
        return;
      }
      
      router.push({pathname: '/homepages/createcontract/service/cleaning/cleaning3'})
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const serviceCategories = [
    { id: 'short_term_rental', name: 'Short-Term Rental', icon: MapPin, examples: 'Airbnb, VRBO, month-to-month leases' },
    { id: 'automotive', name: 'Automotive', icon: Car, examples: 'Cars, trucks, motorcycles, RVs' },
    { id: 'residential', name: 'Residential', icon: Home, examples: 'Houses, apartments, condos' },
    { id: 'marine', name: 'Marine', icon: Anchor, examples: 'Boats, yachts, jet skis' },
    { id: 'aviation', name: 'Aviation', icon: Plane, examples: 'Aircraft, helicopters, hangars' },
    { id: 'commercial', name: 'Commercial', icon: Building2, examples: 'Offices, retail, restaurants' },
  ];

  const getServiceTypes = (category: string) => {
    switch (category) {
      case 'short_term_rental':
        return [
          { id: 'airbnb', name: 'Airbnb Turnover', icon: Home },
          { id: 'vrbo', name: 'VRBO Property', icon: MapPin },
          { id: 'monthly_lease', name: 'Month-to-Month Lease', icon: Building2 },
          { id: 'corporate_housing', name: 'Corporate Housing', icon: Building2 },
          { id: 'vacation_rental', name: 'Vacation Rental', icon: Home },
        ];
      case 'automotive':
        return [
          { id: 'car', name: 'Car/Sedan', icon: Car },
          { id: 'suv', name: 'SUV/Truck', icon: Wrench },
          { id: 'motorcycle', name: 'Motorcycle', icon: Wind },
          { id: 'rv', name: 'RV/Motorhome', icon: Home },
          { id: 'fleet', name: 'Fleet Service', icon: Building2 },
        ];
      case 'residential':
        return [
          { id: 'house', name: 'House', icon: Home },
          { id: 'apartment', name: 'Apartment', icon: Building2 },
          { id: 'condo', name: 'Condo', icon: Home },
          { id: 'vacation_rental', name: 'Vacation Rental', icon: MapPin },
          { id: 'post_construction', name: 'Post-Construction', icon: Wrench },
        ];
      case 'marine':
        return [
          { id: 'yacht', name: 'Yacht', icon: Anchor },
          { id: 'sailboat', name: 'Sailboat', icon: Wind },
          { id: 'powerboat', name: 'Powerboat', icon: Anchor },
          { id: 'jet_ski', name: 'Jet Ski', icon: Droplets },
          { id: 'fishing_boat', name: 'Fishing Boat', icon: Anchor },
        ];
      case 'aviation':
        return [
          { id: 'private_jet', name: 'Private Jet', icon: Plane },
          { id: 'helicopter', name: 'Helicopter', icon: Wind },
          { id: 'small_aircraft', name: 'Small Aircraft', icon: Plane },
          { id: 'commercial', name: 'Commercial Aircraft', icon: Plane },
          { id: 'hangar', name: 'Hangar Cleaning', icon: Building2 },
        ];
      case 'commercial':
        return [
          { id: 'office', name: 'Office Building', icon: Building2 },
          { id: 'retail', name: 'Retail Space', icon: Building2 },
          { id: 'restaurant', name: 'Restaurant', icon: Building2 },
          { id: 'warehouse', name: 'Warehouse', icon: Building2 },
          { id: 'medical', name: 'Medical Facility', icon: Building2 },
        ];
      default:
        return [];
    }
  };

  const getCleaningTypes = (category: string, serviceType: string) => {
    if (category === 'automotive') {
      switch (serviceType) {
        case 'car':
          return [
            { id: 'basic_wash', name: 'Basic Wash & Vacuum', icon: Droplets, subtext: 'Exterior wash, interior vacuum, windows cleaned' },
            { id: 'full_detail', name: 'Full Detail Service', icon: Sparkles, subtext: 'Complete interior/exterior detail, wax, tire shine, leather conditioning' },
            { id: 'interior_only', name: 'Interior Deep Clean', icon: Brush, subtext: 'Seats, carpets, dashboard, cup holders, door panels' },
            { id: 'exterior_only', name: 'Exterior Detail', icon: Droplets, subtext: 'Wash, clay bar, wax, tire shine, chrome polish' },
            { id: 'paint_correction', name: 'Paint Correction', icon: Sparkles, subtext: 'Scratch removal, swirl marks, polishing, ceramic coating prep' },
          ];
        case 'suv':
          return [
            { id: 'basic_wash', name: 'Basic Wash & Vacuum', icon: Droplets, subtext: 'Exterior wash, cargo area vacuum, all windows' },
            { id: 'full_detail', name: 'Full Detail Service', icon: Sparkles, subtext: 'Complete detail including cargo area, running boards, undercarriage' },
            { id: 'interior_deep', name: 'Interior Deep Clean', icon: Brush, subtext: '3 rows of seats, cargo area, floor mats, crevice cleaning' },
            { id: 'exterior_heavy', name: 'Heavy Duty Exterior', icon: Droplets, subtext: 'Mud removal, undercarriage wash, wheel wells, bug removal' },
          ];
        case 'rv':
          return [
            { id: 'exterior_only', name: 'Exterior Wash', icon: Droplets, subtext: 'Full RV exterior, awnings, slide-outs, roof cleaning' },
            { id: 'interior_only', name: 'Interior Detail', icon: Home, subtext: 'Living area, kitchen, bathroom, bedroom, storage compartments' },
            { id: 'full_rv', name: 'Complete RV Service', icon: Sparkles, subtext: 'Inside and out, awnings, slide mechanisms, holding tank area' },
          ];
        default:
          return [
            { id: 'basic_wash', name: 'Basic Wash & Vacuum', icon: Droplets, subtext: 'Standard exterior wash and interior vacuum' },
            { id: 'full_detail', name: 'Full Detail Service', icon: Sparkles, subtext: 'Complete interior and exterior detailing' },
          ];
      }
    }
    
    if (category === 'aviation') {
      switch (serviceType) {
        case 'private_jet':
          return [
            { id: 'interior_only', name: 'Cabin Interior Detail', icon: Home, subtext: 'Leather seats, galley, lavatory, carpet, windows, wood trim' },
            { id: 'exterior_only', name: 'Exterior Wash & Polish', icon: Droplets, subtext: 'Fuselage, wings, control surfaces, landing gear, pitot tubes' },
            { id: 'full_detail', name: 'Complete Aircraft Detail', icon: Sparkles, subtext: 'Full interior and exterior, engine compartment accessible areas' },
            { id: 'pre_flight', name: 'Pre-Flight Clean', icon: Plane, subtext: 'Quick interior refresh, window cleaning, trash removal' },
          ];
        case 'helicopter':
          return [
            { id: 'interior_only', name: 'Cockpit & Cabin Detail', icon: Home, subtext: 'Instrument panel, seats, doors, cargo area, headliner' },
            { id: 'exterior_only', name: 'Exterior Detail', icon: Wind, subtext: 'Fuselage, rotor blades, landing skids, tail boom, engine cowling' },
            { id: 'full_detail', name: 'Complete Helicopter Detail', icon: Sparkles, subtext: 'Full interior/exterior, rotor blade cleaning, engine bay' },
          ];
        case 'small_aircraft':
          return [
            { id: 'interior_only', name: 'Cockpit & Cabin Clean', icon: Home, subtext: 'Instrument panel, seats, interior panels, cargo area' },
            { id: 'exterior_only', name: 'Exterior Wash', icon: Droplets, subtext: 'Wings, fuselage, propeller, landing gear, control surfaces' },
            { id: 'full_detail', name: 'Complete Aircraft Service', icon: Sparkles, subtext: 'Interior, exterior, engine cowling, tie-down cleanup' },
          ];
        case 'commercial':
          return [
            { id: 'cabin_service', name: 'Passenger Cabin Service', icon: Home, subtext: 'Seats, overhead bins, lavatories, galley, aisles, windows' },
            { id: 'cockpit_only', name: 'Cockpit Detail', icon: Plane, subtext: 'Flight deck, instrument panels, pilot seats, windscreen' },
            { id: 'exterior_wash', name: 'Exterior Wash', icon: Droplets, subtext: 'Fuselage, wings, engines (external), landing gear' },
          ];
        default:
          return [
            { id: 'interior_only', name: 'Interior Detail', icon: Home, subtext: 'Cockpit and cabin cleaning' },
            { id: 'exterior_only', name: 'Exterior Wash', icon: Droplets, subtext: 'Aircraft exterior cleaning' },
          ];
      }
    }

    if (category === 'marine') {
      switch (serviceType) {
        case 'yacht':
          return [
            { id: 'interior_cabin', name: 'Interior Cabin Detail', icon: Home, subtext: 'Staterooms, galley, salon, head, upholstery, teak cleaning' },
            { id: 'exterior_deck', name: 'Deck & Exterior Detail', icon: Droplets, subtext: 'Gel coat, deck cleaning, railings, hardware, fenders' },
            { id: 'hull_bottom', name: 'Hull & Bottom Clean', icon: Anchor, subtext: 'Hull cleaning, waterline, propeller, through-hulls' },
            { id: 'full_yacht', name: 'Complete Yacht Service', icon: Sparkles, subtext: 'Interior, exterior, deck, hull, engine compartment' },
          ];
        case 'powerboat':
          return [
            { id: 'interior_only', name: 'Interior Detail', icon: Home, subtext: 'Cockpit, seating, storage compartments, cabin if equipped' },
            { id: 'exterior_only', name: 'Exterior & Deck Clean', icon: Droplets, subtext: 'Hull, deck, railings, hardware, engine compartment' },
            { id: 'full_detail', name: 'Complete Boat Detail', icon: Sparkles, subtext: 'Interior, exterior, engine bay, trailer if applicable' },
          ];
        default:
          return [
            { id: 'interior_cabin', name: 'Interior Clean', icon: Home, subtext: 'Cabin and cockpit cleaning' },
            { id: 'exterior_deck', name: 'Exterior Detail', icon: Droplets, subtext: 'Hull and deck cleaning' },
          ];
      }
    }

    // Default cleaning types for other categories
    switch (category) {
      case 'short_term_rental':
        return [
          { id: 'turnover', name: 'Turnover Cleaning', icon: Sparkles, subtext: 'Full clean between guests, linens, bathrooms, kitchen' },
          { id: 'maintenance', name: 'Maintenance Clean', icon: Brush, subtext: 'Regular upkeep, deep clean problem areas' },
          { id: 'inspection_ready', name: 'Inspection Ready', icon: Home, subtext: 'White-glove clean for property inspections' },
          { id: 'damage_restoration', name: 'Damage Restoration', icon: Wrench, subtext: 'Post-party cleanup, damage assessment' },
        ];
      case 'residential':
        return [
          { id: 'standard', name: 'Standard Cleaning', icon: Brush, subtext: 'Regular house cleaning, all rooms, bathrooms, kitchen' },
          { id: 'deep_clean', name: 'Deep Cleaning', icon: Sparkles, subtext: 'Detailed clean, baseboards, inside appliances, cabinets' },
          { id: 'move_in_out', name: 'Move In/Out Clean', icon: Home, subtext: 'Empty house deep clean, inside all appliances' },
          { id: 'post_party', name: 'Post-Event Cleanup', icon: Wrench, subtext: 'Party cleanup, carpet cleaning, damage assessment' },
        ];
      case 'commercial':
        return [
          { id: 'daily_maintenance', name: 'Daily Maintenance', icon: Brush, subtext: 'Regular office cleaning, trash, restrooms, common areas' },
          { id: 'weekly_deep', name: 'Weekly Deep Clean', icon: Sparkles, subtext: 'Detailed clean, conference rooms, break rooms, floors' },
          { id: 'carpet_upholstery', name: 'Carpet & Upholstery', icon: Home, subtext: 'Professional carpet cleaning, furniture upholstery' },
          { id: 'window_cleaning', name: 'Window Cleaning', icon: Droplets, subtext: 'Interior and exterior windows, glass doors' },
        ];
      default:
        return [];
    }
  };

  const showMakeModel = ['automotive', 'marine', 'aviation'].includes(formData.serviceCategory);
  const showAddress = ['residential', 'commercial', 'short_term_rental'].includes(formData.serviceCategory);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f9fafb" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
            <ArrowLeft width={24} height={24} color="#000000" />
        </TouchableOpacity>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Cleaning Service</Text>
        </View>
        <View style={styles.spacer} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          
          {/* PAGE 1 */}
          {currentStep === 1 && (
            <>
              {/* Service Provider Info */}
              <View style={styles.providerSection}>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Service Provider</Text>
                  <View style={styles.providerBox}>
                    <Text style={styles.providerText}>{formData.serviceProvider}</Text>
                  </View>
                </View>
                
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Counter Party</Text>
                  <TextInput
                    style={styles.input}
                    value={formData.counterParty}
                    onChangeText={(value) => handleInputChange('counterParty', value)}
                    placeholder="Client name..."
                    placeholderTextColor="#9ca3af"
                  />
                </View>
              </View>

              {/* Service Category */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Service Category</Text>
                {serviceCategories.map((category) => {
                  const IconComponent = category.icon;
                  const isSelected = formData.serviceCategory === category.id;
                  return (
                    <TouchableOpacity
                      key={category.id}
                      onPress={() => handleCategorySelect(category.id as FormData['serviceCategory'])}
                      style={[
                        styles.categoryButton,
                        isSelected ? styles.categoryButtonSelected : styles.categoryButtonDefault
                      ]}
                    >
                      <View style={[
                        styles.iconContainer,
                        isSelected ? styles.iconContainerSelected : styles.iconContainerDefault
                      ]}>
                        <IconComponent size={24} color={isSelected ? '#ffffff' : '#6b7280'} />
                      </View>
                      <View style={styles.categoryTextContainer}>
                        <Text style={[
                          styles.categoryName,
                          isSelected ? styles.categoryNameSelected : styles.categoryNameDefault
                        ]}>
                          {category.name}
                        </Text>
                        <Text style={[
                          styles.categoryExamples,
                          isSelected ? styles.categoryExamplesSelected : styles.categoryExamplesDefault
                        ]}>
                          {category.examples}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Service Type */}
              {formData.serviceCategory && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Service Type</Text>
                  {getServiceTypes(formData.serviceCategory).map((type) => {
                    const IconComponent = type.icon;
                    const isSelected = formData.serviceType === type.id;
                    return (
                      <TouchableOpacity
                        key={type.id}
                        onPress={() => handleServiceTypeSelect(type.id)}
                        style={[
                          styles.serviceTypeButton,
                          isSelected ? styles.serviceTypeButtonSelected : styles.serviceTypeButtonDefault
                        ]}
                      >
                        <View style={[
                          styles.serviceTypeIconContainer,
                          isSelected ? styles.serviceTypeIconSelected : styles.serviceTypeIconDefault
                        ]}>
                          <IconComponent size={16} color={isSelected ? '#ffffff' : '#6b7280'} />
                        </View>
                        <Text style={[
                          styles.serviceTypeName,
                          isSelected ? styles.serviceTypeNameSelected : styles.serviceTypeNameDefault
                        ]}>
                          {type.name}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              )}

              {/* Make, Model, Year */}
              {showMakeModel && formData.serviceType && (
                <View style={styles.section}>
                  <View style={styles.makeModelRow}>
                    <View style={styles.makeModelColumn}>
                      <Text style={styles.label}>Make</Text>
                      <TextInput
                        style={styles.input}
                        value={formData.make}
                        onChangeText={(value) => handleInputChange('make', value)}
                        placeholder={
                          formData.serviceCategory === 'automotive' ? 'e.g. Toyota' :
                          formData.serviceCategory === 'aviation' ? 'e.g. Cessna' : 'e.g. Sea Ray'
                        }
                        placeholderTextColor="#9ca3af"
                      />
                    </View>
                    <View style={styles.makeModelColumn}>
                      <Text style={styles.label}>Model</Text>
                      <TextInput
                        style={styles.input}
                        value={formData.model}
                        onChangeText={(value) => handleInputChange('model', value)}
                        placeholder={
                          formData.serviceCategory === 'automotive' ? 'e.g. Camry' :
                          formData.serviceCategory === 'aviation' ? 'e.g. 172' : 'e.g. 230 SPX'
                        }
                        placeholderTextColor="#9ca3af"
                      />
                    </View>
                    <View style={styles.makeModelColumnSmall}>
                      <Text style={styles.label}>Year</Text>
                      <TextInput
                        style={styles.input}
                        value={formData.year}
                        onChangeText={(value) => handleInputChange('year', value)}
                        placeholder="2024"
                        placeholderTextColor="#9ca3af"
                        keyboardType="numeric"
                      />
                    </View>
                  </View>
                </View>
              )}

              {/* Address */}
              {showAddress && formData.serviceType && (
                <View style={styles.section}>
                  <View style={styles.addressLabelRow}>
                    <MapPin size={20} color="#374151" />
                    <Text style={styles.addressLabel}>Service Address</Text>
                  </View>
                  <TextInput
                    style={styles.input}
                    value={formData.address}
                    onChangeText={(value) => handleInputChange('address', value)}
                    placeholder="123 Main Street, City, State, ZIP"
                    placeholderTextColor="#9ca3af"
                    multiline={true}
                    numberOfLines={2}
                  />
                </View>
              )}

              {/* Date */}
              <View style={styles.section}>
                <Text style={styles.label}>Preferred Date</Text>
                <TextInput
                  style={styles.input}
                  value={formData.preferredDate}
                  onChangeText={(value) => handleInputChange('preferredDate', value)}
                  placeholder="YYYY-MM-DD"
                  placeholderTextColor="#9ca3af"
                />
              </View>
            </>
          )}

          {/* PAGE 2 */}
          {currentStep === 2 && (
            <>
              {/* Service Summary */}
              <View style={styles.summaryBox}>
                <Text style={styles.summaryTitle}>Service Summary</Text>
                <View style={styles.summaryGrid}>
                  <View style={styles.summaryItem}>
                    <Text style={styles.summaryLabel}>Category:</Text>
                    <Text style={styles.summaryValue}>
                      {serviceCategories.find(cat => cat.id === formData.serviceCategory)?.name}
                    </Text>
                  </View>
                  <View style={styles.summaryItem}>
                    <Text style={styles.summaryLabel}>Type:</Text>
                    <Text style={styles.summaryValue}>
                      {getServiceTypes(formData.serviceCategory).find(type => type.id === formData.serviceType)?.name}
                    </Text>
                  </View>
                  {showMakeModel && formData.make && (
                    <View style={styles.summaryItem}>
                      <Text style={styles.summaryLabel}>Vehicle:</Text>
                      <Text style={styles.summaryValue}>
                        {formData.year} {formData.make} {formData.model}
                      </Text>
                    </View>
                  )}
                  {showAddress && formData.address && (
                    <View style={styles.summaryItem}>
                      <Text style={styles.summaryLabel}>Address:</Text>
                      <Text style={styles.summaryValue}>{formData.address}</Text>
                    </View>
                  )}
                </View>
              </View>

              {/* Cleaning Type Selection */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Select Cleaning Type</Text>
                {getCleaningTypes(formData.serviceCategory, formData.serviceType).map((cleaningType) => {
                  const IconComponent = cleaningType.icon;
                  const isSelected = formData.cleaningType === cleaningType.id;
                  return (
                    <TouchableOpacity
                      key={cleaningType.id}
                      onPress={() => handleInputChange('cleaningType', cleaningType.id)}
                      style={[
                        styles.cleaningTypeButton,
                        isSelected ? styles.cleaningTypeButtonSelected : styles.cleaningTypeButtonDefault
                      ]}
                    >
                      <View style={[
                        styles.cleaningTypeIconContainer,
                        isSelected ? styles.cleaningTypeIconSelected : styles.cleaningTypeIconDefault
                      ]}>
                        <IconComponent size={24} color={isSelected ? '#ffffff' : '#6b7280'} />
                      </View>
                      <View style={styles.cleaningTypeTextContainer}>
                        <Text style={[
                          styles.cleaningTypeName,
                          isSelected ? styles.cleaningTypeNameSelected : styles.cleaningTypeNameDefault
                        ]}>
                          {cleaningType.name}
                        </Text>
                        <Text style={[
                          styles.cleaningTypeSubtext,
                          isSelected ? styles.cleaningTypeSubtextSelected : styles.cleaningTypeSubtextDefault
                        ]}>
                          {cleaningType.subtext}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Duration and Special Requests */}
              <View style={styles.section}>
                <Text style={styles.label}>Estimated Duration</Text>
                <TextInput
                  style={styles.input}
                  value={formData.estimatedDuration}
                  onChangeText={(value) => handleInputChange('estimatedDuration', value)}
                  placeholder="e.g., 2-4 hours"
                  placeholderTextColor="#9ca3af"
                />
              </View>

              <View style={styles.section}>
                <Text style={styles.label}>Special Requests & Notes</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={formData.specialRequests}
                  onChangeText={(value) => handleInputChange('specialRequests', value)}
                  placeholder="Any special requirements, problem areas, allergies, access instructions..."
                  placeholderTextColor="#9ca3af"
                  multiline={true}
                  numberOfLines={4}
                  textAlignVertical="top"
                />
              </View>
            </>
          )}

          {/* Progress Bar */}
          <View style={styles.progressSection}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressText}>Step {currentStep} of 5</Text>
              <Text style={styles.progressText}>{currentStep === 1 ? '20%' : '40%'}</Text>
            </View>
            <View style={styles.progressBarContainer}>
              <View style={[
                styles.progressBar,
                { width: currentStep === 1 ? '20%' : '40%' }
              ]} />
            </View>
          </View>


          {/* Next Button */}
          <TouchableOpacity
            onPress={handleNext}
            disabled={
              (currentStep === 1 && (!formData.serviceCategory || !formData.serviceType)) ||
              (currentStep === 2 && !formData.cleaningType)
            }
            style={[
              styles.nextButton,
              (currentStep === 1 && (!formData.serviceCategory || !formData.serviceType)) ||
              (currentStep === 2 && !formData.cleaningType)
                ? styles.nextButtonDisabled
                : styles.nextButtonEnabled
            ]}
          >
            <Text style={styles.nextButtonText}>
              {currentStep === 1 ? 'Next' : 'Next'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    paddingHorizontal: 16,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    padding: 8,
    borderRadius: 8,
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
  },
  spacer: {
    width: 48,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 24,
  },
  providerSection: {
    marginBottom: 32,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  providerBox: {
    padding: 12,
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
  },
  providerText: {
    fontSize: 16,
    color: '#111827',
  },
  input: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    fontSize: 16,
    backgroundColor: '#ffffff',
    color: '#111827',
  },
  textArea: {
    height: 100,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  categoryButton: {
    padding: 16,
    borderWidth: 2,
    borderRadius: 12,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryButtonDefault: {
    borderColor: '#d1d5db',
    backgroundColor: '#ffffff',
  },
  categoryButtonSelected: {
    borderColor: '#10b981',
    backgroundColor: '#ecfdf5',
  },
  iconContainer: {
    padding: 12,
    borderRadius: 8,
    marginRight: 16,
  },
  iconContainerDefault: {
    backgroundColor: '#f3f4f6',
  },
  iconContainerSelected: {
    backgroundColor: '#10b981',
  },
  categoryTextContainer: {
    flex: 1,
    alignItems: 'center',
  },
  categoryName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  categoryNameDefault: {
    color: '#111827',
  },
  categoryNameSelected: {
    color: '#065f46',
  },
  categoryExamples: {
    fontSize: 14,
  },
  categoryExamplesDefault: {
    color: '#6b7280',
  },
  categoryExamplesSelected: {
    color: '#047857',
  },
  serviceTypeButton: {
    padding: 12,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  serviceTypeButtonDefault: {
    borderColor: '#d1d5db',
    backgroundColor: '#ffffff',
  },
  serviceTypeButtonSelected: {
    borderColor: '#10b981',
    backgroundColor: '#f0fdf4',
  },
  serviceTypeIconContainer: {
    padding: 8,
    borderRadius: 8,
    marginRight: 12,
  },
  serviceTypeIconDefault: {
    backgroundColor: '#f3f4f6',
  },
  serviceTypeIconSelected: {
    backgroundColor: '#10b981',
  },
  serviceTypeName: {
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
    textAlign: 'center',
  },
  serviceTypeNameDefault: {
    color: '#111827',
  },
  serviceTypeNameSelected: {
    color: '#065f46',
  },
  makeModelRow: {
    flexDirection: 'row',
    gap: 16,
  },
  makeModelColumn: {
    flex: 1,
  },
  makeModelColumnSmall: {
    flex: 0.7,
  },
  addressLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  addressLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginLeft: 8,
  },
  summaryBox: {
    backgroundColor: '#ffffff',
    padding: 24,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginBottom: 32,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  summaryGrid: {
    gap: 16,
  },
  summaryItem: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  summaryLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6b7280',
    marginRight: 8,
  },
  summaryValue: {
    fontSize: 14,
    color: '#111827',
    flex: 1,
  },
  cleaningTypeButton: {
    padding: 16,
    borderWidth: 2,
    borderRadius: 12,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  cleaningTypeButtonDefault: {
    borderColor: '#d1d5db',
    backgroundColor: '#ffffff',
  },
  cleaningTypeButtonSelected: {
    borderColor: '#10b981',
    backgroundColor: '#ecfdf5',
  },
  cleaningTypeIconContainer: {
    padding: 12,
    borderRadius: 8,
    marginRight: 16,
  },
  cleaningTypeIconDefault: {
    backgroundColor: '#f3f4f6',
  },
  cleaningTypeIconSelected: {
    backgroundColor: '#10b981',
  },
  cleaningTypeTextContainer: {
    flex: 1,
  },
  cleaningTypeName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  cleaningTypeNameDefault: {
    color: '#111827',
  },
  cleaningTypeNameSelected: {
    color: '#065f46',
  },
  cleaningTypeSubtext: {
    fontSize: 14,
  },
  cleaningTypeSubtextDefault: {
    color: '#6b7280',
  },
  cleaningTypeSubtextSelected: {
    color: '#047857',
  },
  progressSection: {
    backgroundColor: '#ffffff',
    padding: 24,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginBottom: 32,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6b7280',
  },
  progressBarContainer: {
    width: '100%',
    height: 8,
    backgroundColor: '#e5e7eb',
    borderRadius: 4,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#10b981',
    borderRadius: 4,
  },
  nextButton: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginBottom: 32,
  },
  nextButtonEnabled: {
    backgroundColor: '#059669',
  },
  nextButtonDisabled: {
    backgroundColor: '#9ca3af',
  },
  nextButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default CleaningServiceApp;

