import ApiService from "@/common/api.service.js";
import {
  SET_DEFAULT_ACTION,
  REMOVE_ERRORS_ACTION,
  REMOVE_WARNINGS_ACTION,
  REMOVE_SUCCESS_ACTION,
  SET_STUDENT_PLAN,
  EDIT_STUDENT_PLAN,
  SYNC_STUDENT_PLAN_ACTION_BY_STUDENT_ID,
  GET_OFFICE_LIST,
  SET_OFFICE,
  GET_SCHEDULE_LIST,
  CREATE_GROUP,
  EDIT_GROUP,
  DELETE_GROUP,
  GET_GROUP_LIST, // depreciated
  GET_GROUP_LIST_OFFSET,
  SET_STUDENT_PLAN_TO_GROUP,
  GET_STUDENT_PLANS_BY_GROUP,
  GET_AVAILABLE_SCHEDULES,
  EDIT_STUDENT_PLAN_TO_GROUP,
  REMOVE_STUDENT_PLAN_FROM_GROUP,
  GET_GROUP_REPLACE_LIST,
  SET_GROUP_REPLACEMENT,
  EDIT_GROUP_REPLACEMENT,
  DELETE_GROUP_REPLACEMENT,
  GET_DAY_OFF_LIST,
  ADD_DAY_OFF_LIST,
  EDIT_DAY_OFF,
  DELETE_DAY_OFF,
  GET_GROUP_TIME_TRANSFER,
  ADD_GROUP_TIME_TRANSFER,
  DELETE_GROUP_TIME_TRANSFER,
  CHECK_GROUPS_LIST,
  GET_STUDENTS_ABS_LIST,
  GET_STUDENT_ABS_MONTH_LIST,
} from "./actions.type.js";
import {
  SET_DEFAULT_MUTATION,
  SET_ERROR,
  SET_WARNING,
  SET_SUCCESS,
  REMOVE_ERRORS_MUTATION,
  REMOVE_WARNINGS_MUTATION,
  REMOVE_SUCCESS_MUTATION,
  SET_STUDENT_PLAN_MUTATION,
  EDIT_STUDENT_PLAN_MUTATION,
  // SET_SYNCED_STUDENT_PLAN_ACTION_BY_STUDENT_ID,
  SET_OFFICE_LIST_MUTATION,
  SET_OFFICE_MUTATION,
  SET_SCHEDULE_LIST_MUTATION,
  SET_GROUP_MUTATION,
  EDIT_GROUP_MUTATION,
  DELETE_GROUP_MUTATION,
  SET_GROUP_LIST_MUTATION, // depreciated
  SET_GROUP_LIST_OFFSET,
  SET_STUDENT_PLAN_TO_GROUP_MUTATION,
  GET_STUDENT_PLANS_BY_GROUP_MUTATION,
  SET_AVAILABLE_SCHEDULES,
  EDIT_STUDENT_PLAN_TO_GROUP_MUTATION,
  REMOVE_STUDENT_PLAN_FROM_GROUP_MUTATION,
  SET_GROUP_REPLACE_LIST,
  SET_GROUP_REPLACEMENT_MUTATION,
  EDIT_GROUP_REPLACEMENT_MUTATION,
  DELETE_GROUP_REPLACEMENT_MUTATION,
  SET_DAY_OFF_LIST,
  APPEND_DAY_OFF_LIST,
  EDIT_DAY_OFF_MUTATION,
  DELETE_DAY_OFF_MUTATION,
  SET_GROUP_TIME_TRANSFER,
  APPEND_GROUP_TIME_TRANSFER,
  DELETE_GROUP_TIME_TRANSFER_MUTATION,
  CHECK_GROUPS_LIST_MUTATION,
  SET_STUDENTS_ABS_LIST,
  SET_STUDENT_ABS_MONTH_LIST
} from  "./mutations.type.js";

const defaultState = () => {
  return {
    errors: {},
    warnings: [],
    success: [],
    offices: [],
    schedules: [],
    groups: null,
    availableSchedules: null,
    groupReplaceList: null,
    day_off_list: null,
    group_time_transfer_list: null,
    studentsABSList: null,
    studentsABSMonthList: null,
  }
}

const state = defaultState();

