import { useState, useEffect } from "react";
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  ActivityIndicator, 
  StyleSheet,
  Alert 
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useRouter } from 'expo-router';
import CourseCard from "../../components/student/CourseCard";
import RegistrationFooter from "../../components/student/RegistrationFooter";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from 'react-native-toast-message';
  import { API_BASE_URL } from '../../config';

function RegistrationPage() {
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [coursesList, setCoursesList] = useState([]);
  const navigation = useNavigation();
  const router = useRouter();

  const totalHours = selectedCourses.reduce((sum, c) => sum + (c.hours || 0), 0);

  const [registrationOpen, setRegistrationOpen] = useState(true);
  const [regStatusLoading, setRegStatusLoading] = useState(true);

  useEffect(() => {
    const fetchRegStatus = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const res = await axios.get(`${API_BASE_URL}/settings/status`, {
          headers: { Authorization: token }
        });
        setRegistrationOpen(res.data.registrationOpen);
      } catch (err) {
        console.error(err);
        Toast.show({
          type: 'error',
          text1: 'فشل تحميل حالة التسجيل'
        });
      } finally {
        setRegStatusLoading(false);
      }
    };
    fetchRegStatus();
  }, []);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        const res = await axios.get(`${API_BASE_URL}/courses/available-courses`, {
          headers: { Authorization: token }
        });
        
        setCoursesList(res.data);
      } catch (err) {
        console.error(err);
        Toast.show({
          type: 'error',
          text1: 'فشل تحميل المواد'
        });
      } finally {
        setPageLoading(false);
      }
    };
    fetchCourses();
  }, []);

  function hasConflict(course) {
    if (!course.schedule) return false;
    for (let selected of selectedCourses) {
      if (!selected.schedule) continue;
      for (let s1 of selected.schedule) {
        for (let s2 of course.schedule) {
          if (s1.day === s2.day && s1.time === s2.time) return true;
        }
      }
    }
    return false;
  }

  function handleSelect(course) {
    if (!registrationOpen) {
      Toast.show({
        type: 'error',
        text1: 'تسجيل المواد مغلق حالياً'
      });
      return;
    }
    if (course.isRegistered) {
      Toast.show({
        type: 'error',
        text1: 'هذه المادة مسجلة مسبقاً'
      });
      return;
    }
    if (!course.canRegister) {
      Toast.show({
        type: 'error',
        text1: 'لا يمكنك تسجيل هذه المادة (المتطلبات غير مكتملة أو السعة ممتلئة)'
      });
      return;
    }
    if (selectedCourses.find(c => c.id === course.id)) {
      setSelectedCourses(selectedCourses.filter(c => c.id !== course.id));
      return;
    }
    if (totalHours + course.hours > 18) {
      Toast.show({
        type: 'error',
        text1: 'لا يمكن اختيار أكثر من 18 ساعة'
      });
      return;
    }
    if (hasConflict(course)) {
      Toast.show({
        type: 'error',
        text1: 'يوجد تعارض في المواعيد!'
      });
      return;
    }
    setSelectedCourses([...selectedCourses, course]);
  }

  async function handleSubmit() {
      // const router = useRouter();
    if (!registrationOpen) {
      Toast.show({
        type: 'error',
        text1: 'تسجيل المواد مغلق حالياً'
      });
      return;
    }
    if (selectedCourses.length === 0) {
      Toast.show({
        type: 'error',
        text1: 'اختر مواد أولاً'
      });
      return;
    }
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("token");
      const course_ids = selectedCourses.map(c => c.id);

      const response = await axios.post(
        `${API_BASE_URL}/courses/register-courses`,
        { course_ids },
        { headers: { Authorization: token } }
      );

      if (response.data.success) {
        const { registered, errors } = response.data;
        if (errors.length > 0) {
          Toast.show({
            type: 'success',
            text1: `تم تسجيل ${registered.length} مادة بنجاح`
          });
          errors.forEach(err => {
            Toast.show({
              type: 'error',
              text1: `فشل تسجيل ${err.course_id}: ${err.message}`
            });
          });
        } else {
          Toast.show({
            type: 'success',
            text1: 'تم تسجيل موادك بنجاح!'
          });
        }
        // router.push('/SchedulePage');
        navigation.navigate("SchedulePage");
      } else {
        Toast.show({
          type: 'error',
          text1: 'فشل في تسجيل المواد'
        });
      }
    } catch (error) {
      console.error(error);
      Toast.show({
        type: 'error',
        text1: 'حدث خطأ في الاتصال بالسيرفر'
      });
    } finally {
      setLoading(false);
    }
  }

  if (pageLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>تسجيل المقررات</Text>
        <View style={styles.hoursCard}>
          <Text style={styles.hoursIcon}>📚</Text>
          <View style={styles.hoursInfo}>
            <Text style={styles.hoursLabel}>إجمالي الساعات</Text>
            <Text style={styles.hoursValue}>{totalHours}</Text>
            <Text style={styles.hoursMax}>الحد الأقصى: 18 ساعة</Text>
          </View>
        </View>
      </View>

      {coursesList.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>لا توجد مواد متاحة</Text>
          <Text style={styles.emptyText}>سيتم إضافة المواد قريباً</Text>
        </View>
      ) : (
        <>
          <ScrollView 
            style={styles.scrollView}
            contentContainerStyle={styles.coursesGrid}
          >
            {coursesList.map(course => (
              <CourseCard
                key={course.id}
                course={course}
                isSelected={selectedCourses.find(c => c.id === course.id)}
                onSelect={handleSelect}
                totalHours={totalHours}
              />
            ))}
          </ScrollView>

          <RegistrationFooter
            selectedCourses={selectedCourses}
            totalHours={totalHours}
            loading={loading}
            onSubmit={handleSubmit}
            disabled={!registrationOpen}
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  header: {
    backgroundColor: '#FFF',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'right',
    marginBottom: 15,
  },
  hoursCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F8FF',
    padding: 15,
    borderRadius: 12,
  },
  hoursIcon: {
    fontSize: 32,
    marginRight: 15,
  },
  hoursInfo: {
    flex: 1,
  },
  hoursLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'right',
  },
  hoursValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#007AFF',
    textAlign: 'right',
  },
  hoursMax: {
    fontSize: 11,
    color: '#999',
    textAlign: 'right',
  },
  scrollView: {
    flex: 1,
  },
  coursesGrid: {
    padding: 15,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});

export default RegistrationPage;