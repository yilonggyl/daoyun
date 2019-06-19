import {
  queryRoles,
  deleteRole,
  insertRole,
  updateRole
} from '@/services/role';

export default {
  namespace: 'role',
  
  state: {
    roleList: []
  },
  
  effects: {
    *queryRoles(_, { call, put }) {
      const response = yield call(queryRoles);
      yield put({
        type: 'save',
        payload: Array.isArray(response) ? response : [],
      });
    },
    *deleteRole({ payload }, { call, put }) {
      const response = yield call(deleteRole, payload);
      yield put({
        type: 'delete',
        payload: response,
      });
    },
    *insertRole({ payload, callback }, { call }) {
      const response = yield call(insertRole, payload);
      if (callback && typeof callback === 'function') {
        callback(response); // 返回结果
      }
    },
    *updateRole({ payload }, { call, put }) {
      const response = yield call(updateRole, payload);
      yield put({
        type: 'update',
        payload: response,
      });
    },
  },
  
  reducers: {
    save(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    },
    delete(state, action) {
      return {
        ...state,
        payload: action.payload,
      };
    },
    update(state, action) {
      return {
        ...state,
        payload: action.payload,
      };
    },
    insert(state, action) {
      return {
        ...state,
        payload: action.payload,
      };
    },
  },
};
