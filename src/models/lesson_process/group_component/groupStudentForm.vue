<template>
  <v-dialog v-model="dialog" persistent max-width='30%'>
    <v-card>
      <v-card-title>
        <span class='headline'>Группаға оқушы енгізу</span>
        <v-spacer></v-spacer>
        <v-btn color="grey darken-1" class='headline font-weight-black' text @click="closeDialog()">X</v-btn>
      </v-card-title>
      <v-card-text>
        <v-form v-if='dialog' ref='form' :model="form" @submit.prevent="onSubmit(form)">
          <v-container>
            <v-row>
              <v-col cols='12'>
                <v-autocomplete :loading="studentFetchLoad"
                              dense
                              autocomplete="off"
                              label="Оқушы"
                              :items="getFreeStudents()"
                              :disabled="is_edit"
                              item-text="full_name"
                              item-value='pk'
                              v-model="extra_group_student_data_form.student_user_pk"></v-autocomplete>
              </v-col>
              <v-col cols='12'>
                <v-select v-model="form.student_plan"
                      :rules="studentPlanRules"
                      :loading="studentPlanFetchLoad"
                      :items="getFreeStudentPlans()"
                      item-text="title"
                      item-value='pk'
                      label='Жоспары'
                      dense></v-select>
              </v-col>
              <template v-if="extra_group_student_data_form.lesson_group_student_short_schedule.length > 1">
                <v-col cols='6'>Оқушының бір аптада сабаққа қатысатын күндері</v-col>
                <v-col cols='2' v-for="(val, i) in extra_group_student_data_form.lesson_group_student_short_schedule" :key='i'>
                  <v-checkbox :disabled="accessToStudentTeachDays && val.var.val"
                              v-model='val.var.val'
                              :label='val.txt'></v-checkbox>
                </v-col>
              </template>
              <v-col cols='12'>
                <v-menu
                  ref='menu'
                  v-model='menu'
                  :close-on-content-click="false"
                  transition="scale-transition"
                  offset-y
                  full-width
                  min-width="290px">
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      v-model="computedDateFormatted"
                      label='Сабақты бастайтын уақыты'
                      :rules="startedDateRules"
                      prepend-icon="mdi-calendar-month-outline"
                      hint="ДД.ММ.ГГГГ"
                      readonly
                      dense
                      v-on="on"></v-text-field>
                  </template>
                  <v-date-picker
                    ref='picker'
                    v-model="form.started_date"
                    min="1980-01-01"
                    :first-day-of-week="1"
                    locale="ru"
                    @change="save"></v-date-picker>
                </v-menu>
              </v-col>
              <v-col cols='12'>
                <v-spacer></v-spacer>
                <v-btn color="blue-grey lighten-1" small text @click="closeDialog()">Отмена</v-btn>
                <v-btn color="blue darken-1" small :loading="submitLoading" type='submit' outlined>Сақтау</v-btn>
              </v-col>
            </v-row>
          </v-container>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>

import { mapGetters } from "vuex";
import { SET_STUDENT_PLAN_TO_GROUP, GET_STUDENT_PLAN, EDIT_STUDENT_PLAN_TO_GROUP } from "@/store/actions.type.js";

