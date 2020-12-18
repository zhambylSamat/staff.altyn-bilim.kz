<template>
  <div id='calendar-list'>
    <v-container>
      <v-row no-gutters justify="center">
        <v-col cols='12'>
          <v-card class='mx-auto mb-4' elevation='5'>
            <v-btn text color='primary' @click="newGroup()">+ Жаңа группа</v-btn>
            <v-btn v-if="getCheckingWithIp != null && getCheckingWithIp"
              outlined
              color='warning'
              :loading='loadign_on_fetch_checking_with_ip'
              style='float:right;'
              @click="enableWithoutIP()">Видео сабақтар IP бойынша. Қосулы</v-btn>
            <v-btn v-if="getCheckingWithIp != null && !getCheckingWithIp"
              outlined
              color='error'
              :loading='loadign_on_fetch_checking_with_ip'
              style='float:right;'
              @click="disableWithoutIP()">Видео сабақтар IP бойынша. Өшірулі</v-btn>
          </v-card>
        </v-col>
        <v-col col='12' xs='12' sm='6' md='6'>
          <v-btn color='info' @click='openDayOffList'>Праздниктер мен отменалар</v-btn>
          <v-spacer></v-spacer>
          <v-btn outlined small color='indigo' @click="fetchLessonGroupList(0, true)" :loading="loading_on_fetch_group_list || loading_on_fetch_student_list">Обновить список</v-btn>
        </v-col>
        <v-col cols='12' xs='12' sm='6' md='6' class='mb-4'>
          <v-card>
          <v-card-title>
            <v-text-field
                  v-model="search"
                  prepend-icon='mdi-magnify'
                  label='Поиск'
                  single-line
                  hide-details
                  dense>
            </v-text-field>
          </v-card-title>
        </v-card>
        </v-col>
        <v-col cols='12'>
          <v-progress-linear v-if='loading_on_fetch_group_list' v-model="loading_fetch_group_value" :active="true"></v-progress-linear>
          <v-data-table
            :headers="headers"
            :items="filteredItems"
            sort-by="last_name"
            :sort-desc="false"
            class="elevation-1"
            :items-per-page="-1"
            hide-default-footer
            show-expand
            :custom-sort="customSort"
            item-key="pk">

              <template v-slot:item="{ index, item, headers, expand, isExpanded }">
                <tr>
                  <td v-for="n in headers" :key="n.value">
                    <template v-if="n.value=='group_numeration'">
                      {{ index + 1 }}
                    </template>
                    <template v-if="n.value=='group_name'">
                      <v-btn text small color='primary' @click="openVisitLog(item)">
                        {{ item[n.value] }}
                      </v-btn>
                    </template>
                    <template v-else-if="n.value === 'data-table-expand'">
                      <v-progress-circular v-if='loading_on_fetch_student_list'
                        :rotate="360"
                        :size="50"
                        :width="2"
                        :value="loading_fetch_student_value"
                        color="teal" > {{ loading_fetch_student_value }} </v-progress-circular>
                      <v-btn v-else small color='indigo--text' @click="expand(!isExpanded); showGroupStudents(item.pk, isExpanded);">
                        <v-icon>mdi-format-list-bulleted</v-icon>
                      </v-btn>
                    </template>
                    <template v-else-if="n.value === 'schedule'">
                      <template v-for="(val, i) in item[n.value]">
                        <span :key='i'>{{ val }}</span><br :key="i+'br'">
                      </template>
                    </template>
                    <template v-else-if="n.value === 'actions'">
                      <v-btn class='ml-2' fab dark x-small color="info" outlined @click='editGroup(item.group_full_info)'>
                          <v-tooltip top>
                            <template v-slot:activator="{ on }">
                              <v-icon v-on='on'>mdi-pencil</v-icon>
                            </template>
                            <span>Группаны өзгерту</span>
                          </v-tooltip>
                        </v-btn>
                      <v-btn class='ml-2' fab outlined x-small color='primary' @click="openTransferTimeList(item.pk, item.group_name, item.schedule_obj)">
                        <v-tooltip top>
                          <template v-slot:activator="{ on }">
                            <v-icon v-on='on'>mdi-file-replace-outline</v-icon>
                          </template>
                          <span>Перенос время</span>
                        </v-tooltip>
                      </v-btn>
                      <v-btn class='ml-2' fab outlined x-small color='warning' @click="openGroupReplacementList(item.pk, item.group_name, item.user_pk, item.schedule_obj)">
                        <v-tooltip top>
                          <template v-slot:activator="{ on }">
                            <!-- <v-icon v-on='on'>mdi-file-replace-outline</v-icon> -->
                            <v-icon v-on='on'>mdi-shuffle-variant</v-icon>
                          </template>
                          <span>Замена н/се Отмена</span>
                        </v-tooltip>
                      </v-btn>
                      <v-btn class='ml-2' fab x-small color='error' @click="preRemoveGroup(item.pk, item.group_name)">
                        <v-tooltip top>
                          <template v-slot:activator="{ on }">
                            <!-- <v-icon v-on='on'>mdi-file-replace-outline</v-icon> -->
                            <v-icon v-on='on'>mdi-trash-can</v-icon>
                          </template>
                          <span>Удалить</span>
                        </v-tooltip>
                      </v-btn>
                    </template>
                    <template v-else>
                      {{ item[n.value] }}
                    </template>
                  </td>
                </tr>
              </template>

              <template v-slot:expanded-item="{ headers, item }">
                <td :colspan="headers.length">
                  <GroupStudent ref="groupStudent" :group_pk="item.pk" :group_schedule="item.schedule_obj" />
                </td>
              </template>

            </v-data-table>
        </v-col>
      </v-row>
    </v-container>
    <GroupForm ref="groupForm" @re_render_group_form="re_render_parent"/>
    <GroupReplacementList ref='group_replacement_list' :open_group_replacement_form='openGroupReplacementForm' :edit_group_replacement_form="editGroupReplacementForm" />
    <GroupReplacementForm ref='group_replacement_form' />
    <GroupTransferTimeList ref='group_transfer_time' />
    <DayOffList ref='dayOffList' />

    <v-dialog v-model="removeLessonGroup.show_alert" persistent>
      <v-alert v-if="removeLessonGroup.show_alert" prominent type="error" style='margin: 0 !important;'>
        <v-row align="center">
          <v-col class="grow">"{{ removeLessonGroup.lesson_group_name }}" группасын тізімнен өшіруге келісесінбе? Осы топқа байланысты барлық ақпараттар өшеді.</v-col>
          <v-col class="shrink">
            <v-btn block color='info' @click='cancelRemoveLessonGroup(removeLessonGroup)' class='mb-3' :loading="removeLessonGroup.loading_on_delete">Отмена</v-btn>
            <v-btn block color="red" @click='acceptRemoveLessonGroup(removeLessonGroup)' :loading="removeLessonGroup.loading_on_delete">өшріу</v-btn>
          </v-col>
        </v-row>
      </v-alert>
    </v-dialog>
  </div>
