import {
  query as queryUsers,
  queryCurrent,
  deleteUser,
  insertUser,
  updateUser,
} from '@/services/user';

export default {
  namespace: 'user',

  state: {
    list: [],
    currentUser: {},
    newInsertId: undefined,
  },

  effects: {
    *fetch(_, { call, put }) {
      const response = yield call(queryUsers);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *fetchCurrent({ payload }, { call, put }) {
      const response = yield call(queryCurrent, payload);
      yield put({
        type: 'saveCurrentUser',
        payload: response,
      });
    },
    *deleteUser({ payload }, { call, put }) {
      const response = yield call(deleteUser, payload);
      yield put({
        type: 'delete',
        payload: response,
      });
    },
    *insertUser({ payload, callback }, { call }) {
      const response = yield call(insertUser, payload);
      if (callback && typeof callback === 'function') {
        callback(response); // 返回结果
      }
    },
    *updateUser({ payload }, { call, put }) {
      const response = yield call(updateUser, payload);
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
    saveCurrentUser(state, action) {
      return {
        ...state,
        currentUser: action.payload || {},
      };
    },
    changeNotifyCount(state, action) {
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          notifyCount: action.payload.totalCount,
          unreadCount: action.payload.unreadCount,
        },
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
        newInsertId: action.payload.id,
      };
    },
  },
};
