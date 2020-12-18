<!-- eslint-disable -->
<template>
  <div id='group-form'>
    <v-row justify="center">
      <v-dialog v-model="groupForm" persistent max-width='30%'>
        <v-card>
          <v-card-title>
            <span class='headline'>Жаңа группа құрастыру</span>
            <v-spacer></v-spacer>
            <v-btn color="grey darken-1" class='headline font-weight-black' text @click="closeGroupForm()">X</v-btn>
          </v-card-title>
          <v-card-text>
            <v-form ref='form' :model='form' @submit.prevent="onSubmit(form)">
              <v-container>
                <v-row>
                  <v-col cols='12'>
                    <v-text-field v-model="form.title" dense label='Группаның аты' :rules="groupNameRules"></v-text-field>
                    <v-text-field v-model="form.student_limit" type='number' dense label='Группада оқитын оқушылар саны' :rules="studentLimitRules"></v-text-field>
                    <v-select :items="getTeacherList"
                        label='Мұғалім'
                        item-text="full_name"
                        item-value="pk"
                        :rules="teacherRules"
                        dense
                        v-model="form.teacher" requried></v-select>
                    <v-select :items="getOfficeList"
                        :loading='loading_on_fetch_available_schedule'
                        label="Кабинет"
                        item-text='office'
                        item-value='pk'
                        :rules="officeRules"
                        dense
                        multiple
                        chips
                        v-model="extra_form.office" requrired></v-select>
                    <v-select :disabled="extra_form.office.length == 0"
                        :loading='loading_on_fetch_available_schedule'
                        :items="getWeekDayTimeList"
                        label="Уақыт"
                        item-text="time"
                        item-value='pk'
                        multiple
                        chips
                        :rules="timeRules"
                        dense
                        v-model="form.schedules"></v-select>
                  </v-col>
                </v-row>
              </v-container>
              <v-divider></v-divider>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue-grey lighten-1" text @click="closeGroupForm()">Отмена</v-btn>
                <v-btn color="blue darken-1" :loading="submitLoading" type='submit' outlined>Сақтау</v-btn>
              </v-card-actions>
            </v-form>
            <!-- <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn v-if="is_readonly" color="orange darken-1" outlined @click="accessToEdit()">Изменить</v-btn>
            </v-card-actions> -->
          </v-card-text>
        </v-card>
      </v-dialog>
    </v-row>
  </div>
</template>
<!-- eslint-enable -->

<script>

import { mapGetters } from "vuex";
import { CREATE_GROUP, GET_AVAILABLE_SCHEDULES, EDIT_GROUP} from "@/store/actions.type.js";

