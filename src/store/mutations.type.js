export const PURGE_AUTH = "logOut";
export const SET_AUTH = "setAuth";
export const SET_PRE_AUTH = "setPreAuth";
export const SET_USER = "setUser";
export const SET_ERROR = "setError";
export const SET_WARNING = "setWarning";
export const SET_SUCCESS = "setSuccess";
export const REMOVE_ERRORS_MUTATION = "removeErrorsMutation";
export const REMOVE_WARNINGS_MUTATION = "removeWarningsMutation"; 
export const REMOVE_SUCCESS_MUTATION = "removeSuccessMutation";
export const SET_ROLES = "setRoles";

export const SET_DEFAULT_MUTATION = "setDefaultMutation";

// user.module.js-----------start
export const CREATE_STUDENT_MUTATION = "createStudentMutation";
export const UPDATE_STUDENT_MUTATION = "updateStudentMutation";
export const SET_STUDENT_LIST = "setStudentList"; // depreciate
export const SET_STUDENT_OFFSET_LIST = "setStudentOffsetList";
export const CHECK_STUDENTS_LIST_MUTATION = "checkStudentsListMutation";
export const ADD_STUDENT_PLAN = "addStudentPlan";
export const ADD_STUDENT_MUTATION = "addStudentMutation";
export const UPDATE_STUDENT_IS_PASSWORD_RESET_MUTATION = "updateStudentIsPasswordResetMutation";
export const UPDATE_STUDENT_HAS_PAYMENT_MUTATION = "updateStudentHasPaymentMutation";
export const UPDATE_STUDENT_HAS_CONTRACT_MUTATION = "updateStudentHasContractMutation";

export const UPDATE_TEACHER_MUTATION = "updateTeacherMutation";
export const ADD_TEACHER_MUTATION = "addTeacherMutation";
export const SET_TEACHER_LIST = "setTeacherList";
export const UPDATE_TEACHER_IS_PASSWORD_RESET_MUTATION = "updateTeacherIsPasswordResetMutation";

export const UPDATE_STAFF_MUTATION = "updateStaffMutation";
export const ADD_STAFF_MUTATION = "addStaffMutation";
export const SET_STAFF_LIST = "setStaffList";
export const UPDATE_STAFF_IS_PASSWORD_RESET_MUTATION = "updateStaffIsPasswordResetMutation";

export const SET_STUDENT_PLAN_MUTATION = "setStudentPlanMutation";
export const EDIT_STUDENT_PLAN_MUTATION = "editStudentPlanMutation";
export const SET_SYNCED_STUDENT_PLAN_ACTION_BY_STUDENT_ID = "setSyncedStudentPlanActionById";

export const SET_STUDENT_FREEZE_LIST = "setStudentFreezeList";
export const ADD_STUDENT_FREEZE = "addStudentFreezeList";
export const EDIT_STUDENT_FREEZE_MUTATION = 'editStudentFreezeMutation';
export const DELETE_STUDENT_FREEZE_MUTATION = "deleteStudentFreezeMutation";

export const SET_STUDENT_GROUP_FREEZE_LIST = "setStudentGroupFreezeList";
export const ADD_STUDENT_GROUP_FREEZE = "addStudentGroupFreeze";
export const DELETE_STUDENT_GROUP_FREEZE_MUTATION = "deleteStudentGroupFreezeMutation";
// user.module.js-----------end

// materials.module.js ----------start
export const SET_SUBJECTS = "setSubjects";
export const SET_CHAPTERS_AND_SUBJECTS = "setChaptersAndSubjects";
// materials.module.js ----------end

// group_lesson.module.js -------------------start
export const SET_OFFICE_LIST_MUTATION = "setOfficeListMutation";
export const SET_OFFICE_MUTATION = "setOfficeMutation";
export const SET_SCHEDULE_LIST_MUTATION = "setScheduleListMutation";
export const SET_GROUP_MUTATION = "setGroupMutation";
export const EDIT_GROUP_MUTATION = "editGroupMutation";
export const DELETE_GROUP_MUTATION = "deleteGroupMutation";
export const SET_GROUP_LIST_MUTATION = "setGroupListMutation"; // depreciated
export const SET_GROUP_LIST_OFFSET = "setGroupListOffset";
export const CHECK_GROUPS_LIST_MUTATION = "checkGroupsListMutation";

export const SET_STUDENT_PLAN_TO_GROUP_MUTATION = "setStudentPlanToGroupMutation";
export const GET_STUDENT_PLANS_BY_GROUP_MUTATION = "getStudentPlansByGroupMutation";
export const EDIT_STUDENT_PLAN_TO_GROUP_MUTATION = "editStudentPlanToGroupMutation";
export const REMOVE_STUDENT_PLAN_FROM_GROUP_MUTATION = "removeStudentPlanFromGroupMutation";

export const SET_AVAILABLE_SCHEDULES = "setAvailableSchedules";
export const SET_GROUP_REPLACE_LIST = "setGroupReplaceList";
export const SET_GROUP_REPLACEMENT_MUTATION = "setGroupReplacementMutation";
export const EDIT_GROUP_REPLACEMENT_MUTATION = "editGroupReplacementMutation";
export const DELETE_GROUP_REPLACEMENT_MUTATION = "deleteGroupREplacementMutation";

export const SET_DAY_OFF_LIST = "setDayOffList";
export const APPEND_DAY_OFF_LIST = "appendDayOffList";
export const EDIT_DAY_OFF_MUTATION = 'editDayOffMutation';
export const DELETE_DAY_OFF_MUTATION = 'deleteDayOffMutation';

export const SET_GROUP_TIME_TRANSFER = "setGroupTimeTransfer";
export const APPEND_GROUP_TIME_TRANSFER = "appendGroupTimeTransfer";
export const DELETE_GROUP_TIME_TRANSFER_MUTATION = "deleteGroupTimeTransferMutation";

export const SET_STUDENTS_ABS_LIST = "setStudentsABSList";
export const SET_STUDENT_ABS_MONTH_LIST = "setStudentABSMonthList";
// group_lesson.module.js -------------------end

// configuration.module.js --------------------start
export const GET_LESSON_GROUP_WITH_IP_MUTATION = 'getLessonGroupWithIp';
export const SET_LESSON_GROUP_WITH_IP_MUTATION = 'setLessonGroupWithIp';
export const UNSET_LESSON_GROUP_WITH_IP_MUTATION = 'unsetLessonGroupWithIp';
// configuration.module.js --------------------end