export default {
  data() {
    return {
      dialog: false,
      studentFetchLoad: false,
      extra_group_student_data_form: null,
      form: null,
      is_edit: false,
      group_pk: null,
      submitLoading: false,
      studentPlanFetchLoad: false,
      menu: false,
      startedDateRules: [
        v => !!v || ""
      ],
      studentPlanRules: [
        v => !!v || ""
      ]
    }
  },
  methods: {
    openDialog(group_pk, group_schedule) {
      this.group_pk = group_pk;
      this.setDefaultForm();
      this.setStudentShortSchedule(group_schedule, null);
      this.dialog = true;
    },
    editForm(data) {
      this.setDefaultForm();
      this.extra_group_student_data_form.student_user_pk = data.student_user_pk;
      this.form = data.form;
      this.setStudentShortSchedule(data.group_schedule, this.form.lesson_group_student_short_schedule);
      this.is_edit=true;
      this.group_pk = data.form.lesson_group;
      this.dialog=true;
    },
    closeDialog() { 
      this.dialog = false;
      this.is_edit = false;
    },
    validate() {
      if (this.$refs.form.validate()) {
        return true;
      }
      return false;
    },
    onSubmit(form) {
      if (this.validate() && this.group_pk != null) {
        this.submitLoading = true;
        this.form.lesson_group_student_short_schedule = [];
        this.extra_group_student_data_form.lesson_group_student_short_schedule.forEach(elem => {
          if (elem.var.val){
            elem.var.lesson_group = this.form.pk;
            this.form.lesson_group_student_short_schedule.push(elem.var);
          }
        });
        if (this.is_edit) {
          this.$store.dispatch(EDIT_STUDENT_PLAN_TO_GROUP, form)
            .then(() => {
              this.submitLoading = false;
              this.dialog = false;
              this.$emit('re_render');
            })
            .catch(() => { this.submitLoading = false; })
        } else {
          form.lesson_group = this.group_pk;
          this.$store.dispatch(SET_STUDENT_PLAN_TO_GROUP, form)
            .then(() => {
              this.submitLoading = false;
              this.dialog = false;
              this.$emit('re_render');
            })
            .catch(() => {
              this.submitLoading = false;
            });
        }
      }
    },
    getFreeStudents() {
      var result = [];
      if (this.getStudents != null) {
        this.getStudents.forEach(elem => {
          var tmp = {
            pk: elem.user.pk,
            full_name: elem.user.last_name + ' ' + elem.user.first_name
          };
          result.push(tmp);
        });
        if (result.length == 0) {
          result.push({pk: null, full_name: "Students are not found"});
        }
      }
      return result;
    },
    setDefaultForm() {
      this.form = {
        pk: '',
        student_plan: '',
        lesson_group: null,
        started_date: new Date().toISOString().substr(0, 10),
        lesson_group_student_short_schedule: []
      }
      this.extra_group_student_data_form = {
        student_user_pk: null,
        lesson_group_student_short_schedule: []
      }
    },
    setStudentShortSchedule(group_schedule, student_short_schedule) {
      var week_day_signs = null;
      if (student_short_schedule != null) {
        week_day_signs = {};
        student_short_schedule.forEach(elem => {
          week_day_signs[elem.week_day_sign] = elem.pk;
        });
      }
      group_schedule.forEach(elem => {
        var num = null;
        if ([1,2].includes(elem.week_num)) {
          num = 1;
        }
        else if ([3,4].includes(elem.week_num)) {
          num = 2;
        }
        else if ([5,6].includes(elem.week_num)) {
          num = 3;
        }
        var tmp = {
          txt: elem.week_day_info.short_title,
          var: {
            pk: week_day_signs === null ? null : (week_day_signs[num] === undefined ? null : week_day_signs[num]),
            lesson_group_student: null,
            week_day_sign: num,
            val: week_day_signs === null ? true : (week_day_signs[num] === undefined ? false : true)
          }
        };
        this.extra_group_student_data_form.lesson_group_student_short_schedule.push(tmp);
      });
    },
    save (date) {
      this.$refs.menu.save(date);
    },
    formatDate (date) {
      if (!date) return null;
      const [year, month, day] = date.split('-');
      return `${day}.${month}.${year}`
    },
    getFreeStudentPlans() {
      var result = [];
      var student_user_pk = this.extra_group_student_data_form.student_user_pk;
      if (student_user_pk == null) {
        return result;
      } else {
        var student = this.getStudentByUserPk(student_user_pk);
        if (student.student.plan == undefined) {
          this.studentPlanFetchLoad = true;
          this.$store.dispatch(GET_STUDENT_PLAN, student_user_pk)
            .then(() => {
              this.studentPlanFetchLoad = false;
            })
            .catch(() => {
              this.studentPlanFetchLoad = false;
            });
        } else {
          student.student.plan.forEach(elem => {
            var tmp = {
              pk: elem.pk,
              title: elem.subject_info.title,
            }
            result.push(tmp);
          })
        }
      }
      return result;
    },
  },
  computed: {
    ...mapGetters(["getStudents", "getStudentByUserPk"]),
    computedDateFormatted () {
      return this.formatDate(this.form.started_date)
    },
    accessToStudentTeachDays() {
      var tmp = this.extra_group_student_data_form.lesson_group_student_short_schedule;
      var count = 0;
      for (let i = 0; i < tmp.length; i++) {
        if (tmp[i].var.val) {
          count++;
        }
      }
      return count == 1 ? true : false;
    }
  },
  watch: {
    // date () {
    //   this.form.started_date = this.formatDate(this.date);
    // }
  }
}
</script>
