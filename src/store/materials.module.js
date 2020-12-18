import ApiService from "@/common/api.service.js";
import {
  SET_DEFAULT_ACTION,
  REMOVE_ERRORS_ACTION,
  REMOVE_WARNINGS_ACTION,
  REMOVE_SUCCESS_ACTION,
  GET_SUBJECTS,
  GET_CHAPTER_AND_TOPICS,
} from "./actions.type.js";
import {
  SET_DEFAULT_MUTATION,
  SET_ERROR,
  SET_WARNING,
  SET_SUCCESS,
  REMOVE_ERRORS_MUTATION,
  REMOVE_WARNINGS_MUTATION,
  REMOVE_SUCCESS_MUTATION,
  SET_SUBJECTS,
  SET_CHAPTERS_AND_SUBJECTS,
} from  "./mutations.type.js";

const defaultState = () => {
  return {
    errors: {},
    warnings: [],
    success: [],
    subjects: [],
    chapersAndTopics: [],
  }
}

const state = defaultState();

const getters = {
  getSubjects(state) {
    return state.subjects;
  },
  getSubjectById: (state) => (subject_pk) => {
    for (let i = 0; i < state.subjects.length; i++) {
      if (state.subjects[i].pk == subject_pk) {
        return state.subjects[i];
      }
    }
    return [];
  },
  getChaptersAndTopics: (state) => (index) => {
    return state.chapersAndTopics[index];
  },
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
  [GET_SUBJECTS](context) {
    return new Promise((resolve, reject) => {
      ApiService.setHeader();
      ApiService.get("materials/subject/list/")
        .then(response => {
          context.commit(SET_SUBJECTS, response.data);
          resolve(response);
        })
        .catch(({ response }) => {
          context.commit(SET_ERROR, response.data.message);
          reject(response);
        });
    });
  },
  [GET_CHAPTER_AND_TOPICS](context, credentials) {
    return new Promise((resolve, reject) => {
      ApiService.setHeader();
      ApiService.get("materials/chapter/topic/list/", credentials.subject_pk)
        .then(response => {
          var result = {
            content: response.data,
            index: credentials.index
          }
          context.commit(SET_CHAPTERS_AND_SUBJECTS, result);
          resolve(response);
        })
        .catch(({ response }) => {
          context.commit(SET_ERROR, response.data.message);
          reject(response);
        })
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
  [SET_SUBJECTS](state, data) {
    state.subjects = data;
  },
  [SET_CHAPTERS_AND_SUBJECTS](state, data) {
    state.chapersAndTopics[data.index] = data.content;
  }
};

export default {
  state,
  actions,
  mutations,
  getters
};
