<!-- eslint-disable -->
<template> 
  <v-container>
    <v-row no-gutters justify='center'>
      <v-col cols='12' xs='2' sm='2' md='2'>
        <v-btn outlined small color='indigo' @click="fetchStudentList(0)" :loading="loading_on_fetch_students">Обновить список</v-btn>
      </v-col>
      <v-col cols='12' xs='12' sm='6' offset-sm='4' md='6' offset-md='4' class='mb-4'>
        <v-card>
          <v-card-title>
            <v-select label='Фильтр' v-model='filterSelect' :items='filter' item-text="text" item-value="value"></v-select>
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
      <v-col cols='12' sm='12' md='12'>
        <v-progress-linear v-if='loading_on_fetch_students' v-model="loading_students_value" :active="true"></v-progress-linear>
        <v-data-table
          :headers="headers"
          :items="filteredItems"
          sort-by="last_name"
          :sort-desc="false"
          class='elevation-1'
          :page.sync="page"
          @page-count="pageCount = $event"
          :items-per-page="itemsPerPage"
          hide-default-footer
          show-expand
          :custom-sort="customSort"
          item-key="user.pk">
          <template v-slot:item="{item, index, headers, expand, isExpanded}">
            <tr>
              <td v-for="n in headers" :key="n.value">
                <template v-if="n.value === 'student_numeration'">
                  {{ index + 1 }}
                </template>
                <template v-else-if="n.value === 'notification'">

                  <v-tooltip top v-if='false'>
                    <template v-slot:activator="{ on }">
                      <v-avatar v-on='on' size="25" color='orange lighten-1' class='mx-1'>
                        <v-icon small color='white'>mdi-format-list-numbered</v-icon>
                      </v-avatar>
                    </template>
                    <span>Мұғалімі коммент енгізбеген</span>
                  </v-tooltip>

                  <v-tooltip top v-if='false'>
                    <template v-slot:activator="{ on }">
                      <v-avatar v-on='on' size="25" color='orange lighten-1' class='mx-1'>
                        <v-icon small color='white'>mdi-align-horizontal-left</v-icon>
                      </v-avatar>
                    </template>
                    <span>Опрос толтырмаған</span>
                  </v-tooltip>

                  <v-tooltip top v-if='!item.student.has_payment'>
                    <template v-slot:activator="{ on }">
                      <v-avatar v-on='on' size='25' color='red lighten-1' class='mx-1'>
                        <v-icon small color='white'>mdi-currency-kzt</v-icon>
                      </v-avatar>
                    </template>
                    <span>Оплатасы жоқ</span>
                  </v-tooltip>

                  <v-tooltip top v-if='!item.student.has_contract'>
                    <template v-slot:activator="{ on }">
                      <v-avatar v-on='on' size='25' color='red lighten-1' class='mx-1'>
                        <v-icon small color='white'>mdi-file-document</v-icon>
                      </v-avatar>
                    </template>
                    <span>Договор өткізбеген</span>
                  </v-tooltip>

                </template>
                <template v-else-if="n.value === 'last_name'">
                  {{ item.user[n.value] }}
                </template>
                <template v-else-if="n.value === 'first_name'">
                  {{ item.user[n.value] }}
                </template>
                <template v-else-if="n.value === 'username'">
                  {{ item.user[n.value] }}
                </template>
                <template v-else-if="n.value === 'password'">
                  Пароль:
                  <template v-if='item.student.is_password_reset'><span class='font-italic font-weight-bold'>1234567</span></template>
                  <template v-else>
                    <v-btn outlined color='indigo' x-small @click="resetPassword(item.user.pk)">Сбросить</v-btn>
                  </template>
                </template>
                <template v-else-if="n.value === 'data-table-expand'">
                  <v-btn small color='indigo--text' @click="expand(!isExpanded); showStudentPlan(item.user.pk, isExpanded);">
                    <v-icon>mdi-format-list-bulleted</v-icon>
                  </v-btn>
                </template>
                <template v-else-if="n.value === 'actions'">
                  <template v-if="isMobile">
                    <v-speed-dial
                      :id="item.user.pk"
                      transition="slide-x-reverse-transition"
                      direction="left"
                      show-expand
                      :open-on-hover="false">
                      <template v-slot:activator>
                        <v-btn :id="item.user.pk" small color='blue darken-2' dark fab>
                          <v-icon>mdi-account-settings-outline</v-icon>
                        </v-btn>
                      </template>
                      <StudentStatusActions :item="item" :edit_student="edit_student" />
                    </v-speed-dial>
                  </template>
                  <template v-else>
                    <StudentStatusActions :item="item" :edit_student="edit_student" :student_freeze_list="studentFreezeList"/>
                  </template>
                </template>
              </td>
            </tr>
          </template>

          <template v-slot:expanded-item="{ headers, item }">
            <td :colspan="headers.length">
              <template v-if="item.student.plan !== undefined">
                <StudentPlans :newPlanAction="newPlanAction" :student_pk="item.user.pk" :editPlanAction="editPlanAction" />
              </template>
              <template v-else>
                Загрузка...
                <v-progress-linear indeterminate color="indigo"></v-progress-linear>
              </template>
            </td>
          </template>

        </v-data-table>
        <div class="text-center pt-2">
          <v-pagination v-model="page" :length="pageCount"></v-pagination>
        </div>
      </v-col>
    </v-row>
    <StudentFreezeList ref="student_freeze_list" />
  </v-container>