</template>

<script>

import { mapGetters } from "vuex";
import {
  GET_GROUP_LIST_OFFSET,
  GET_STUDENT_OFFSET_LIST,
  CHECK_STUDENTS_LIST,
  CHECK_GROUPS_LIST,
  GET_LESSON_GROUP_WITH_IP,
  SET_LESSON_GROUP_WITH_IP,
  UNSET_LESSON_GROUP_WITH_IP,
  DELETE_GROUP
} from "@/store/actions.type.js";
import GroupStudent from "@/models/lesson_process/group_component/groupStudent.vue";
import GroupForm from "@/models/lesson_process/group_component/groupForm.vue";
import GroupReplacementList from "@/models/lesson_process/group_component/groupReplacementList.vue";
import GroupReplacementForm from "@/models/lesson_process/group_component/groupReplacementForm.vue";
import DayOffList from "@/models/lesson_process/group_component/day_off_list.vue";
import GroupTransferTimeList from "@/models/lesson_process/group_component/group_transfer_time_list.vue";

export default {
  props: ['re_render', 'open_visit_log'],
  components: { 
    GroupStudent,
    GroupForm,
    GroupReplacementList,
    GroupReplacementForm,
    DayOffList,
    GroupTransferTimeList,
  },
  data() {
    return {
      headers: [
        {
          text: '#',
          value: 'group_numeration'
        },
        {
          text: 'Тегі',
          sortable: true,
          value: 'last_name'
        },
        {
          text: 'Аты',
          sortable: true,
          value: 'first_name'
        },
        {
          text: 'Группа',
          sortable: true,
          value: 'group_name'
        },
        {
          text: "Сабақ кестесі",
          sortable: false,
          value: 'schedule'
        },
        {
          text: 'Оқушылар',
          sortable: false,
          value: 'student_count'
        },
        {
          text: 'Оқушылар тізімі',
          sortable: false,
          value: 'data-table-expand'
        },
        {
          text: 'Әрекет',
          sortable: false,
          value: 'actions'
        }
      ],
      search: '',
      loading_on_fetch_student_list: false,
      loading_fetch_student_value: 0,
      loading_on_fetch_group_list: false,
      loadign_on_fetch_checking_with_ip: false,
      loading_fetch_group_value: 0,
      items_per_load: 15,
      items_per_load_students: 30,
      removeLessonGroup: {
        lesson_group_id: null,
        lesson_group_name: null,
        show_alert: false,
        loading_on_delete: false
      }
    }
  },
  methods: {
    newGroup() {
      this.$refs.groupForm.openGroupForm();
    },
    customSort(items, index, isDesc) {
      items.sort((a, b) => {
        if (index[0] === 'last_name') {
          if (!isDesc[0]) {
            return a.last_name.localeCompare(b.last_name);
          } else {
            return b.last_name.localeCompare(a.last_name);
          }
        } else if (index[0] === 'first_name') {
          if (!isDesc[0]) {
            return a.first_name.localeCompare(a.first_name);
          } else {
            return b.first_name.localeCompare(b.first_name);
          }
        } else if (index[0] === 'group_name') {
          if (!isDesc[0]) {
            return a.group_name.localeCompare(b.group_name);
          } else {
            return b.group_name.localeCompare(a.group_name);
          }
        }
      });
      return items;
    },
    removeSeconds(time) {
      var result = time.split(':');
      return result[0] + ':' + result[1];
    },
    showGroupStudents(group_pk, isExpanded) {
      console.log(group_pk, isExpanded);
      // if (!isExpanded) {
        // this.$store.dispatch(GET_STUDENT_PLAN, student_pk);
      // }
    },
    openGroupReplacementList(group_id, group_title, user_id, schedule) {
      var items = {
        group_id: group_id,
        group_title: group_title,
        teacher_user_id: user_id,
        schedule: schedule,
      }
      this.$refs.group_replacement_list.openDialog(items);
    },
    openTransferTimeList(group_id, group_title, schedule) {
      this.$refs.group_transfer_time.openDialog(group_id, group_title, schedule);
    },
    openGroupReplacementForm(items) {
      this.$refs.group_replacement_form.openDialog(items);
    },
    editGroupReplacementForm(data, group_info) {
      this.$refs.group_replacement_form.editForm(data, group_info);
    },
    fetchLessonGroupList(start, force) {
      this.loading_on_fetch_group_list = true;
      this.loading_on_fetch_student_list = true;
      var credentails = {
        start: start * this.items_per_load,
        limit: this.items_per_load
      }
      this.$store.dispatch(GET_GROUP_LIST_OFFSET, credentails)
        .then(response => {
          var total_group = response.data.total;
          var lesson_group_length = this.getGroups.length;
          var percent = parseInt((lesson_group_length / total_group) * 100);
          this.loading_fetch_group_value = percent;
          if (total_group > lesson_group_length) {
            this.fetchLessonGroupList(start + 1, force);
          } else {
            this.loading_on_fetch_group_list = false;
            if (this.getStudents == null || force) {
              this.fetchStudentList(0);
            } else {
              this.loading_on_fetch_student_list = false;
            }
          }
        });
    },
    fetchStudentList(start) {
      this.loading_on_fetch_student_list = true;
      var credentials = {
        start: start * this.items_per_load_students,
        limit: this.items_per_load_students
      }
      this.$store.dispatch(GET_STUDENT_OFFSET_LIST, credentials)
        .then(response => {
          var total_student = response.data.total;
          var student_length = this.getStudents.length;
          var percent = parseInt((student_length / total_student) * 100);
          this.loading_fetch_student_value = percent;
          if (total_student > student_length) {
            this.fetchStudentList(start + 1);
          } else {
            this.loading_on_fetch_student_list = false;  
          }
        })
    },
    fetchCheckingWithIp() {
      this.loadign_on_fetch_checking_with_ip = true;
      this.$store.dispatch(GET_LESSON_GROUP_WITH_IP)
        .then(() => { this.loadign_on_fetch_checking_with_ip = false; })
        .catch(() => { this.loadign_on_fetch_checking_with_ip = false; });
    },
    openDayOffList()  {
      this.$refs.dayOffList.openDialog();
    },
    editGroup(group_info) {
      this.$refs.groupForm.editGroupForm(group_info);
    },
    re_render_parent() {
      this.$emit('re_render_from_group_list');
    },
    enableWithoutIP() {
      this.loadign_on_fetch_checking_with_ip = true;
      this.$store.dispatch(SET_LESSON_GROUP_WITH_IP)
        .then(() => { this.loadign_on_fetch_checking_with_ip = false; })
        .catch(() => { this.loadign_on_fetch_checking_with_ip = false; });
    },
    disableWithoutIP() {
      this.loadign_on_fetch_checking_with_ip = true;
      this.$store.dispatch(UNSET_LESSON_GROUP_WITH_IP)
        .then(() => { this.loadign_on_fetch_checking_with_ip = false; })
        .catch(() => { this.loadign_on_fetch_checking_with_ip = false; });
    },
    preRemoveGroup(lesson_group_id, lesson_group_name) {
      this.removeLessonGroup.lesson_group_id = lesson_group_id;
      this.removeLessonGroup.lesson_group_name = lesson_group_name;
      this.removeLessonGroup.show_alert = true;
    },
    acceptRemoveLessonGroup(removeLessonGroup) {
      removeLessonGroup.loading_on_delete = true;
      this.$store.dispatch(DELETE_GROUP, removeLessonGroup.lesson_group_id)
        .then(() => {
          removeLessonGroup.loading_on_delete = false;
          removeLessonGroup.lesson_group_id = null;
          removeLessonGroup.lesson_group_name = null;
          removeLessonGroup.show_alert = false;
        })
        .catch(() => { this.cancelRemoveLessonGroup(removeLessonGroup) });
    },
    cancelRemoveLessonGroup(removeLessonGroup) {
      removeLessonGroup.lesson_group_id = null;
      removeLessonGroup.lesson_group_name = null;
      removeLessonGroup.show_alert = false;
      removeLessonGroup.loading_on_delete = false
    },
    openVisitLog(item) {
      this.open_visit_log(item.pk, item.group_name);
    }
  },
  computed: {
    ...mapGetters(['getGroups', 'getStudents', 'getCheckingWithIp']),
    filteredItems() {
      var result = [];
      if (this.getGroups != null) {
        this.getGroups.forEach(elem => {
          var tmp = {
            pk: elem.pk,
            user_pk: elem.user_info.pk,
            last_name: elem.user_info.last_name,
            first_name: elem.user_info.first_name,
            group_name: elem.title,
            schedule: [],
            schedule_obj: [],
            student_count: 0 + '/' + elem.student_limit,
            students: [],
            group_full_info: elem,
          }
          if (elem.schedules != null) {
            elem.schedules.forEach(schedule => {
              var tmp_schedule = schedule.office_info.title + ' -> ' 
                                  + schedule.week_day_info.short_title + ' '
                                  + this.removeSeconds(schedule.start_time) + ' - '
                                  + this.removeSeconds(schedule.finish_time);
              tmp.schedule_obj.push(schedule);
              tmp.schedule.push(tmp_schedule);
            });
          }
          result.push(tmp);
        });
      }
      return result.filter((i) => {
        var search = this.search.toString().toLowerCase();
        if (i.last_name.toString().toLowerCase().indexOf(search) >= 0
            || i.first_name.toString().toLowerCase().indexOf(search) >= 0
            || i.group_name.toString().toLowerCase().indexOf(search) >= 0) {
              return true;
            }
      });
    }
  },
  created: function() {
    this.fetchCheckingWithIp();
    if (this.getGroups == null) {
      this.fetchLessonGroupList(0, false);
    } else {
      this.$store.dispatch(CHECK_STUDENTS_LIST);
      this.$store.dispatch(CHECK_GROUPS_LIST);
    }
  }
}
</script>
