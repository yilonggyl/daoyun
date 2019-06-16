import {
  queryCourseList,
  deleteCourse,
  insertCourse,
  updateCourse
} from '@/services/course';

export default {
  namespace: 'course',
  
  state: {
    list: [],
  },
  
  effects: {
    *queryCourseList(_, { call, put }) {
      const response = yield call(queryCourseList);
      yield put({
        type: 'save',
        payload: Array.isArray(response) ? response : [],
      });
    },
    *deleteCourse({ payload }, { call, put }) {
      const response = yield call(deleteCourse, payload);
      yield put({
        type: 'delete',
        payload: response,
      });
    },
    *insertCourse({ payload, callback }, { call }) {
      const response = yield call(insertCourse, payload);
      if (callback && typeof callback === 'function') {
        callback(response); // 返回结果
      }
    },
    *updateCourse({ payload }, { call, put }) {
      const response = yield call(updateCourse, payload);
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
