import { useRouter } from 'expo-router';
import {
  Archive,
  ArrowLeft,
  Building,
  Car,
  Monitor,
  PartyPopper,
  Ship,
  Sofa,
  Wrench
} from 'lucide-react-native';
import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
interface Template {
  id: string;
  icon: React.ComponentType<any>;
  title: string;
  description: string;
  bgColor: string;
  iconColor: string;
}

const RentalTemplates: React.FC = () => {
  const router = useRouter()
  const handleTemplateSelect = (templateId: string): void => {
    console.log(`Selected template: ${templateId}`);
    // Navigate to template customization
  };

  const templates: Template[] = [
    {
      id: 'apartment-house',
      icon: Building,
      title: 'Apartment/House Rental',
      description: 'Houses, apartments, condos and more.',
      bgColor: '#dcfce7', // bg-green-100
      iconColor: '#16a34a', // text-green-600
    },
    {
      id: 'car-rental',
      icon: Car,
      title: 'Car Rental',
      description: 'Cars, trucks, SUVs and more.',
      bgColor: '#dbeafe', // bg-blue-100
      iconColor: '#2563eb', // text-blue-600
    },
    {
      id: 'equipment-rental',
      icon: Wrench,
      title: 'Equipment Rental',
      description: 'Drills, generators, heavy machinery and more.',
      bgColor: '#fed7aa', // bg-orange-100
      iconColor: '#ea580c', // text-orange-600
    },
    {
      id: 'boat-rv',
      icon: Ship,
      title: 'Boat & RV Rental',
      description: 'Boats, yachts, campers and more.',
      bgColor: '#cffafe', // bg-cyan-100
      iconColor: '#0891b2', // text-cyan-600
    },
    {
      id: 'event-party',
      icon: PartyPopper,
      title: 'Event & Party Rental',
      description: 'Tables, chairs, tents and more.',
      bgColor: '#fce7f3', // bg-pink-100
      iconColor: '#db2777', // text-pink-600
    },
    {
      id: 'tech-av',
      icon: Monitor,
      title: 'Tech & AV Equipment Rental',
      description: 'Laptops, cameras, projectors, sound systems and other electronics.',
      bgColor: '#e9d5ff', // bg-purple-100
      iconColor: '#9333ea', // text-purple-600
    },
    {
      id: 'furniture-appliance',
      icon: Sofa,
      title: 'Furniture & Appliance Rental',
      description: 'Sofas, beds, refrigerators and more.',
      bgColor: '#f1f5f9', // bg-slate-100
      iconColor: '#475569', // text-slate-600
    },
    {
      id: 'storage-unit',
      icon: Archive,
      title: 'Storage Unit Rental',
      description: 'Climate-controlled, drive-up, indoor, outdoor and vehicle storage units.',
      bgColor: '#f3f4f6', // bg-gray-100
      iconColor: '#4b5563', // text-gray-600
    },
  ];

  const TemplateCard: React.FC<{ template: Template }> = ({ template }) => {
    const IconComponent = template.icon;
    return (
      <TouchableOpacity
        onPress={() => {
                  if (template.id === 'apartment-house') {
                    router.push('/homepages/createcontract/rent/apartment/apartment1'); // <--- customize this route
                  }
                  handleTemplateSelect(template.id);
                }}
        style={styles.templateCard}
        activeOpacity={0.7}
      >
        <View style={styles.cardContent}>
          <View style={[styles.iconContainer, { backgroundColor: template.bgColor }]}>
            <IconComponent size={24} color={template.iconColor} />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.title}>{template.title}</Text>
            <Text style={styles.description}>{template.description}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f9fafb" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
            <ArrowLeft width={24} height={24} color="#000000" />
        </TouchableOpacity>
        <View style={styles.headerSpacer} />
      </View>

      {/* Main Content */}
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.titleSection}>
            <Text style={styles.mainTitle}>Rental Agreement Templates</Text>
            <Text style={styles.subtitle}>Choose a template to get started quickly</Text>
          </View>

          {/* Templates Grid */}
          <View style={styles.templatesGrid}>
            {templates.map((template) => (
              <TemplateCard key={template.id} template={template} />
            ))}
          </View>
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
    backgroundColor: '#f9fafb',
    paddingHorizontal: 16,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  closeButton: {
    padding: 8,
    marginLeft: -8,
  },
  headerSpacer: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 24,
    paddingVertical: 4,
  },
  titleSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  mainTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#4b5563',
  },
  templatesGrid: {
    gap: 16,
    marginBottom: 96, // equivalent to mb-24
  },
  templateCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    height: 128,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    height: '100%',
    gap: 16,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: '#4b5563',
    lineHeight: 20,
  },
});

export default RentalTemplates;

