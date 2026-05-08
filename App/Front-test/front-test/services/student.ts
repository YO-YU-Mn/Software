import { api } from './api';

export async function fetchStudentProfile() { return api.get('/students/profile'); }
export async function fetchNotifications() { return api.get('/notifications/get'); }
export async function fetchRegistrationStatus() { return api.get('/settings/status'); }
export async function uploadProfilePicture(formData: FormData) { return api.upload('/upload/profile-picture', formData); }
export async function fetchAvailableCourses() { return api.get('/courses/available-courses'); }
export async function registerCourses(courseIds: string[]) { return api.post('/courses/register-courses', { course_ids: courseIds }); }
export async function fetchCurrentCourses() { return api.get('/courses/current'); }
export async function dropCourse(courseId: string) { return api.delete('/courses/drop', { course_id: courseId }); }
export async function dropAllCourses() { return api.delete('/courses/drop-all'); }