const getters = {
  getOfficeList(state) {
    return state.offices;
  },
  getSchedules(state) {
    return state.schedules;
  },
  getGroups(state) {
    return state.groups;
  },
  getStudentPlansByGroup: (state) => (lesson_group_pk) => {
    if (state.groups != null) {
      for (let i = 0; i < state.groups.length; i++) {
        if (state.groups[i].pk == lesson_group_pk) {
          return state.groups[i].plans;
        }
      }
    }
    return [];
  },
  getAvailableSchedules(state) {
    return state.availableSchedules;
  },
  getGroupReplaceList(state) {
    return state.groupReplaceList;
  },
  getDayOffList(state) {
    return state.day_off_list;
  },
  getGroupTimeTransferList(state) {
    return state.group_time_transfer_list;
  },
  getStudentsABSList(state) {
    return state.studentsABSList;
  },
  getStudentsABSMonthList(state) {
    return state.studentsABSMonthList;
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
  [SET_STUDENT_PLAN](context, credentials) {
    return new Promise((resolve, reject) => {
      ApiService.setHeader();
      ApiService.post("group/lesson/set/plan/student/", credentials)
        .then(response => {
          var data = {
            student_pk: credentials.student,
            plans: response.data
          };
          // mutation in user.module.js
          context.commit(SET_STUDENT_PLAN_MUTATION, data);
          resolve(response);
        })
        .catch(({ response }) => {
          context.commit(SET_ERROR, response.data.message);
          reject(response);
        })
    });
  },
  [EDIT_STUDENT_PLAN](context, credentials) {
    return new Promise((resolve, reject) => {
      ApiService.setHeader();
      ApiService.update("group/lesson/edit/plan/student/", credentials.pk, credentials)
        .then(response => {
          var data = {
            student_pk: credentials.student,
            student_plan_pk: credentials.pk,
            new_plan: response.data
          };
          // mutation in user.module.js
          context.commit(EDIT_STUDENT_PLAN_MUTATION, data);
          resolve(response);
        })
        .catch(({ response }) => {
          context.commit(SET_ERROR, response.data.message);
          reject(response);
        });
    });
  },
  [SYNC_STUDENT_PLAN_ACTION_BY_STUDENT_ID](context, credentials) {
    return new Promise((resolve, reject) => {
      ApiService.setHeader();
      ApiService.get("group/lesson/plan/", credentials.student_user_pk)
        .then(response => {
          var data = {
            student_pk: credentials.student_user_pk,
            plans: response.data
          };
          context.commit(SET_STUDENT_PLAN_MUTATION, data);
          resolve(response);
        })
        .catch(({ response }) => {
          context.commit(SET_ERROR, response.data.message);
          reject(response);
        })
    });
  },
  [GET_OFFICE_LIST](context) {
    return new Promise((resolve, reject) => {
      ApiService.setHeader();
      ApiService.get("group/lesson/office/list/")
        .then(response => {
          context.commit(SET_OFFICE_LIST_MUTATION, response.data);
          resolve(response);
        })
        .catch(({ response }) => {
          context.commit(SET_ERROR, response.data.message);
          reject(response);
        });
    });
  },
  [SET_OFFICE](context, credentials) {
    return new Promise((resolve, reject) => {
      ApiService.setHeader();
      ApiService.post('group/lesson/office/', credentials)
        .then(response => {
          context.commit(SET_OFFICE_MUTATION, response.data.office);
          context.commit(SET_SUCCESS, response.data.message);
          resolve(response);
        })
        .catch(({ response }) => {
          context.commit(SET_ERROR, response.data.message);
          reject(response);
        })
    });
  },
  [GET_SCHEDULE_LIST](context) {
    return new Promise((resolve, reject) => {
      ApiService.setHeader();
      ApiService.get('group/lesson/schedule/list/')
        .then(response => {
          context.commit(SET_SCHEDULE_LIST_MUTATION, response.data);
          resolve(response);
        })
        .catch(({ response }) => {
          context.commit(SET_ERROR, response.data);
          reject(response);
        });
    });
  },
  [CREATE_GROUP](context, credentials) {
    return new Promise((resolve, reject) => {
      ApiService.setHeader();
      ApiService.post('group/lesson/group/create/', credentials)
        .then(response => {
          context.commit(SET_GROUP_MUTATION, response.data.group);
          context.commit(SET_SUCCESS, response.data.message);
          resolve(response)
        })
        .catch(({ response }) => {
          context.commit(SET_ERROR, response.data);
          reject(response);
        });
    });
  },
  [EDIT_GROUP](context, credentials) {
    return new Promise((resolve, reject) => {
      ApiService.setHeader();
      ApiService.put(`group/lesson/group/edit/${credentials.pk}/`, credentials)
        .then(response => {
          context.commit(EDIT_GROUP_MUTATION, response.data.group);
          context.commit(SET_SUCCESS, response.data.message);
          resolve(response);
        })
        .catch(({ response }) => {
          context.commit(SET_ERROR, response.data);
          reject(response);
        });
    });
  },
  [DELETE_GROUP](context, lesson_group_id) {
    return new Promise((resolve, reject) => {
      ApiService.setHeader();
      ApiService.delete(`group/lesson/group/delete/${lesson_group_id}/`)
        .then(response => {
          context.commit(DELETE_GROUP_MUTATION, lesson_group_id);
          context.commit(SET_SUCCESS, response.data.message);
          resolve(response);
        })
        .catch(({ response }) => {
          context.commit(SET_ERROR, response.data);
          reject(response);
        })
    });
  },
  //depreciated
  [GET_GROUP_LIST](context) {
    return new Promise((resolve, reject) => {
      ApiService.setHeader();
      ApiService.get('group/lesson/group/list/')
        .then(response => {
          context.commit(SET_GROUP_LIST_MUTATION, response.data);
          resolve(response);
        })
        .catch(({ response }) => {
          context.commit(SET_ERROR, response.data);
          reject(response);
        });
    });
  },
  [GET_GROUP_LIST_OFFSET](context, credentials) {
    return new Promise((resolve, reject) => {
      ApiService.setHeader();
      ApiService.get(`group/lesson/group/list/${credentials.start}/${credentials.limit}/`)
        .then(response => {
          var data = {
            groups: response.data.groups,
            start: credentials.start
          };
          context.commit(SET_GROUP_LIST_OFFSET, data);
          resolve(response);
        })
        .catch(({ response }) => {
          context.commit(SET_ERROR, response.data);
          reject(response);
        });
    });
  },
  [CHECK_GROUPS_LIST]({commit, getters}) {
    var groups_pk = [];
    getters.getGroups.forEach(elem => {
      groups_pk.push(elem.pk);
    });
    return new Promise((resolve, reject) => {
      ApiService.setHeader();
      ApiService.post('group/lesson/update/group/list/', groups_pk)
        .then(response => {
          commit(CHECK_GROUPS_LIST_MUTATION, response.data);
          resolve(response);
        })
        .catch(({ response }) => {
          commit(SET_ERROR, response.data);
          reject(response);
        })
    });
  },
  [SET_STUDENT_PLAN_TO_GROUP](context, credentials) {
    return new Promise((resolve, reject) => {
      ApiService.setHeader();
      ApiService.post('group/lesson/add/plan/', credentials)
        .then(response => {
          context.commit(SET_SUCCESS, response.data.message);
          context.commit(SET_STUDENT_PLAN_TO_GROUP_MUTATION, response.data.group_student_plan);
          resolve(response);
        })
        .catch(({ response }) => {
          context.commit(SET_ERROR, response.data);
          reject(response);
        })
    });
  },
  [EDIT_STUDENT_PLAN_TO_GROUP](context, credentials) {
    return new Promise((resolve, reject) => {
      ApiService.setHeader();
      ApiService.put(`group/lesson/edit/plan/group/${credentials.pk}/`, credentials)
        .then(response => {
          context.commit(SET_SUCCESS, response.data.message);
          context.commit(EDIT_STUDENT_PLAN_TO_GROUP_MUTATION, response.data.group_student_plan);
          resolve(response);
        })
        .catch(({ response }) => {
          context.commit(SET_ERROR, response.data);
          reject(response);
        });
    });
  },
  [REMOVE_STUDENT_PLAN_FROM_GROUP](context, credentials) {
    return new Promise((resolve, reject) => {
      ApiService.setHeader();
      ApiService.delete(`group/lesson/remove/plan/group/${credentials.group_student}/`)
        .then(response => {
          context.commit(SET_SUCCESS, response.data.message);
          context.commit(REMOVE_STUDENT_PLAN_FROM_GROUP_MUTATION, credentials);
          resolve(response);
        })
        .catch(({ response }) => {
          context.commit(SET_ERROR, response.data);
          reject(response);
        });
    });
  },
  [GET_STUDENT_PLANS_BY_GROUP](context, lesson_group_id) {
    return new Promise((resolve, reject) => {
      ApiService.setHeader();
      ApiService.get('group/lesson/plan/list/', lesson_group_id)
        .then(response => {
          var data = {
            plans: response.data,
            lesson_group_id: lesson_group_id
          };
          context.commit(GET_STUDENT_PLANS_BY_GROUP_MUTATION, data);
          resolve(response);
        })
        .catch(({ response }) => {
          context.commit(SET_ERROR, response.data);
          reject(response);
        });
    })
  },
  [GET_AVAILABLE_SCHEDULES](context) {
    return new Promise((resolve, reject) => {
      ApiService.setHeader();
      ApiService.get('group/lesson/schedule/list/available/')
        .then(response => {
          context.commit(SET_AVAILABLE_SCHEDULES, response.data);
          resolve(response);
        })
        .catch(({ response }) => {
          context.commit(SET_ERROR, response.data);
          reject(response);
        });
    });
  },
  [GET_GROUP_REPLACE_LIST](context, group_id) {
    return new Promise((resolve, reject) => {
      ApiService.setHeader();
      ApiService.get('group/lesson/replace/list/', group_id)
        .then(response => {
          context.commit(SET_GROUP_REPLACE_LIST, response.data);
          resolve(response);
        })
        .catch(({ response }) => {
          context.commit(SET_ERROR, response.data);
          reject(response);
        });
    });
  },
  [SET_GROUP_REPLACEMENT](context, credentials) {
    return new Promise((resolve, reject) => {
      ApiService.setHeader();
      ApiService.post('group/lesson/replace/', credentials)
        .then(response => {
            
            context.commit(SET_GROUP_REPLACEMENT_MUTATION, response.data.group_replacement)
            resolve(response);
        })
        .catch(({ response }) => {
          context.commit(SET_ERROR, response.data);
          reject(response);
        })
    });
  },
  [EDIT_GROUP_REPLACEMENT](context, credentials) {
    return new Promise((resolve, reject) => {
      ApiService.setHeader();
      ApiService.put('group/lesson/replace/', credentials)
        .then(response => {
          context.commit(SET_SUCCESS, response.data.message)
          context.commit(EDIT_GROUP_REPLACEMENT_MUTATION, response.data.group_replacement);
          resolve(response);
        })
        .catch(({ response }) => {
          context.commit(SET_ERROR, response.data);
          reject(response);
        });
    })
  },
  [DELETE_GROUP_REPLACEMENT](context, group_replacement_pk) {
    return new Promise((resolve, reject) => {
      ApiService.setHeader();
      ApiService.delete(`group/lesson/replace/${group_replacement_pk}/`)
        .then(response => {
          context.commit(SET_SUCCESS, response.data.message);
          context.commit(DELETE_GROUP_REPLACEMENT_MUTATION, group_replacement_pk);
          resolve(response);
        })
        .catch(({ response }) => {
          context.commit(SET_ERROR, response.data);
          reject(response);
        })
    });
  },
  [GET_DAY_OFF_LIST](context) {
    return new Promise((resolve, reject) => {
      ApiService.setHeader();
      ApiService.get('group/lesson/dayoff/list/')
        .then(response => {
          context.commit(SET_DAY_OFF_LIST, response.data);
          resolve(response);
        })
        .catch(({ response }) => {
          context.commit(SET_ERROR, response.data);
          reject(response);
        })
    });
  },
  [ADD_DAY_OFF_LIST](context, credentials) {
    return new Promise((resolve, reject) => {
      ApiService.setHeader();
      ApiService.post('group/lesson/dayoff/set/', credentials)
        .then(response => {
          context.commit(APPEND_DAY_OFF_LIST, response.data.day_off_list)
          context.commit(SET_SUCCESS, response.data.message);
          resolve(response);
        })
        .catch(({ response }) => {
          context.commit(SET_ERROR, response.data);
          reject(response);
        })
    });
  },
  [EDIT_DAY_OFF](context, credentials) {
    return new Promise((resolve, reject) => {
      ApiService.setHeader();
      ApiService.put(`group/lesson/dayoff/edit/${credentials.pk}/`, credentials)
        .then(response => {
          context.commit(EDIT_DAY_OFF_MUTATION, response.data.day_off);
          context.commit(SET_SUCCESS, response.data.message);
          resolve(response);
        })
        .catch(({ response }) => {
          context.commit(SET_ERROR, response.data);
          reject(response);
        });
    });
  },
  [DELETE_DAY_OFF](context, day_off_pk) {
    return new Promise((resolve, reject) => {
      ApiService.setHeader();
      ApiService.delete(`group/lesson/dayoff/delete/${day_off_pk}/`)
        .then(response => {
          context.commit(DELETE_DAY_OFF_MUTATION, day_off_pk);
          context.commit(SET_SUCCESS, response.data.message);
          resolve(response);
        })
        .catch(({ response }) => {
          context.commit(SET_ERROR, response.data);
          reject(response);
        })
    });
  },
  [GET_GROUP_TIME_TRANSFER](context, lesson_group_id) {
    return new Promise((resolve, reject) => {
      ApiService.setHeader();
      ApiService.get('group/lesson/group/time/transfer/list/', lesson_group_id)
        .then(response => {
          context.commit(SET_GROUP_TIME_TRANSFER, response.data);
          resolve(response);
        })
        .catch(({ response }) => {
          context.commit(SET_ERROR, response.data);
          reject(response);
        });
    });
  },
  [ADD_GROUP_TIME_TRANSFER](context, credentials) {
    return new Promise((resolve, reject) => {
      ApiService.setHeader();
      ApiService.post('group/lesson/group/time/transfer/set/', credentials)
        .then(response => {
          context.commit(APPEND_GROUP_TIME_TRANSFER, response.data.group_time_transfer);
          context.commit(SET_SUCCESS, response.data.message);
          resolve(response);
        })
        .catch(({ response }) => {
          context.commit(SET_ERROR, response.data);
          reject(response);
        });
    });
  },
  [DELETE_GROUP_TIME_TRANSFER](context, group_time_transfer_id) {
    return new Promise((resolve, reject) => {
      ApiService.setHeader();
      ApiService.delete(`group/lesson/group/time/transfer/delete/${group_time_transfer_id}/`)
        .then(response => {
          context.commit(SET_SUCCESS, response.data.message);
          context.commit(DELETE_GROUP_TIME_TRANSFER_MUTATION, group_time_transfer_id);
          resolve(response);
        })
        .catch(({ response }) => {
          context.commit(SET_ERROR, response.data);
          reject(response);
        });
    });
  },
  [GET_STUDENTS_ABS_LIST](context, credentials) {
    return new Promise((resolve, reject) => {
      ApiService.setHeader();
      ApiService.get(`lesson/progress/students/abs/list/${credentials.lesson_group_pk}/${credentials.date}/`)
        .then(response => {
          context.commit(SET_STUDENTS_ABS_LIST, response.data);
          resolve(response);
        })
        .catch(({ response }) => {
          context.commit(SET_ERROR, response.data);
          reject(response);
        });
    });
  },
  [GET_STUDENT_ABS_MONTH_LIST](context, lesson_group_pk) {
    return new Promise((resolve, reject) => {
      ApiService.setHeader();
      ApiService.get('lesson/progress/students/abs/month/list/', lesson_group_pk)
        .then(response => {
          context.commit(SET_STUDENT_ABS_MONTH_LIST, response.data);
          resolve(response);
        })
        .catch(({ response }) => {
          context.commit(SET_ERROR, response.data);
          reject(response);
        });
    });
  },
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
  [SET_OFFICE_LIST_MUTATION](state, office_list) {
    state.offices = office_list;
  },
  [SET_OFFICE_MUTATION](state, office) {
    state.offices.push(office);
  },
  [SET_SCHEDULE_LIST_MUTATION](state, schedule_list) {
    state.schedules = schedule_list;
  },
  //depreciated
  [SET_GROUP_LIST_MUTATION](state, group_list) {
    state.groups = group_list;
  },
  [SET_GROUP_LIST_OFFSET](state, data) {
    if (data.start == 0) {
      state.groups = [];
    }
    state.groups = state.groups.concat(data.groups);
  },
  [CHECK_GROUPS_LIST_MUTATION](state, data) {
    state.groups = state.groups.concat(data);
  },
  [SET_GROUP_MUTATION](state, group) {
    state.groups.push(group);
  },
  [EDIT_GROUP_MUTATION](state, group) {
    for (let i = 0; i < state.groups.length; i++) {
      if (state.groups[i].pk == group.pk) {
        state.groups[i] = group;
        break;
      }
    }
  },
  [DELETE_GROUP_MUTATION](state, lesson_group_id) {
    var tmp = [];
    state.groups.forEach(elem => {
      if (elem.pk != lesson_group_id) {
        tmp.push(elem);
      }
    });
    state.groups = tmp;
  },
  [SET_STUDENT_PLAN_TO_GROUP_MUTATION](state, data) {
    for (let i = 0; i < state.groups.length; i++) {
      if (state.groups[i].pk == data.lesson_group) {
        state.groups[i].plans.push(data);
        console.log('set', data);
        break;
      }
    }
  },
  [EDIT_STUDENT_PLAN_TO_GROUP_MUTATION](state, data) {
    for (let i = 0; i < state.groups.length; i++) {
      if (state.groups[i].pk == data.lesson_group) {
        for (let j = 0; j < state.groups[i].plans.length; j++) {
          if (state.groups[i].plans[j].pk == data.pk) {
            state.groups[i].plans[j] = data;
            console.log('edit', data);
            break;
          }
        }
      }
    }
  },
  [REMOVE_STUDENT_PLAN_FROM_GROUP_MUTATION](state, data) {
    for (let i = 0; i < state.groups.length; i++) {
      if (state.groups[i].pk == data.lesson_group) {
        var tmp_plans = [];
        for (let j = 0; j < state.groups[i].plans.length; j++) {
          if (state.groups[i].plans[j].pk != data.group_student) {
            tmp_plans.push(state.groups[i].plans[j]);
          }
        }
        state.groups[i].plans = tmp_plans;
        break;
      }
    }
  },
  [GET_STUDENT_PLANS_BY_GROUP_MUTATION](state, data) {
    for (let i = 0; i < state.groups.length; i++) {
      if (state.groups[i].pk == data.lesson_gorup_id) {
        state.groups[i].plans = data.plans;
        break;
      }
    }
  },
  [SET_AVAILABLE_SCHEDULES](state, data) {
    state.availableSchedules = data;
  },
  [SET_GROUP_REPLACE_LIST](state, data) {
    state.groupReplaceList = data;
  },
  [SET_GROUP_REPLACEMENT_MUTATION](state, data) {
    state.groupReplaceList = state.groupReplaceList.concat(data);
  },
  [EDIT_GROUP_REPLACEMENT_MUTATION](state, data) {
    for (let i = 0; i<state.groupReplaceList.length; i++) {
      if (state.groupReplaceList[i].pk == data.pk) {
        state.groupReplaceList[i] = data;
        break;
      }
    }
  },
  [DELETE_GROUP_REPLACEMENT_MUTATION](state, group_replacement_pk) {
    var tmp = state.groupReplaceList.filter(i => {
      return i.pk != group_replacement_pk;
    });
    state.groupReplaceList = tmp;
  },
  [SET_DAY_OFF_LIST](state, day_off_list) {
    state.day_off_list = day_off_list;
  },
  [APPEND_DAY_OFF_LIST](state, day_off_list) {
    state.day_off_list = state.day_off_list.concat(day_off_list);
  },
  [EDIT_DAY_OFF_MUTATION](state, day_off) {
    for (let i = 0; i < state.day_off_list.length; i++) {
      if (state.day_off_list[i].pk == day_off.pk) {
        state.day_off_list[i] = day_off;
      }
    }
  },
  [DELETE_DAY_OFF_MUTATION](state, day_off_pk) {
    var tmp = [];
    state.day_off_list.forEach(elem => {
      if (elem.pk != day_off_pk) {
        tmp.push(elem);
      }
    });
    state.day_off_list = tmp;
  },
  [SET_GROUP_TIME_TRANSFER](state, data) {
    state.group_time_transfer_list = data;
  },
  [APPEND_GROUP_TIME_TRANSFER](state, data) {
    state.group_time_transfer_list.push(data);
  },
  [DELETE_GROUP_TIME_TRANSFER_MUTATION](state, group_time_transfer_id) {
    var tmp = [];
    state.group_time_transfer_list.forEach(elem => {
      if (elem.pk != group_time_transfer_id) {
        tmp.push(elem);
      }
    });
    state.group_time_transfer_list = tmp;
  },
  [SET_STUDENTS_ABS_LIST](state, data) {
    state.studentsABSList = data;
  },
  [SET_STUDENT_ABS_MONTH_LIST](state, data) {
    state.studentsABSMonthList = data;
  },
};

export default {
  state,
  actions,
  mutations,
  getters
};
