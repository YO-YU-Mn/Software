import { api } from './api';

export async function fetchStudentProfile(
  token: string
) {

  return api.get('/students/profile');
}

export async function fetchNotifications(
  token: string
) {

  return api.get('/notifications/get');
}

export async function fetchRegistrationStatus(
  token: string
) {

  return api.get('/settings/status');
}

export async function uploadProfilePicture(
  token: string,
  formData: FormData
) {

  return api.upload(
    '/upload/profile-picture',
    formData
  );
}