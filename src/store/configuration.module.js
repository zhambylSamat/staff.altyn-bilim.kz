import ApiService from "@/common/api.service.js";
import {
  SET_DEFAULT_ACTION,
  REMOVE_ERRORS_ACTION,
  REMOVE_WARNINGS_ACTION,
  REMOVE_SUCCESS_ACTION,

  GET_LESSON_GROUP_WITH_IP,
  SET_LESSON_GROUP_WITH_IP,
  UNSET_LESSON_GROUP_WITH_IP
} from "./actions.type.js";
import {
  SET_DEFAULT_MUTATION,
  SET_ERROR,
  SET_WARNING,
  SET_SUCCESS,
  REMOVE_ERRORS_MUTATION,
  REMOVE_WARNINGS_MUTATION,
  REMOVE_SUCCESS_MUTATION,
  
  GET_LESSON_GROUP_WITH_IP_MUTATION,
  SET_LESSON_GROUP_WITH_IP_MUTATION,
  UNSET_LESSON_GROUP_WITH_IP_MUTATION
} from  "./mutations.type.js";

const defaultState = () => {
  return {
    errors: {},
    warnings: [],
    success: [],

    checking_with_ip: null
  }
}

const state = defaultState();

const getters = {
  getCheckingWithIp(state) {
    return state.checking_with_ip;
  }
}

const actions = {
  [SET_DEFAULT_ACTION](context) {
    context.commit(SET_DEFAULT_MUTATION);
  },
  [REMOVE_ERRORS_ACTION](context) {
    context.commit(REMOVE_ERRORS_MUTATION);
  },
  [REMOVE_WARNINGS_ACTION](context) {
    context.commit(REMOVE_WARNINGS_MUTATION);
  },
  [REMOVE_SUCCESS_ACTION](context) {
    context.commit(REMOVE_SUCCESS_MUTATION);
  },

  [GET_LESSON_GROUP_WITH_IP](context) {
    return new Promise((resolve, reject) => {
      ApiService.setHeader();
      ApiService.get('config/lesson/group/check/ip/get/')
        .then(response => {
          context.commit(GET_LESSON_GROUP_WITH_IP_MUTATION, response.data.is_access_with_ip);
          resolve(response);
        })
        .catch(({ response }) => {
          context.commit(SET_ERROR, response.data);
          reject(response);
        });
    })
  },
  [UNSET_LESSON_GROUP_WITH_IP](context) {
    return new Promise((resolve, reject) => {
      ApiService.setHeader();
      ApiService.put('config/lesson/group/check/ip/set/')
        .then(response => {
          context.commit(UNSET_LESSON_GROUP_WITH_IP_MUTATION);
          resolve(response);
        })
        .catch(({ response }) => {
          context.commit(SET_ERROR, response.data);
          reject(response);
        });
    })
  },
  [SET_LESSON_GROUP_WITH_IP](context) {
    return new Promise((resolve, reject) => {
      ApiService.setHeader();
      ApiService.post('config/lesson/group/check/ip/unset/')
        .then(response => {
          context.commit(SET_LESSON_GROUP_WITH_IP_MUTATION);
          resolve(response);
        })
        .catch(({ response }) => {
          context.commit(SET_ERROR, response.data);
          reject(response);
        });
    })
  }
};

const mutations = {
  [SET_DEFAULT_MUTATION](state) {
    Object.assign(state, defaultState());
  },
  [SET_ERROR](state, error) {
    state.errors = error;
  },
  [SET_SUCCESS](state, success) {
    state.success = success;
  },
  [SET_WARNING](state, warning) {
    state.warnings = warning;
  },
  [REMOVE_ERRORS_MUTATION](state) {
    state.errors = {};
  },
  [REMOVE_SUCCESS_MUTATION](state) {
    state.success = [];
  },
  [REMOVE_WARNINGS_MUTATION](state) {
    state.warnings = [];
  },

  [GET_LESSON_GROUP_WITH_IP_MUTATION](state, data) {
    state.checking_with_ip = data;
  },
  [SET_LESSON_GROUP_WITH_IP_MUTATION](state) {
    state.checking_with_ip = false;
  },
  [UNSET_LESSON_GROUP_WITH_IP_MUTATION](state) {
    state.checking_with_ip = true;
  }
};

export default {
  state,
  actions,
  mutations,
  getters
};
