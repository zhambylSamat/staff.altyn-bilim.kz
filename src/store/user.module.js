import ApiService from "@/common/api.service.js";
import {
  CREATE_STUDENT,
  UPDATE_STUDENT,
  SET_DEFAULT_ACTION,
  GET_STUDENT_LIST, // deprecitated
  GET_STUDENT_OFFSET_LIST,
  OPTION_STUDENT_LIST,
  REMOVE_ERRORS_ACTION,
  GET_STUDENT_PLAN,
  RESET_STUDENT_PASSWORD,
  REMOVE_WARNINGS_ACTION,
  REMOVE_SUCCESS_ACTION,
  SET_STUDENT_PAYMENT_STATUS_ACTION,
  SET_STUDENT_CONTRACT_STATUS_ACTION,
  CREATE_TEACHER,
  UPDATE_TEACHER,
  GET_TEACHER_LIST,
  RESET_TEACHER_PASSWORD,
  CREATE_STAFF,
  UPDATE_STAFF,
  GET_STAFF_LIST,
  RESET_STAFF_PASSWORD,
  CHECK_STUDENTS_LIST,
  GET_STUDENT_FREEZE_LIST,
  CREATE_STUDENT_FREEZE,
  EDIT_STUDENT_FREEZE,
  DELETE_STUDENT_FREEZE,
  GET_STUDENT_GROUP_FREEZE_LIST,
  CREATE_STUDENT_GROUP_FREEZE,
  DELETE_STUDENT_GROUP_FREEZE,
} from "./actions.type.js";
import {
  // CREATE_STUDENT_MUTATION,
  SET_DEFAULT_MUTATION,
  SET_ERROR,
  SET_WARNING,
  SET_SUCCESS,
  SET_STUDENT_LIST, // depreciated
  SET_STUDENT_OFFSET_LIST,
  // UPDATE_STUDENT_MUTATION,
  REMOVE_ERRORS_MUTATION,
  ADD_STUDENT_PLAN,
  ADD_STUDENT_MUTATION,
  REMOVE_WARNINGS_MUTATION,
  REMOVE_SUCCESS_MUTATION,
  UPDATE_STUDENT_IS_PASSWORD_RESET_MUTATION,
  UPDATE_STUDENT_HAS_PAYMENT_MUTATION,
  UPDATE_STUDENT_HAS_CONTRACT_MUTATION,
  SET_STUDENT_PLAN_MUTATION,
  EDIT_STUDENT_PLAN_MUTATION,
  ADD_TEACHER_MUTATION,
  UPDATE_TEACHER_MUTATION,
  SET_TEACHER_LIST,
  UPDATE_TEACHER_IS_PASSWORD_RESET_MUTATION,
  ADD_STAFF_MUTATION,
  UPDATE_STAFF_MUTATION,
  SET_STAFF_LIST,
  UPDATE_STAFF_IS_PASSWORD_RESET_MUTATION,
  CHECK_STUDENTS_LIST_MUTATION,
  SET_STUDENT_FREEZE_LIST,
  ADD_STUDENT_FREEZE,
  EDIT_STUDENT_FREEZE_MUTATION,
  DELETE_STUDENT_FREEZE_MUTATION,
  SET_STUDENT_GROUP_FREEZE_LIST,
  ADD_STUDENT_GROUP_FREEZE,
  DELETE_STUDENT_GROUP_FREEZE_MUTATION,
} from  "./mutations.type.js";

const defaultState = () => {
  return {
    errors: {},
    warnings: [],
    success: [],
    students: null,
    teachers: [],
    staffs: [],
    studentFreezeList: null,
    studentGroupFreezeList: null,
  }
}

const state = defaultState();

