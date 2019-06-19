import { stringify } from 'qs';
import request from '@/utils/request';

export async function queryCourseList() {
  return request('/api/courselist');
}

export async function insertCourse(params) {
  return request(`/api/daoyuncourses`, {
    method: 'POST',
    body: params,
  });
}

export async function updateCourse(params) {
  return request(`/api/daoyuncourses`, {
    method: 'PUT',
    body: params,
  });
}

export async function deleteCourse(params) {
  return request(`/api/daoyuncourses/${params}`, {
    method: 'DELETE',
  });
}
