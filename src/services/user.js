import request from '@/utils/request';

export async function query() {
  return request('/api/userlist');
}

export async function queryCurrent(params) {
  return request(`/api/currentUser/${params}`);
}

export async function deleteUser(params) {
  return request(`/api/daoyunusers/${params}`, {
    method: 'DELETE',
  });
}

export async function insertUser(params) {
  return request(`/api/daoyunusers`, {
    method: 'POST',
    body: params,
  });
}

export async function updateUser(params) {
  return request(`/api/daoyunusers`, {
    method: 'PUT',
    body: params,
  });
}

export async function resetPassword(params) {
  return request(`/api/resetPassword/${params}`);
}