const getters = {
  getStudents(state) {
    return state.students;
  },
  getStudentByUserPk: (state) => (user_pk) => {
    if (state.students != null) {
      for (let index = 0; index < state.students.length; index++) {
        if (state.students[index].user.pk == user_pk) {
          return state.students[index];
        }
      }
    }
    return [];
  },
  getStudentPlansByUserPk: (state) => (user_pk) => {
    if (state.students != null) {
      for (let index = 0; index < state.students.length; index++) {
        if (state.students[index].user.pk == user_pk) {
          if (state.students[index].student.plan != undefined){
            return state.students[index].student.plan;
          }
        }
      }
    }
    return [];
  },
  getStudentPlanByUserPkAndPlanPk: (state, getters) => (user_pk, plan_pk) => {
    var plans = getters.getStudentPlansByUserPk(user_pk);
    for (let index = 0; index < plans.length; index++) {
      if (plans[index].pk == plan_pk) {
        return plans[index];
      }
    }
    return [];
  },
  getTeachers(state) {
    return state.teachers;
  },
  getStaffs(state) {
    return state.staffs;
  },
  getCurrentStudentFreeze(state) {
    return state.studentFreezeList;
  },
  getCurrentStudentGroupFreeze(state) {
    return state.studentGroupFreezeList;
  }
};

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
  [CREATE_STUDENT](context, credentials) {
    return new Promise((resolve, reject) => {
      ApiService.setHeader();
      ApiService.post("user/student/", credentials)
        .then(response => {
          context.commit(ADD_STUDENT_MUTATION, response.data);
          resolve(response);
        })
        .catch(({ response }) => {
          context.commit(SET_ERROR, response.data.message);
          reject(response);
        });
    });
  },
  [UPDATE_STUDENT](context, credentials) {
    return new Promise((resolve, reject) => {
      ApiService.setHeader();
      ApiService.update('user/student/edit/', credentials.user.pk, credentials)
        .then(response => {
          resolve(response);
        })
        .catch(({ response }) => {
          context.commit(SET_ERROR, response.data);
          reject(response);
        })
    })
  },
  // depreciated 
  [GET_STUDENT_LIST](context) {
    return new Promise((resolve, reject) => {
      ApiService.setHeader();
      ApiService.get("user/student/list/")
        .then(response => {
          context.commit(SET_STUDENT_LIST, response.data);
          resolve(response);
        })
        .catch(({ response }) => {
          context.commit(SET_ERROR, response.data);
          reject(response);
        });
    });
  },
  [GET_STUDENT_OFFSET_LIST](context, credentials) {
    return new Promise((resolve, reject) => {
      ApiService.setHeader();
      ApiService.get(`user/student/list/${credentials.start}/${credentials.limit}/`)
        .then(response => {
          var data = {
            students: response.data.students,
            start: credentials.start
          };
          context.commit(SET_STUDENT_OFFSET_LIST, data);
          resolve(response);
        })
        .catch(({ response }) => {
          context.commit(SET_ERROR, response.data);
          reject(response);
        });
    });
  },
  [CHECK_STUDENTS_LIST]({commit, getters}) {
    var students_pk = [];
    getters.getStudents.forEach(elem => {
      students_pk.push(elem.user.pk);
    });
    return new Promise((resolve, reject) => {
      ApiService.setHeader();
      ApiService.post('user/update/student/list/', students_pk)
        .then(response => {
          commit(CHECK_STUDENTS_LIST_MUTATION, response.data);
          resolve(response);
        })
        .catch(({ response }) => {
          commit(SET_ERROR, response.data);
          reject(response);
        })
    });
  },
  [OPTION_STUDENT_LIST]() {
    return new Promise((resolve, reject) => {
      ApiService.setHeader();
      ApiService.get("user/student/list/")
        .then(response => {
          resolve(response);
        })
        .catch(({ response }) => {
          reject(response);
        });
    });
  },
  [GET_STUDENT_PLAN](context, student_pk) {
    return new Promise((resolve, reject) => {
      ApiService.setHeader();
      ApiService.get('group/lesson/plan/', student_pk)
        .then(response => {
          var data = {
            plan: response.data,
            student_pk: student_pk
          }
          context.commit(ADD_STUDENT_PLAN, data);
          resolve(response);
        })
        .catch(error => {
          context.commit(SET_ERROR, error);
          reject(error);
        });
    });
  },
  [RESET_STUDENT_PASSWORD](context, student_pk) {
    return new Promise((resolve, reject) => {
      ApiService.setHeader();
      ApiService.get('user/reset/password/student/', student_pk)
        .then(response => {
          if (response.status == 208) {
            context.commit(SET_WARNING, response.data);
          } else {
            var data = {
              is_password_reset: response.data.is_password_reset,
              student_pk: student_pk
            };
            context.commit(UPDATE_STUDENT_IS_PASSWORD_RESET_MUTATION, data)
            context.commit(SET_SUCCESS, response.data.message);
          }
          resolve(response);
        })
        .catch(error => {
          context.commit(SET_ERROR, error);
          reject(error);
        })
    });
  },
  [SET_STUDENT_PAYMENT_STATUS_ACTION](context, credentials) {
    return new Promise((resolve, reject) => {
      ApiService.setHeader();
      ApiService.get('user/payment/', `${credentials.student_pk}/${credentials.has_payment}`)
        .then(response => {
          var data = {
            student_pk: credentials.student_pk,
            has_payment: response.data.has_payment 
          };
          context.commit(UPDATE_STUDENT_HAS_PAYMENT_MUTATION, data)
          context.commit(SET_SUCCESS, response.data.message);
          resolve(response);
        })
        .catch(error => {
          context.commit(SET_ERROR, error);
          reject(error);
        });
    });
  },
  [SET_STUDENT_CONTRACT_STATUS_ACTION](context, credentials) {
    return new Promise((resolve, reject) => {
      ApiService.setHeader();
      ApiService.get('user/contract/', `${credentials.student_pk}/${credentials.has_contract}`)
        .then(response => {
          var data = {
            student_pk: credentials.student_pk,
            has_contract: response.data.has_contract
          };
          context.commit(UPDATE_STUDENT_HAS_CONTRACT_MUTATION, data)
          context.commit(SET_SUCCESS, response.data.message);
          resolve(response);
        })
        .catch(error => {
          context.commit(SET_ERROR, error);
          reject(error);
        })
    })
  },
  [CREATE_TEACHER](context, credentials) {
    return new Promise((resolve, reject) => {
      ApiService.setHeader();
      ApiService.post("user/staff/", credentials)
        .then(response => {
          context.commit(ADD_TEACHER_MUTATION, response.data);
          resolve(response);
        })
        .catch(({ response }) => {
          context.commit(SET_ERROR, response.data.message);
          reject(response);
        });
    });
  },
  [UPDATE_TEACHER](context, credentials) {
    return new Promise((resolve, reject) => {
      ApiService.setHeader();
      ApiService.update('user/staff/edit/', credentials.user.pk, credentials)
        .then(response => {
          var data = {
            teacher_pk: credentials.user.pk,
            data: response.data
          };
          context.commit(UPDATE_TEACHER_MUTATION, data);
          resolve(response);
        })
        .catch(({ response }) => {
          context.commit(SET_ERROR, response.data);
          reject(response);
        })
    })
  },
  [GET_TEACHER_LIST](context) {
    return new Promise((resolve, reject) => {
      ApiService.setHeader();
      ApiService.get("user/teacher/list/")
        .then(response => {
          context.commit(SET_TEACHER_LIST, response.data);
          resolve(response);
        })
        .catch(({ response }) => {
          context.commit(SET_ERROR, response.data);
          reject(response);
        });
    });
  },
  [RESET_TEACHER_PASSWORD](context, teacher_user_pk) {
    return new Promise((resolve, reject) => {
      ApiService.setHeader();
      ApiService.get('user/reset/password/staff/', teacher_user_pk)
        .then(response => {
          if (response.status == 208) {
            context.commit(SET_WARNING, response.data);
          } else {
            var data = {
              is_password_reset: response.data.is_password_reset,
              teacher_pk: teacher_user_pk
            };
            context.commit(UPDATE_TEACHER_IS_PASSWORD_RESET_MUTATION, data)
            context.commit(SET_SUCCESS, response.data.message);
          }
          resolve(response);
        })
        .catch(error => {
          context.commit(SET_ERROR, error);
          reject(error);
        })
    });
  },
  [CREATE_STAFF](context, credentials) {
    return new Promise((resolve, reject) => {
      ApiService.setHeader();
      ApiService.post("user/staff/", credentials)
        .then(response => {
          context.commit(ADD_STAFF_MUTATION, response.data);
          resolve(response);
        })
        .catch(({ response }) => {
          context.commit(SET_ERROR, response.data.message);
          reject(response);
        });
    });
  },
  [UPDATE_STAFF](context, credentials) {
    return new Promise((resolve, reject) => {
      ApiService.setHeader();
      ApiService.update('user/staff/edit/', credentials.user.pk, credentials)
        .then(response => {
          var data = {
            staff_pk: credentials.user.pk,
            data: response.data
          };
          context.commit(UPDATE_STAFF_MUTATION, data);
          resolve(response);
        })
        .catch(({ response }) => {
          context.commit(SET_ERROR, response.data);
          reject(response);
        })
    })
  },
  [GET_STAFF_LIST](context) {
    return new Promise((resolve, reject) => {
      ApiService.setHeader();
      ApiService.get("user/staff/list/")
        .then(response => {
          context.commit(SET_STAFF_LIST, response.data);
          resolve(response);
        })
        .catch(({ response }) => {
          context.commit(SET_ERROR, response.data);
          reject(response);
        });
    });
  },
  [RESET_STAFF_PASSWORD](context, staff_user_pk) {
    return new Promise((resolve, reject) => {
      ApiService.setHeader();
      ApiService.get('user/reset/password/staff/', staff_user_pk)
        .then(response => {
          if (response.status == 208) {
            context.commit(SET_WARNING, response.data);
          } else {
            var data = {
              is_password_reset: response.data.is_password_reset,
              staff_pk: staff_user_pk
            };
            context.commit(UPDATE_STAFF_IS_PASSWORD_RESET_MUTATION, data)
            context.commit(SET_SUCCESS, response.data.message);
          }
          resolve(response);
        })
        .catch(({ response }) => {
          context.commit(SET_ERROR, response.data.message);
          reject(response);
        });
    });
  },
  [GET_STUDENT_FREEZE_LIST](context, student_user_id) {
    return new Promise((resolve, reject) => {
      ApiService.setHeader();
      ApiService.get(`user/student/freeze/get/${student_user_id}/`)
        .then(response => {
          context.commit(SET_STUDENT_FREEZE_LIST, response.data);
          resolve(response);
        })
        .catch(({ response }) => {
          context.commit(SET_ERROR, response.data);
          reject(response);
        });
    });
  },
  [CREATE_STUDENT_FREEZE](context, credentials) {
    return new Promise((resolve, reject) => {
      ApiService.setHeader();
      ApiService.post('user/student/freeze/set/', credentials)
        .then(response => {
          context.commit(ADD_STUDENT_FREEZE, response.data.student_freeze);
          context.commit(SET_SUCCESS, response.data.message);
          resolve(response);
        })
        .catch(({ response }) => {
          context.commit(SET_ERROR, response.data);
          reject(response);
        });
    });
  },
  [EDIT_STUDENT_FREEZE](context, credentials) {
    return new Promise((resolve, reject) => {
      ApiService.setHeader();
      ApiService.put(`user/student/freeze/edit/${credentials.pk}/`, credentials)
        .then(response => {
          context.commit(EDIT_STUDENT_FREEZE_MUTATION, response.data.student_freeze);
          context.commit(SET_SUCCESS, response.data.message);
          resolve(response);
        })
        .catch(({ response }) => {
          context.commit(SET_ERROR, response.data);
          reject(response);
        });
    });
  },
  [DELETE_STUDENT_FREEZE](context, student_freeze_id) {
    return new Promise((resolve, reject) => {
      ApiService.setHeader();
      ApiService.delete(`user/student/freeze/delete/${student_freeze_id}/`)
        .then(response => {
          context.commit(DELETE_STUDENT_FREEZE_MUTATION, student_freeze_id);
          context.commit(SET_SUCCESS, response.data.message);
          resolve(response);
        })
        .catch(({ response })=> {
          context.commit(SET_ERROR, response.data);
          reject(response);
        });
    });
  },
  [GET_STUDENT_GROUP_FREEZE_LIST](context, lesson_group_student_id) {
    return new Promise((resolve, reject) => {
      ApiService.setHeader();
      ApiService.get(`user/student/group/freeze/list/${lesson_group_student_id}/`)
        .then(response => {
          context.commit(SET_STUDENT_GROUP_FREEZE_LIST, response.data);
          resolve(response);
        })
        .catch(({ response }) => {
          context.commit(SET_ERROR, response.data);
          reject(response);
        });
    });
  },
  [CREATE_STUDENT_GROUP_FREEZE](context, credentials) {
    return new Promise((resolve, reject) => {
      ApiService.setHeader();
      ApiService.post('user/student/group/freeze/create/', credentials)
        .then(response => {
          context.commit(ADD_STUDENT_GROUP_FREEZE, response.data.student_group_freeze);
          context.commit(SET_SUCCESS, response.data.message);
          resolve(response);
        })
        .catch(({ response }) => {
          context.commit(SET_ERROR, response.data);
          reject(response);
        });
    })
  },
  [DELETE_STUDENT_GROUP_FREEZE](context, student_group_freeze_id) {
    return new Promise((resolve, reject) => {
      ApiService.setHeader();
      ApiService.delete(`user/student/group/freeze/delete/${student_group_freeze_id}/`)
        .then(response => {
          context.commit(DELETE_STUDENT_GROUP_FREEZE_MUTATION, student_group_freeze_id);
          context.commit(SET_SUCCESS, response.data.message);
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
  [ADD_STUDENT_MUTATION](state, student) {
    state.students.push(student);
  },
  //depreciated
  [SET_STUDENT_LIST](state, students) {
    state.students = students;
  },
  [SET_STUDENT_OFFSET_LIST](state, data) {
    if (data.start == 0) {
      state.students = [];
    }
    state.students = state.students.concat(data.students);
  },
  [CHECK_STUDENTS_LIST_MUTATION](state, students) {
    state.students = state.students.concat(students);
  },
  // [UPDATE_STUDENT_MUTATION](state, data) {
    // console.log(data);
  // },
  [ADD_STUDENT_PLAN](state, data) {
    for (let index = 0; index<state.students.length; index++) {
      if (state.students[index].user.pk == data.student_pk) {
        state.students[index].user.pk = 0;
        state.students[index].student.plan = data.plan;
        state.students[index].user.pk = data.student_pk;
        break;
      }
    }
  },
  [EDIT_STUDENT_PLAN_MUTATION](state, data) {
    for (let i = 0; i < state.students.length; i++) {
      if (state.students[i].user.pk == data.student_pk) {
        for (let j = 0; j < state.students[i].student.plan.length; j++) {
          if (state.students[i].student.plan[j].pk == data.student_plan_pk) {
            state.students[i].user.pk = 0;
            state.students[i].student.plan[j] = data.new_plan;
            state.students[i].user.pk = data.student_pk;
          }
        }
      }
    }
  },
  [UPDATE_STUDENT_IS_PASSWORD_RESET_MUTATION](state, data) {
    for (let index = 0; index < state.students.length; index++) {
      if (state.students[index].user.pk == data.student_pk) {
        state.students[index].student.is_password_reset = data.is_password_reset;
        break;
      }
    }
  },
  [UPDATE_STUDENT_HAS_PAYMENT_MUTATION](state, data) {
    for (let index = 0; index < state.students.length; index++) {
      if (state.students[index].user.pk == data.student_pk) {
        state.students[index].student.has_payment = data.has_payment;
        break;
      }
    }
  },
  [UPDATE_STUDENT_HAS_CONTRACT_MUTATION](state, data) {
    for (let index = 0; index < state.students.length; index++) {
      if (state.students[index].user.pk == data.student_pk) {
        state.students[index].student.has_contract = data.has_contract;
        break;
      }
    }
  },
  [SET_STUDENT_PLAN_MUTATION](state, data) {
    state.students.forEach(student => {
      if (student.user.pk == data.student_pk) {
        student.student.plan.concat(data.plan);
      }
    });
  },
  [ADD_TEACHER_MUTATION](state, teacher) {
    state.teachers.push(teacher);
  },
  [UPDATE_TEACHER_MUTATION](state, data) {
    for (let i = 0; i < state.teachers.length; i++) {
      if (state.teachers[i].user.pk == data.teacher_pk) {
        state.teachers[i] = data.data;
        break;
      }
    }
  },
  [SET_TEACHER_LIST](state, teachers) {
    state.teachers = teachers;
  },
  [UPDATE_TEACHER_IS_PASSWORD_RESET_MUTATION](state, data) {
    for (let index = 0; index < state.teachers.length; index++) {
      if (state.teachers[index].user.pk == data.teacher_pk) {
        state.teachers[index].staff.is_password_reset = data.is_password_reset;
        break;
      }
    }
  },
  [ADD_STAFF_MUTATION](state, staff) {
    state.staffs.push(staff);
  },
  [UPDATE_STAFF_MUTATION](state, data) {
    for (let i = 0; i < state.staffs.length; i++) {
      if (state.staffs[i].user.pk == data.staff_pk) {
        state.staffs[i] = data.data;
        break;
      }
    }
  },
  [SET_STAFF_LIST](state, staffs) {
    state.staffs = staffs;
  },
  [UPDATE_STAFF_IS_PASSWORD_RESET_MUTATION](state, data) {
    for (let index = 0; index < state.staffs.length; index++) {
      if (state.staffs[index].user.pk == data.staff_pk) {
        state.staffs[index].staff.is_password_reset = data.is_password_reset;
        break;
      }
    }
  },
  [SET_STUDENT_FREEZE_LIST](state, student_freeze_list) {
    state.studentFreezeList = student_freeze_list
  },
  [ADD_STUDENT_FREEZE](state, student_freeze) {
    state.studentFreezeList.push(student_freeze);
  },
  [EDIT_STUDENT_FREEZE_MUTATION](state, student_freeze) {
    for (let i = 0; i < state.studentFreezeList.length; i++) {
      if (state.studentFreezeList[i].pk == student_freeze.pk) {
        state.studentFreezeList[i] = student_freeze;
      }
    }
  },
  [DELETE_STUDENT_FREEZE_MUTATION](state, student_freeze_id) {
    var tmp = [];
    state.studentFreezeList.forEach(elem => {
      if (elem.pk != student_freeze_id) {
        tmp.push(elem);
      }
    });
    state.studentFreezeList = tmp;
  },
  [SET_STUDENT_GROUP_FREEZE_LIST](state, student_group_freeze_list) {
    state.studentGroupFreezeList = student_group_freeze_list;
  },
  [ADD_STUDENT_GROUP_FREEZE](state, student_group_freeze) {
    state.studentGroupFreezeList.push(student_group_freeze);
  },
  [DELETE_STUDENT_GROUP_FREEZE_MUTATION](state, student_group_freeze_id) {
    var tmp = [];
    state.studentGroupFreezeList.forEach(elem => {
      if (elem.pk != student_group_freeze_id) {
        tmp.push(elem);
      }
    });
    state.studentGroupFreezeList = tmp;
  }
};

export default {
  state,
  actions,
  mutations,
  getters
};