</template>
<!-- eslint-enable -->

<script>

import { mapGetters } from "vuex";
import {
  // GET_STUDENT_LIST,
  GET_STUDENT_PLAN,
  RESET_STUDENT_PASSWORD,
  GET_STUDENT_OFFSET_LIST,
  CHECK_STUDENTS_LIST
} from "@/store/actions.type.js";
import StudentPlans from "@/models/user/student_component/studentPlans.vue";
import StudentStatusActions from "@/models/user/student_component/studentStatusActions.vue";
import StudentFreezeList from "@/models/user/student_component/studentFreezeList.vue";

export default {
  components: {
    StudentPlans,
    StudentStatusActions,
    StudentFreezeList,
  },
  props: ['edit_student', 'newPlanAction', 'editPlanAction'],
  data() {
    return {
      headers: [
        {
          text: '#',
          // sortable: false,
          value: 'student_numeration'
        },
        {
          text: 'Ескерулер',
          sortable: false,
          value: 'notification'
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
          text: 'username',
          sortable: true,
          value: 'username'
        },
        {
          text: 'password',
          sortable: false,
          value: 'password'
        },
        {
          text: 'Группалар',
          sortable: false,
          value: 'data-table-expand'
        },
        {
          text: 'Әрекет',
          sortable: false,
          value: 'actions'
        }
      ],
      action: {
        fab: false
      },
      isMobile: false,
      search: '',
      filter: [
        { text: 'Барлығы', value: 'default' },
        { text: 'Оплатасы жоқтар', value: 'no_payment' },
        { text: 'Договор өткізбегендер', value: 'no_contract' }
      ],
      filterSelect: 'default',
      loading_on_fetch_students: false,
      loading_students_value: 0,
      itemsPerPage: 30,
      page: 1,
      pageCount: 0,
    }
  },
  methods: {
    openStudentFormDialog() {
      this.$refs.studentFormDialog.openStudentFormDialog();
    },
    showStudentPlan(student_pk, isExpanded) {
      if (!isExpanded) {
        this.$store.dispatch(GET_STUDENT_PLAN, student_pk);
      }
    },
    resetPassword(student_pk) {
      if (confirm("Сбрость пароль?")) {
        this.$store.dispatch(RESET_STUDENT_PASSWORD, student_pk);
      }
    },
    onResize () {
      this.isMobile = window.innerWidth < 600
    },
    filterStatus(item) {
      if (this.filterSelect == 'no_payment') {
        return !item.student.has_payment
      } else if (this.filterSelect == 'no_contract') {
        return !item.student.has_contract;
      }
      return true;
    },
    customSort(items, index, isDesc) {
      items.sort((a,b) => {
        if (index[0] === 'last_name') {
          if (!isDesc[0]) {
            return a.user.last_name.localeCompare(b.user.last_name);
          } else {
            return b.user.last_name.localeCompare(a.user.last_name);
          }
        } else if (index[0] === 'first_name') {
          if (!isDesc[0]) {
            return a.user.first_name.localeCompare(b.user.first_name);
          } else {
            return b.user.first_name.localeCompare(a.user.first_name);
          }
        } else if (index[0] === 'username') {
          if (!isDesc) {
            return a.user.username.localeCompare(b.user.username);
          } else {
            return b.user.username.localeCompare(a.user.username);
          }
        }
      });
      return items;
    },
    fetchStudentList(offset) {
      this.loading_on_fetch_students = true;
      var credentials = {
        start: this.itemsPerPage * offset,
        limit: this.itemsPerPage
      }
      this.$store.dispatch(GET_STUDENT_OFFSET_LIST, credentials)
        .then(response => {
          var total_student = response.data.total;
          var student_length = this.getStudents.length;
          var percent = parseInt((student_length / total_student) * 100);
          this.loading_students_value = percent;
          if (total_student > student_length) {
            this.fetchStudentList(offset + 1);
          } else {
            this.loading_on_fetch_students = false;
          }
        })
        .catch(() => {
          this.loading_on_fetch_students = false;
        });
    },
    studentFreezeList(user_info) {
      this.$refs.student_freeze_list.openDialog(user_info);
    }
  },
  computed: {
    ...mapGetters(["getStudents"]),
    filteredItems() {
      if (this.getStudents != null) {
        var result = this.getStudents.filter((i) => {
          var search = this.search.toString().toLowerCase();
          if ((i.user.last_name.toString().toLowerCase().indexOf(search) >= 0
                || i.user.first_name.toString().toLowerCase().indexOf(search) >= 0
                || i.user.username.toString().toLowerCase().indexOf(search) >= 0)
              && this.filterStatus(i)) {
              return true;
            }
        });
        return result;
      }
      return [];
    }
  },
  created: function() {
    if (this.getStudents == null) {
      this.fetchStudentList(0);
    } else {
      this.$store.dispatch(CHECK_STUDENTS_LIST);
    }
  },
  beforeDestroy () {
    if (typeof window !== 'undefined') {
      window.removeEventListener('resize', this.onResize, { passive: true })
    }
  },

  mounted () {
    this.onResize();
    window.addEventListener('resize', this.onResize, { passive: true });
  },
  
}
</script>