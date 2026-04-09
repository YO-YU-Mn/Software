import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';

function RegistrationFooter({ selectedCourses, totalHours, loading, onSubmit, disabled }) {
  return (
    <View style={styles.registrationFooter}>
      <View style={styles.selectedSummary}>
        <View style={styles.selectedCount}>
          <Text style={styles.countNumber}>{selectedCourses.length}</Text>
          <Text style={styles.countLabel}>Selected Subjects</Text>
        </View>
        <View style={styles.totalHoursFooter}>
          <Text style={styles.hoursText}>Total Hours: {totalHours}/18</Text>
        </View>
      </View>

      <TouchableOpacity
        style={[
          styles.btnSubmit,
          (loading || selectedCourses.length === 0 || disabled) && styles.btnDisabled
        ]}
        onPress={onSubmit}
        disabled={loading || selectedCourses.length === 0 || disabled}
        activeOpacity={0.7}
      >
        {loading ? (
          <View style={styles.btnContent}>
            <ActivityIndicator color="#FFF" size="small" style={styles.spinner} />
            <Text style={styles.btnText}>Saving...</Text>
          </View>
        ) : (
          <View style={styles.btnContent}>
            <Text style={styles.btnIcon}>✓</Text>
            <Text style={styles.btnText}>Confirm Register</Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  registrationFooter: {
    backgroundColor: '#FFF',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  selectedSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  selectedCount: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  countNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    minWidth: 40,
    textAlign: 'center',
  },
  countLabel: {
    fontSize: 14,
    color: '#666',
  },
  totalHoursFooter: {
    backgroundColor: '#F0F8FF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  hoursText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  btnSubmit: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnDisabled: {
    backgroundColor: '#CCC',
    opacity: 0.6,
  },
  btnContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  spinner: {
    marginRight: 8,
  },
  btnIcon: {
    fontSize: 18,
    color: '#FFF',
  },
  btnText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default RegistrationFooter;
