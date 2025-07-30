import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import {
  ArrowLeft
} from 'lucide-react-native';
import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

interface Template {
  id: string;
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
  bgColor: string;
  iconColor: string;
}

interface SaleTemplatesProps {
  onClose?: () => void;
  onTemplateSelect?: (templateId: string) => void;
}

const SaleTemplates: React.FC<SaleTemplatesProps> = ({
  onClose,
  onTemplateSelect,
}) => {
  const handleTemplateSelect = (templateId: string) => {
    console.log(`Selected template: ${templateId}`);
    onTemplateSelect?.(templateId);
  };

  const router = useRouter()

  const templates: Template[] = [
    {
      id: 'vehicle',
      icon: 'car-outline',
      title: 'Vehicle Sale',
      description: 'Define price, condition & transfer details for cars, boats & more.',
      bgColor: '#FEE2E2',
      iconColor: '#DC2626'
    },
    {
      id: 'electronics',
      icon: 'laptop-outline',
      title: 'Electronics Sale',
      description: 'Warranty, fulfillment & payment terms for gadgets & devices.',
      bgColor: '#DBEAFE',
      iconColor: '#2563EB'
    },
    {
      id: 'jewelry',
      icon: 'diamond-outline',
      title: 'Jewelry Sale',
      description: 'Authentication, pricing & transfer details for fine jewelry.',
      bgColor: '#EDE9FE',
      iconColor: '#7C3AED'
    },
    {
      id: 'collectibles',
      icon: 'image-outline',
      title: 'Collectibles Sale',
      description: 'Condition, history & sale terms for rare items.',
      bgColor: '#FEF3C7',
      iconColor: '#D97706'
    },
    {
      id: 'clothing',
      icon: 'shirt-outline',
      title: 'Clothing Sale',
      description: 'Size, condition & transfer details for apparel & accessories.',
      bgColor: '#FCE7F3',
      iconColor: '#DB2777'
    },
    {
      id: 'sneakers',
      icon: 'footsteps-outline',
      title: 'Sneaker Sale',
      description: 'Size, brand, condition & authenticity details for sneakers.',
      bgColor: '#FEF9C3',
      iconColor: '#CA8A04'
    },
    {
      id: 'equipment',
      icon: 'construct-outline',
      title: 'Equipment Sale',
      description: 'Heavy machinery or gear—price, pickup & liability terms.',
      bgColor: '#F3F4F6',
      iconColor: '#6B7280'
    },
    {
      id: 'real-estate',
      icon: 'business-outline',
      title: 'Real Estate Sale',
      description: 'Property specifics, sale price & closing obligations.',
      bgColor: '#D1FAE5',
      iconColor: '#059669'
    }
  ];

  const TemplateCard: React.FC<{ template: Template }> = ({ template }) => (
    <TouchableOpacity
      onPress={() => {
                  if (template.id === 'vehicle') {
                    router.push('/homepages/createcontract/sale/vehicle/vehicle1'); // <--- customize this route
                  }
                  if (template.id === 'jewelry') {
                    router.push('/homepages/createcontract/sale/jewelry/jewelry1'); // <--- customize this route
                  }
                  if (template.id === 'clothing') {
                    router.push('/homepages/createcontract/sale/clothing/clothing1'); // <--- customize this route
                  }
                  if (template.id === 'electronics') {
                    router.push('/homepages/createcontract/sale/electronics/electronics1'); // <--- customize this route
                  }
                  if (template.id === 'sneakers') {
                    router.push('/homepages/createcontract/sale/sneakers/sneakers1'); // <--- customize this route
                  }
                  handleTemplateSelect(template.id);
                }}
      style={styles.templateCard}
      activeOpacity={0.8}
    >
      <View style={styles.templateContent}>
        <View style={[styles.iconContainer, { backgroundColor: template.bgColor }]}>
          <Ionicons name={template.icon} size={24} color={template.iconColor} />
        </View>
        <View style={styles.templateTextContainer}>
          <Text style={styles.templateTitle}>{template.title}</Text>
          <Text style={styles.templateDescription}>{template.description}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

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
          <Text style={styles.title}>Sale Templates</Text>
          <Text style={styles.subtitle}>Choose a template to get started quickly</Text>
        </View>

        {/* Templates Grid */}
        <View style={styles.templatesContainer}>
          {templates.map((template) => (
            <TemplateCard key={template.id} template={template} />
          ))}
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
  closeButton: {
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
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
  templatesContainer: {
    gap: 16,
    marginBottom: 24,
  },
  templateCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    height: 128,
  },
  templateContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    flex: 1,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  templateTextContainer: {
    flex: 1,
  },
  templateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  templateDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
});

export default SaleTemplates;

