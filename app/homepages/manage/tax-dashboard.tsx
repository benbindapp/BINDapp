import { useRouter } from 'expo-router';
import {
  ArrowLeft,
  Calculator,
  DollarSign,
  Download,
  FileText,
  Plus,
  TrendingUp,
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

interface QuarterlyPayment {
  quarter: string;
  amount: number;
  status: 'paid' | 'due' | 'upcoming';
  date: string;
}

interface Deduction {
  category: string;
  amount: number;
  receipts: number;
}

export default function TaxDashboardPage() {
  const router = useRouter();

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const taxData = {
    totalIncome: 28500,
    totalDeductions: 5000,
    taxSavings: 1915,
    nextPayment: 1786,
    quarterlyPayments: [
      { quarter: 'Q1 2025', amount: 1650, status: 'paid' as const, date: 'Jan 15' },
      { quarter: 'Q2 2025', amount: 1786, status: 'due' as const, date: 'Apr 15' },
      { quarter: 'Q3 2025', amount: 1800, status: 'upcoming' as const, date: 'Jun 15' },
      { quarter: 'Q4 2025', amount: 1850, status: 'upcoming' as const, date: 'Sep 15' }
    ],
    deductions: [
      { category: 'Home Office', amount: 1200, receipts: 12 },
      { category: 'Equipment', amount: 850, receipts: 5 },
      { category: 'Software', amount: 600, receipts: 8 },
      { category: 'Travel', amount: 450, receipts: 3 },
      { category: 'Training', amount: 300, receipts: 2 },
      { category: 'Other', amount: 1600, receipts: 15 }
    ]
  };

  const getStatusDotColor = (status: QuarterlyPayment['status']): string => {
    switch (status) {
      case 'paid': return '#10B981';
      case 'due': return '#F59E0B';
      default: return '#D1D5DB';
    }
  };

  const getStatusTextColor = (status: QuarterlyPayment['status']): string => {
    switch (status) {
      case 'paid': return '#059669';
      case 'due': return '#D97706';
      default: return '#6B7280';
    }
  };

  interface SummaryCardProps {
    icon: React.ReactNode;
    label: string;
    value: string;
    subtext: string;
    backgroundColor: string;
  }

  const SummaryCard: React.FC<SummaryCardProps> = ({ icon, label, value, subtext, backgroundColor }) => (
    <View style={[styles.summaryCard, { backgroundColor }]}>
      <View style={styles.summaryHeader}>
        {React.cloneElement(icon as React.ReactElement, {
          width: 20,
          height: 20,
          color: '#FFFFFF',
          opacity: 0.5
        })}
        <Text style={styles.summaryLabel}>{label}</Text>
      </View>
      <Text style={styles.summaryValue}>{value}</Text>
      <Text style={styles.summarySubtext}>{subtext}</Text>
    </View>
  );

  const maxDeductionAmount = Math.max(...taxData.deductions.map(d => d.amount));

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft width={24} height={24} color="#000000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Tax Dashboard</Text>
        <TouchableOpacity style={styles.downloadButton}>
          <Download width={16} height={16} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <View style={styles.summaryGrid}>
          <SummaryCard
            icon={<DollarSign />}
            label="Total Income"
            value={formatCurrency(taxData.totalIncome)}
            subtext="+12% from last year"
            backgroundColor="#10B981"
          />
          <SummaryCard
            icon={<Calculator />}
            label="Tax Savings"
            value={formatCurrency(taxData.taxSavings)}
            subtext="From deductions"
            backgroundColor="#3B82F6"
          />
          <SummaryCard
            icon={<FileText />}
            label="Deductions"
            value={formatCurrency(taxData.totalDeductions)}
            subtext="45 receipts tracked"
            backgroundColor="#F59E0B"
          />
          <SummaryCard
            icon={<TrendingUp />}
            label="Next Payment"
            value={formatCurrency(taxData.nextPayment)}
            subtext="Due Apr 15"
            backgroundColor="#EF4444"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quarterly Payments 2025</Text>
          <View style={styles.paymentsList}>
            {taxData.quarterlyPayments.map((payment, index) => (
              <View key={index} style={styles.paymentItem}>
                <View style={styles.paymentLeft}>
                  <View style={[styles.statusDot, { backgroundColor: getStatusDotColor(payment.status) }]} />
                  <View style={styles.paymentInfo}>
                    <Text style={styles.paymentQuarter}>{payment.quarter}</Text>
                    <Text style={styles.paymentDate}>Due {payment.date}</Text>
                  </View>
                </View>
                <View style={styles.paymentRight}>
                  <Text style={styles.paymentAmount}>{formatCurrency(payment.amount)}</Text>
                  <Text style={[styles.paymentStatus, { color: getStatusTextColor(payment.status) }]}>
                    {payment.status}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Deduction Breakdown</Text>
            <TouchableOpacity style={styles.addButton}>
              <Plus width={16} height={16} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
          <View style={styles.deductionsList}>
            {taxData.deductions.map((deduction, index) => {
              const progressWidth = (deduction.amount / maxDeductionAmount) * 100;
              return (
                <View key={index} style={styles.deductionItem}>
                  <View style={styles.deductionLeft}>
                    <Text style={styles.deductionCategory}>{deduction.category}</Text>
                    <Text style={styles.deductionReceipts}>{deduction.receipts} receipts</Text>
                  </View>
                  <View style={styles.deductionRight}>
                    <Text style={styles.deductionAmount}>{formatCurrency(deduction.amount)}</Text>
                    <View style={styles.progressBarContainer}>
                      <View style={styles.progressBarBackground}>
                        <View 
                          style={[styles.progressBarFill, { width: `${progressWidth}%` }]}
                        />
                      </View>
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },
  downloadButton: {
    backgroundColor: '#10B981',
    padding: 8,
    borderRadius: 8,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 80,
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryCard: {
    width: '48%',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  summarySubtext: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  addButton: {
    backgroundColor: '#10B981',
    padding: 8,
    borderRadius: 8,
  },
  paymentsList: {
    gap: 8,
  },
  paymentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F9FAFB',
    padding: 12,
    borderRadius: 12,
  },
  paymentLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  paymentInfo: {
    flex: 1,
  },
  paymentQuarter: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  paymentDate: {
    fontSize: 14,
    color: '#6B7280',
  },
  paymentRight: {
    alignItems: 'flex-end',
  },
  paymentAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
  },
  paymentStatus: {
    fontSize: 12,
    textTransform: 'capitalize',
  },
  deductionsList: {
    gap: 8,
  },
  deductionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F9FAFB',
    padding: 12,
    borderRadius: 12,
  },
  deductionLeft: {
    flex: 1,
  },
  deductionCategory: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  deductionReceipts: {
    fontSize: 14,
    color: '#6B7280',
  },
  deductionRight: {
    alignItems: 'flex-end',
  },
  deductionAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  progressBarContainer: {
    width: 80,
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: 'rgba(209, 213, 219, 0.5)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: 'rgba(16, 185, 129, 0.5)',
    borderRadius: 4,
  },
});