<!-- eslint-disable -->
<template> 
  <v-container>
    <v-row no-gutters justify='center'>
      <v-col cols='12' xs='12' sm='3' offset-sm='9' md='3' offset-md='9' class='mb-4'>
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
        <v-data-table
          :headers="headers"
          :items="filteredItems"
          sort-by="last_name"
          :sort-desc="false"
          class='elevation-1'
          :items-per-page="-1"
          hide-default-footer
          show-expand
          :loading="loading_on_fetch_teachers"
          :custom-sort="customSort"
          item-key="user.pk">
          
          <template v-slot:item="{ index, item, headers, expand, isExpanded }">
            <tr>
              <td v-for="n in headers" :key="n.value">

                <template v-if="n.value === 'teacher_numeration'">
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
                    <span>Оқушысы опрос толтырмаған</span>
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
                  <template v-if='item.staff.is_password_reset'><span class='font-italic font-weight-bold'>12345678</span></template>
                  <template v-else>
                    <v-btn outlined color='indigo' x-small @click="resetPassword(item.user.pk)">Сбросить</v-btn>
                  </template>
                </template>

                <template v-else-if="n.value === 'data-table-expand'">
                  <v-btn small color='indigo--text' @click="expand(!isExpanded); showTeacherGroups(item.user.pk, isExpanded);">
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
                      <TeacherActions :item="item" :edit_teacher="edit_teacher" />
                    </v-speed-dial>
                  </template>
                  <template v-else>
                    <TeacherActions :item="item" :edit_teacher="edit_teacher"/>
                  </template>
                </template>
              </td>
            </tr>
          </template>

          <template v-slot:expanded-item="{ headers }"> <!-- item -->
            <td :colspan="headers.length">
              <!-- <template v-if="item.staff.group !== undefined">
                <TeacherGroups :teacher_pk="item.user.pk"/>
              </template>
              <template v-else>
                Загрузка...
                <v-progress-linear indeterminate color="indigo"></v-progress-linear>
              </template> -->
              Раздел в разработке... (Бұл жерде мұғалімнің группалар тізімі тұрады)
            </td>
          </template>

        </v-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>
<!-- eslint-enable -->

<script>

import { mapGetters } from "vuex";
import {
  GET_TEACHER_LIST,
  // GET_STUDENT_PLAN,
  RESET_TEACHER_PASSWORD
} from "@/store/actions.type.js";
// import TeacherGroups from "@/models/user/student_component/studentPlans.vue";
import TeacherActions from "@/models/user/teacher_component/teacherActions.vue";

export default {
  components: {
    // TeacherGroups,
    TeacherActions,
  },
  props: ['edit_teacher'],
  data() {
    return {
      headers: [
        {
          text: '#',
          value: 'teacher_numeration'
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
      loading_on_fetch_teachers: false
    }
  },
  methods: {
    showTeacherGroups(teacher_user_pk, isExpanded) {
      console.log(teacher_user_pk, isExpanded);
      // if (!isExpanded) {
      //   this.$store.dispatch(GET_TEACHER_GROUPS, teacher_user_pk);
      // }
    },
    resetPassword(teacher_user_pk) {
      if (confirm("Сбрость пароль?")) {
        this.$store.dispatch(RESET_TEACHER_PASSWORD, teacher_user_pk);
      }
    },
    onResize () {
      this.isMobile = window.innerWidth < 600
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
    }
  },
  computed: {
    ...mapGetters(["getTeachers"]),
    filteredItems() {
      var result = this.getTeachers.filter((i) => {
        var search = this.search.toString().toLowerCase();
        if (i.user.last_name.toString().toLowerCase().indexOf(search) >= 0
              || i.user.first_name.toString().toLowerCase().indexOf(search) >= 0
              || i.user.username.toString().toLowerCase().indexOf(search) >= 0) {
            return true
          }
      });
      return result;
    }
  },
  created: function() {
    this.loading_on_fetch_teachers = true;
    this.$store.dispatch(GET_TEACHER_LIST)
      .then(() => {
        this.loading_on_fetch_teachers = false;
      })
      .catch(() => {
        this.loading_on_fetch_teachers = false;
      });
  },
  beforeDestroy () {
    if (typeof window !== 'undefined') {
      window.removeEventListener('resize', this.onResize, { passive: true })
    }
  },
  mounted () {
    this.onResize()
    window.addEventListener('resize', this.onResize, { passive: true })
  },
}
</script>
