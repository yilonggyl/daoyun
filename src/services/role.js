import request from '@/utils/request';

// eslint-disable-next-line import/prefer-default-export
export async function queryRoles() {
  return request('/api/rolelist');
}

export async function insertRole(params) {
  return request(`/api/daoyunroles`, {
    method: 'POST',
    body: params,
  });
}

export async function updateRole(params) {
  return request(`/api/daoyunroles`, {
    method: 'PUT',
    body: params,
  });
}

export async function deleteRole(params) {
  return request(`/api/daoyunroles/${params}`, {
    method: 'DELETE',
  });
}
