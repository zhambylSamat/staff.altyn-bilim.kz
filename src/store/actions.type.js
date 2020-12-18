export const CHECK_AUTH = "checkAuth";
export const LOGIN = "login";
export const LOGOUT = "logout";
export const REGISTER = "register";
export const ACTIVATE_ACCOUNT = "activateAccount";
export const SET_PASSWORD = "setPassword";
export const REFRESH_AUTH = "refreshAuth";
export const UPDATE_USER = "updateUser";
export const SET_DEFAULT_ACTION = "setDefaultAction";
export const GET_ROLES = "setRoles";
export const CHANGE_PASSWORD = "changePassword";

export const REMOVE_ERRORS_ACTION = "removeErrorsAction";
export const REMOVE_WARNINGS_ACTION = "removeWarningsAction";
export const REMOVE_SUCCESS_ACTION = "removeSuccessAction";

// user.module.js ------start
export const CREATE_STUDENT = "createStudent";
export const UPDATE_STUDENT = "updateStudent";
export const GET_STUDENT_LIST = "getStudentList"; // depreciated
export const GET_STUDENT_OFFSET_LIST = "getStudentOffsetList";
export const CHECK_STUDENTS_LIST = "checkStudentsList";
export const OPTION_STUDENT_LIST = "optionStudentList";
export const GET_STUDENT_PLAN = "getStudentPlan";
export const RESET_STUDENT_PASSWORD = "resetStudentPassword";
export const SET_STUDENT_PAYMENT_STATUS_ACTION = "setStudentNoPaymentStatusAction";
export const SET_STUDENT_CONTRACT_STATUS_ACTION = "setStudentNoContractStatusAction";

export const CREATE_TEACHER = "createTeacher";
export const UPDATE_TEACHER = "updateTeacher";
export const GET_TEACHER_LIST = "getTeacherList";
export const RESET_TEACHER_PASSWORD = "resetTeacherPassword";

export const CREATE_STAFF = "createStaff";
export const UPDATE_STAFF = "updateStaff";
export const GET_STAFF_LIST = "getStaffList";
export const RESET_STAFF_PASSWORD = "resetStaffPassword";

export const GET_STUDENT_FREEZE_LIST = "getStudentFreezeList";
export const CREATE_STUDENT_FREEZE = "createStudentFreezeList";
export const EDIT_STUDENT_FREEZE = 'editStudentFreeze';
export const DELETE_STUDENT_FREEZE = "deleteStudentFreeze";

export const GET_STUDENT_GROUP_FREEZE_LIST = "getStudentGroupFreezeList";
export const CREATE_STUDENT_GROUP_FREEZE = "createStudentGroupFreeze";
export const DELETE_STUDENT_GROUP_FREEZE = "deleteStudentGroupFreeze";
// user.module.js ------end


// materials.module.js ---------------start
export const GET_SUBJECTS = "getSubjects";
export const GET_CHAPTER_AND_TOPICS = "getChaptersAndTopics";
// materials.module.js ---------------end

// group_lesson.module.js -------------------start
export const SET_STUDENT_PLAN = "setStudentPlan";
export const EDIT_STUDENT_PLAN = "editStudentPlan";
export const SYNC_STUDENT_PLAN_ACTION_BY_STUDENT_ID = 'syncStudentPlanActionById';
export const GET_OFFICE_LIST = "getOfficeList";
export const SET_OFFICE = "setOffice";
export const GET_SCHEDULE_LIST = "getScheduleList";
export const CREATE_GROUP = "setGroup";
export const EDIT_GROUP = "editGroup";
export const DELETE_GROUP = "deleteGroup";
export const GET_GROUP_LIST = "getGroupList"; // depreciated
export const GET_GROUP_LIST_OFFSET = "getGroupListOffset";
export const CHECK_GROUPS_LIST = "checkGroupsList";

export const SET_STUDENT_PLAN_TO_GROUP = "setStudentPlanToGroup";
export const GET_STUDENT_PLANS_BY_GROUP = "getStudentPlansByGroup";
export const EDIT_STUDENT_PLAN_TO_GROUP = "editStudentPlanToGroup";
export const REMOVE_STUDENT_PLAN_FROM_GROUP = "removeStudentPlanFromGroup";

export const GET_AVAILABLE_SCHEDULES = "getAvailableSchedules";
export const GET_GROUP_REPLACE_LIST = "getGroupReplaceList";
export const SET_GROUP_REPLACEMENT = "setGroupReplacement";
export const EDIT_GROUP_REPLACEMENT = "editGroupREplacement";
export const DELETE_GROUP_REPLACEMENT = "deleteGroupREplacement";

export const GET_DAY_OFF_LIST = "getDayOffList";
export const ADD_DAY_OFF_LIST = "addDayOffList";
export const EDIT_DAY_OFF = 'editDayOff';
export const DELETE_DAY_OFF = 'deleteDayOff';

export const GET_GROUP_TIME_TRANSFER = "getGroupTimeTransfer";
export const ADD_GROUP_TIME_TRANSFER = "addGroupTimeTransfer";
export const DELETE_GROUP_TIME_TRANSFER = "deleteGroupTimeTransfer";

export const GET_STUDENTS_ABS_LIST = "getStudentsABSList";
export const GET_STUDENT_ABS_MONTH_LIST = "getStudentABSMonthList";
// group_lesson.module.js --------------------end

// configuration.module.js --------------------start
export const GET_LESSON_GROUP_WITH_IP = 'getLessonGroupWithIp';
export const SET_LESSON_GROUP_WITH_IP = 'setLessonGroupWithIp';
export const UNSET_LESSON_GROUP_WITH_IP = 'unsetLessonGroupWithIp';
// configuration.module.js --------------------end