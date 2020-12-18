<!-- eslint-disable -->
<template>
  <div>
    <v-simple-table dense :key="currentComponenetKey">
      <template v-slot:default>
        <tbody>
          <tr v-if="student_plans_loading">
            Загрузка плана...
            <v-progress-linear indeterminate color="indigo"></v-progress-linear>
          </tr>
          <tr v-else-if="student_plans.length == 0">
            <td>There is not student plans</td>
          </tr>
          <template v-else>
            <tr>
              <th>Аты-жөні</th>
              <th>Пәні</th>
              <th>Прогресс</th>
              <th>Сабақты бастаған уақыты</th>
              <th>Әрекет</th>
            </tr>
            <template v-for="(val, index) in student_plans">
              <tr :key="index">
                <td>{{ val.full_name }}</td>
                <td>{{ val.subject }}</td>
                <td>{{ val.progress }}%</td>
                <td>{{ formatDate(val.started_date) }}</td>
                <td>
                  <v-btn small
                        outlined
                        color='info'
                        class='mr-2'
                        @click="editStudentInGroup(val, group_schedule)">
                    <v-tooltip top>
                      <template v-slot:activator="{on}">
                        <v-icon v-on='on'>mdi-pencil</v-icon>
                      </template>
                      <span>Өзгерту</span>
                    </v-tooltip>
                  </v-btn>

                  <v-btn small
                    outlined
                    dark
                    class='mx-1'
                    color="orange darken"
                    @click="openStudentGroupFreeze(val.group_student, val.full_name)">
                    <v-tooltip top>
                      <template v-slot:activator="{ on }">
                        <v-icon v-on='on'>mdi-snowflake</v-icon>
                      </template>
                      <span>Оқушының замарозкасы</span>
                    </v-tooltip>
                  </v-btn>

                  <v-btn small
                        color='error'
                        @click="removeStudentFromGroup(val.group_student, val.lesson_group)"
                        :loading='loading_on_deleting_student_plan_from_group'>
                    <v-tooltip top>
                        <template v-slot:activator="{ on }">
                          <v-icon v-on='on'>mdi-archive</v-icon>
                        </template>
                        <span>Архив</span>
                    </v-tooltip>
                  </v-btn>
                </td>
              </tr>
            </template>
          </template>
          <tr>
            <td colspan='5'>
              <v-btn x-small outlined color='indigo' @click="addNewGroupStudent(group_pk, group_schedule)">+ Жаңа оқушы жоспары</v-btn>
            </td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>
    <GroupStudentForm ref='groupStudentForm' @re_render="reRender"/>
    <StudentGroupFreezeList ref='student_group_freeze_list' />
  </div>
</template>
<!-- eslint-enable -->

<script>

import { mapGetters } from "vuex";
import {
  GET_STUDENT_PLANS_BY_GROUP,
  GET_STUDENT_PLAN,
  REMOVE_STUDENT_PLAN_FROM_GROUP,
} from "@/store/actions.type.js";
import GroupStudentForm from '@/models/lesson_process/group_component/groupStudentForm.vue';
import StudentGroupFreezeList from "@/models/lesson_process/group_component/studentGroupFreezeList.vue";
// import { SYNC_STUDENT_PLAN_ACTION_BY_STUDENT_ID } from "@/store/actions.type.js"

export default {
  props: ['group_pk', 'group_schedule'],
  components: { GroupStudentForm, StudentGroupFreezeList },
  data() {
    return {
      student_plans: [],
      student_plans_loading: true,
      isGroupStudentForm: false,
      loading_on_deleting_student_plan_from_group: false,
      currentComponenetKey: 1,
      fetch_get_student_plan: false,
    }
  },
  methods: {
    reRender() {
      this.set_students_plan_by_group();
      this.currentComponenetKey++;
    },
    addNewGroupStudent(group_pk, group_schedule) {
      // this.add_student_to_group(group_pk, group_schedule);
      this.$refs.groupStudentForm.openDialog(group_pk, group_schedule);
      // this.newPlanAction(this.student_pk);
    },
    formatDate (date) {
      if (!date) return null;
      const [year, month, day] = date.split('-');
      return `${day}.${month}.${year}`
    },    
    editStudentInGroup(data, group_schedule) {
      var res = {
        form: {
          pk: data.group_student,
          student_plan: data.student_plan,
          lesson_group: data.lesson_group,
          started_date: data.started_date,
          lesson_group_student_short_schedule: data.lesson_group_student_short_schedule
        },
        student_user_pk: data.student,
        group_schedule: group_schedule
      };
      // this.edit_student_in_group(res);
      this.$refs.groupStudentForm.editForm(res);
    },
    removeStudentFromGroup(group_student, lesson_group) {
      var result = {
        group_student: group_student,
        lesson_group: lesson_group
      };
      if (confirm('are you sure?')){
        this.loading_on_deleting_student_plan_from_group = true;
        this.$store.dispatch(REMOVE_STUDENT_PLAN_FROM_GROUP, result)
          .then(() => {
            this.loading_on_deleting_student_plan_from_group = false;
            this.reRender();
          })
          .catch(() => { this.loading_on_deleting_student_plan_from_group = false; });
      }
    },
    set_students_plan_by_group() {
      var plans_by_group = this.getStudentPlansByGroup(this.group_pk);
      if (plans_by_group.length == 0) {
        this.student_plans_loading = false;
      } else {
        if (this.fetch_get_student_plan) {
          plans_by_group.forEach(elem => {
            // var user = this.getStudentByUserPk(elem.student);
            this.$store.dispatch(GET_STUDENT_PLAN, elem.student)
              .then(() => {
                this.set_student_plan(elem);
              });
          });
          this.fetch_get_student_plan = false;
        } else {
          this.student_plans = [];
          plans_by_group.forEach(elem => {
            this.set_student_plan(elem);
          });
        }
      }
    },
    set_student_plan(plan_by_group) {
      var student_plan = this.getStudentPlanByUserPkAndPlanPk(plan_by_group.student, plan_by_group.student_plan);
      var tmp = {
        'group_student': plan_by_group.pk,
        'student_plan': plan_by_group.student_plan,
        'lesson_group': plan_by_group.lesson_group,
        'student': plan_by_group.student,
        'full_name': plan_by_group.user_info.last_name + ' ' + plan_by_group.user_info.first_name,
        'subject': student_plan.subject_info.title,
        'progress': student_plan.progress,
        'started_date': plan_by_group.started_date,
        'lesson_group_student_short_schedule': plan_by_group.lesson_group_student_short_schedule
      }
      this.student_plans.push(tmp);
      this.student_plans_loading = false;
    },
    openStudentGroupFreeze(lesson_group_student_id, full_name) {
      this.$refs.student_group_freeze_list.openDialog(lesson_group_student_id, full_name);
    }
  },
  computed: {
    ...mapGetters(['getStudentByUserPk', 'getStudentPlansByGroup', 'getStudentPlanByUserPkAndPlanPk']),
  },
  created: function()  {
    this.fetch_get_student_plan = true;
    this.$store.dispatch(GET_STUDENT_PLANS_BY_GROUP, this.group_pk)
      .then(() => {
        this.set_students_plan_by_group();
      });
  }
}
</script>
