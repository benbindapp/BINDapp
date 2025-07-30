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

interface ServiceTemplatesProps {
  onClose?: () => void;
  onTemplateSelect?: (templateId: string) => void;
}

const ServiceTemplates: React.FC<ServiceTemplatesProps> = ({
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
      id: 'construction',
      icon: 'hammer-outline',
      title: 'Construction',
      description: 'Scope, milestones & payments for any build or remodel.',
      bgColor: '#F3F4F6',
      iconColor: '#6B7280'
    },
    {
      id: 'real-estate',
      icon: 'business-outline',
      title: 'Real Estate Services',
      description: 'Repairs, showings, property management & more.',
      bgColor: '#DBEAFE',
      iconColor: '#2563EB'
    },
    {
      id: 'catering',
      icon: 'restaurant-outline',
      title: 'Catering Services',
      description: 'Menu, headcounts & payment terms for events big & small.',
      bgColor: '#FED7AA',
      iconColor: '#EA580C'
    },
    {
      id: 'landscaping',
      icon: 'leaf-outline',
      title: 'Landscaping & Outdoor Work',
      description: 'Lawn care, hardscaping, irrigation & garden projects.',
      bgColor: '#DCFCE7',
      iconColor: '#16A34A'
    },
    {
      id: 'creative',
      icon: 'color-palette-outline',
      title: 'Creative Services',
      description: 'Design, photography, videography & marketing gigs.',
      bgColor: '#E9D5FF',
      iconColor: '#9333EA'
    },
    {
      id: 'web-it',
      icon: 'globe-outline',
      title: 'Web & IT Services',
      description: 'Site builds, app dev, hosting & support agreements.',
      bgColor: '#CFFAFE',
      iconColor: '#0891B2'
    },
    {
      id: 'professional',
      icon: 'briefcase-outline',
      title: 'Professional Services',
      description: 'Consulting, legal, accounting & advisory work.',
      bgColor: '#F1F5F9',
      iconColor: '#475569'
    },
    {
      id: 'pilot',
      icon: 'airplane-outline',
      title: 'Pilot Services',
      description: 'Professional pilots & crew for aircraft operation and support.',
      bgColor: '#E0F2FE',
      iconColor: '#0284C7'
    },
    {
      id: 'cleaning',
      icon: 'sparkles-outline',
      title: 'Cleaning Services',
      description: 'Professional cleaning for homes, vehicles, equipment, and more.',
      bgColor: '#ECFDF5',
      iconColor: '#059669'
    }
  ];

  const TemplateCard: React.FC<{ template: Template }> = ({ template }) => (
    <TouchableOpacity
      onPress={() => {
                  if (template.id === 'pilot') {
                    router.push('/homepages/createcontract/service/pilot/pilot1'); // <--- customize this route
                  }
                  if (template.id === 'construction') {
                    router.push('/homepages/createcontract/service/construction/construction1'); // <--- customize this route
                  }
                  if (template.id === 'cleaning') {
                    router.push('/homepages/createcontract/service/cleaning/cleaning1'); // <--- customize this route
                  }
                  if (template.id === 'catering') {
                    router.push('/homepages/createcontract/service/catering/catering1'); // <--- customize this route
                  }
                  if (template.id === 'creative') {
                    router.push('/homepages/createcontract/service/influencer/influencer1'); // <--- customize this route
                  }
                  if (template.id === 'landscaping') {
                    router.push('/homepages/createcontract/service/landscaping/landscaping1'); // <--- customize this route
                  }
                  if (template.id === 'web-it') {
                    router.push('/homepages/createcontract/service/web-it/web-it1'); // <--- customize this route
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
          <Text style={styles.title}>Service Templates</Text>
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

export default ServiceTemplates;