export default {
  data() {
    return {
      groupForm: false,
      form: {},
      extra_form: {},
      group_info: null,
      submitLoading: false,
      groupNameRules: [
        v => !!v || "",
      ],
      teacherRules: [
        v => !!v || ""
      ],
      officeRules: [
        v => !!v || ""
      ],
      timeRules: [
        v => !!v || ""
      ],
      studentLimitRules: [
        v => /^([1-9]|1[0-9]|20)$/.test(v) || "Оқушылардың саны 1-20 аралығында болу керек"
      ],
      loading_on_fetch_available_schedule: false,
      is_edit: false,
    }
  },
  methods: {
    openGroupForm() {
      this.groupForm = true;
      this.setDefaultForm(null);
      this.fetch_available_schedules();
    },
    editGroupForm(group_info) {
      this.is_edit = true;
      this.fetch_available_schedules();
      this.group_info = group_info;
      this.setDefaultForm(group_info);
      this.groupForm = true;
    },
    closeGroupForm() {
      this.is_edit = false;
      this.submitLoading = false;
      this.loading_on_fetch_available_schedule = false;
      this.groupForm = false;
    },
    setDefaultForm(group_info) {
      if (group_info == null) {
        this.form = {
          pk: null,
          teacher: null,
          title: '',
          student_limit: 6,
          schedules: [],
          send_message_on_no_payment: false,
        };
        this.extra_form = {
          office: []
        }
      } else {
        this.form = {
          pk: group_info.pk,
          teacher: group_info.teacher,
          title: group_info.title,
          student_limit: group_info.student_limit,
          schedules: group_info.schedules == null ? [] : group_info.schedules,
          send_message_on_no_payment: group_info.send_message_on_no_payment, 
        };
        this.extra_form = {
          office: []
        };
        this.form.schedules.forEach(elem => {
          if (!this.extra_form.office.includes(elem.office)) {
            this.extra_form.office.push(elem.office)
          }
        });
      }
    },
    getAvailableSchedulesAndCurrentSchedule() {
      if (this.group_info != null && this.group_info.schedules != null) {
        return this.getAvailableSchedules.concat(this.group_info.schedules);
      }
      return this.getAvailableSchedules;
    },
    onSubmit(form) {
      if (this.validate()) {
        this.submitLoading = true;
        if (this.is_edit) {
          this.$store.dispatch(EDIT_GROUP, form)
            .then(() => {
              this.closeGroupForm();
              this.$emit('re_render_group_form');
            })
            .catch(() => { this.submitLoading = false; });
        } else {
          this.$store.dispatch(CREATE_GROUP, form)
            .then(() => {
              this.submitLoading = false;
              this.groupForm = false;
            })
            .catch(() => {
              this.submitLoading = false;
            });
        }
      }
    },
    validate() {
      if (this.$refs.form.validate()) {
        return true;
      }
      return false;
    },
    removeSeconds(time) {
      var result = time.split(':');
      return result[0] + ':' + result[1];
    },
    fetch_available_schedules() {
      this.loading_on_fetch_available_schedule = true;
      this.$store.dispatch(GET_AVAILABLE_SCHEDULES)
        .then(() => { this.loading_on_fetch_available_schedule = false; })
        .catch(() => { this.loading_on_fetch_available_schedule = false; });
    }
  },
  computed: {
    ...mapGetters(["getAvailableSchedules", "getTeachers"]),
    getTeacherList() {
      var result = [];
      var pre_result = [];
      this.getTeachers.forEach(elem => {
        var tmp = {
          pk: elem.user.pk,
          full_name: elem.user.last_name + ' ' + elem.user.first_name
        };
        pre_result.push(tmp);
      });
      pre_result = pre_result.sort((a, b) => {
         return a.full_name.localeCompare(b.full_name);
        });
      return result.concat(pre_result);
    },
    getOfficeList() {
      var result = [];
      var pre_result = [];
      if (this.getAvailableSchedules != null) {
        this.getAvailableSchedulesAndCurrentSchedule().forEach(elem => {
          if (!pre_result.some(e => e.pk == elem.office)) {
            var tmp = {
              pk: elem.office,
              office: elem.office_info.title
            }
            pre_result.push(tmp);
          }
        });
        pre_result = pre_result.sort((a, b) => {
            return a.office.localeCompare(b.office);
          });
        return result.concat(pre_result);
      }
      return [];
    },
    getWeekDayTimeList() {
      var result = [];
      var pre_result = [];
      if (this.getAvailableSchedules) {
        this.getAvailableSchedulesAndCurrentSchedule().forEach(elem => {
          if (this.extra_form.office.includes(elem.office)) {
            this.removeSeconds(elem.start_time);
            var tmp = {
              pk: elem.pk,
              time: elem.office_info.title + ' : ' + elem.week_day_info.short_title + ' : ' + this.removeSeconds(elem.start_time) + ' - ' + this.removeSeconds(elem.finish_time)
            };
            pre_result.push(tmp);
          }
        });
        return result.concat(pre_result);
      }
      return [];
    },
  },
  created() {
    this.setDefaultForm();
  }
}
</script>
