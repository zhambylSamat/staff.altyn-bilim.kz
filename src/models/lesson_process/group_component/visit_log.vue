<template>
  <v-dialog v-model='dialog' scrollable max-width="80%">
    <v-card>
      <v-card-title>
        Журнал | {{ group_title }}
        <v-spacer></v-spacer>
        <v-btn color="grey darken-1" class='headline font-weight-black' text @click="closeDialog()">X</v-btn>
      </v-card-title>
      <v-divider></v-divider>
      <v-container v-if='dialog'>
        <v-row no-gutters justify="center" class='text-center'>
          <v-col cols='4'>
            <v-select v-if="getStudentsABSMonthList != null && getStudentsABSMonthList.length > 0"
              :items="month_list"
              item-text='str'
              item-value='date'
              v-model="month"
              dense
              @change="fetchLogDatas(group_id, month)"
              :loading="loading_on_fetch_months"
              :disabled="loading_on_fetch_months"></v-select>
          </v-col>
          <v-col cols='12'><v-divider></v-divider></v-col>
          <v-col cols='12'>
            <v-progress-circular v-if="loading_on_fetch_datas" :size="50" color="primary" indeterminate ></v-progress-circular>
            <v-simple-table v-else fixed-header>
              <template v-slot:default>
                <thead>
                  <tr>
                    <th class='text-center'>#</th>
                    <template v-for="(val, i) in getStudentsABSList.students">
                      <th :key='i' class='text-center'>{{ val.last_name }} {{ val.first_name }}</th>
                    </template>
                  </tr>
                  <tr>
                    <th></th> 
                    <template v-for="(val, i) in getStudentsABSList.students">
                      <th :key='i' class='text-center'>Қатысуы <span class='title'>|</span> Үй ж.</th>
                    </template>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(val, i) in getStudentsABSList.dates" :key="i">
                    <td class='text-left'>
                      {{ formatDate(val.abs_date) }}
                    </td>
                    <template v-for="(item, i) in getStudentsABSList.students">
                      <td :key='i'>
                        <LessonProgressRender :student_visit="getStudentVisit(item.pk, val.student_visit)" />
                      </td>
                    </template>
                  </tr>
                </tbody>
              </template>
            </v-simple-table>
          </v-col>
        </v-row>
      </v-container>
      <v-card-text>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>

import { mapGetters } from "vuex";
import { GET_STUDENTS_ABS_LIST, GET_STUDENT_ABS_MONTH_LIST } from "@/store/actions.type.js";
import LessonProgressRender from "@/models/lesson_process/group_component/lesson_progress_render.vue";

export default {
  props: ['open_visit_log_form', 'open_visit_log_form_edit'],
  components: { LessonProgressRender },
  data() {
    return {
      dialog: false,
      group_id: null,
      group_title: null,
      loading_on_fetch_months: false,
      loading_on_fetch_datas: false,
      month: null,
      month_list: [],
      month_str: {
        1: 'Қаңтар',
        2: 'Ақпан',
        3: 'Наурыз',
        4: 'Сәуір',
        5: 'Мамыр',
        6: 'Маусым',
        7: 'Шілде',
        8: 'Тамыз',
        9: 'Қыркүйек',
        10: 'Қазан',
        11: 'Қараша',
        12: 'Желтоқсан'
      }
    }
  },
  methods: {
    openDialog(group_id, group_title) {
      this.month = null;
      this.group_id = group_id;
      this.group_title = group_title;
      this.dialog = true;
      this.fetchLogDatas(this.group_id, 'current');
      this.fetchABSMonthList(this.group_id);
    },
    closeDialog() {
      this.month = null;
      this.dialog = false;
    },
    getMonth(dates) {
      var result = [];
      if (dates != null) {
        dates.forEach(elem => {
          var tmp = {
            date: elem,
            str: this.month_str[parseInt(elem.split('-')[1])]
          };
          result.push(tmp);
        });
        this.month = result[0].date;
      }
      return result;
    },
    fetchLogDatas(group_pk, date) {
      var credentials = {
        lesson_group_pk: group_pk,
        date: date,
      };
      this.loading_on_fetch_datas = true;
      this.$store.dispatch(GET_STUDENTS_ABS_LIST, credentials)
        .then(() => { this.loading_on_fetch_datas = false; })
        .catch(() => { this.loading_on_fetch_datas = false; });
    },
    fetchABSMonthList(group_pk) {
      this.loading_on_fetch_months = true;
      this.$store.dispatch(GET_STUDENT_ABS_MONTH_LIST, group_pk)
        .then(() => { this.loading_on_fetch_months = false; this.month_list = this.getMonth(this.getStudentsABSMonthList); })
        .catch(() => { this.loading_on_fetch_months = false; })
    },
    formatDate (date) {
      if (!date) return null;
      const [year, month, day] = date.split('-');
      return `${day}.${month}.${year}`
    },
    getStudentVisit(student_pk, student_visit) {
      for (let i = 0; i < student_visit.length; i++) {
        if (student_visit[i].user_info.pk == student_pk) {
          return student_visit[i];
        }
      }
      return null;
    },
  },
  computed: {
    ...mapGetters(["getStudentsABSList", "getStudentsABSMonthList"]),
  },
}
</script>
