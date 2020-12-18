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
          :loading="loading_of_fetch_staffs"
          :custom-sort="customSort"
          item-key="user.pk">
          
          <template v-slot:item="{ index, item, headers }">
            <tr>
              <td v-for="n in headers" :key="n.value">

                <template v-if="n.value === 'staff_numeration'">
                  {{ index + 1 }}
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
                  <template v-if='item.staff.is_password_reset'><span class='font-italic font-weight-bold'>123456789</span></template>
                  <template v-else>
                    <template v-if="accessToEditProfile(item)">
                      <v-btn outlined color='indigo' x-small @click="resetPassword(item.user.pk)">Сбросить</v-btn>
                    </template>
                    <template v-else>
                      <v-icon>mdi-minus</v-icon>
                    </template>
                  </template>
                </template>

                <template v-else-if="n.value === 'role'">
                  {{ getRoleInfoByPrefix(item.user[n.value]).description }}
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
                      <StaffActions :item="item" :edit_staff="edit_staff" />
                    </v-speed-dial>
                  </template>
                  <template v-else>
                    <StaffActions :item="item" :edit_staff="edit_staff"/>
                  </template>
                </template>
              </td>
            </tr>
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
  RESET_STAFF_PASSWORD,
  GET_ROLES,
  GET_STAFF_LIST
} from "@/store/actions.type.js";
import StaffActions from "@/models/user/staff_component/staffActions.vue";
import { accessByRoleMixin } from "@/mixins/accessByRoleMixin.js";

export default {
  mixins: [ accessByRoleMixin ],
  components: {
    StaffActions,
  },
  props: ['edit_staff'],
  data() {
    return {
      headers: [
        {
          text: '#',
          value: 'staff_numeration'
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
          text: 'role',
          sortable: false,
          value: 'role'
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
      loading_of_fetch_staffs: false,
    }
  },
  methods: {
    resetPassword(staff_user_pk) {
      if (confirm("Сбрость пароль?")) {
        this.$store.dispatch(RESET_STAFF_PASSWORD, staff_user_pk);
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
    },
    fetchRolesAndStaff() {
      this.loading_of_fetch_staffs = false;
      this.$store.dispatch(GET_ROLES)
        .then(() => {
          this.$store.dispatch(GET_STAFF_LIST)
            .then(() => { this.loading_of_fetch_staffs = false; })
            .catch(() => { this.loading_of_fetch_staffs = false; })
        })
        .catch(() => { this.loading_of_fetch_staffs = false; })
    }
  },
  computed: {
    ...mapGetters(["getStaffs", "getRoleInfoByPrefix"]),
    filteredItems() {
      if (this.getStaffs.length > 0) {
        var result = this.getStaffs.filter((i) => {
          var search = this.search.toString().toLowerCase();
          if (i.user.last_name.toString().toLowerCase().indexOf(search) >= 0
                || i.user.first_name.toString().toLowerCase().indexOf(search) >= 0
                || i.user.username.toString().toLowerCase().indexOf(search) >= 0) {
              return true;
            }
        });
        return result;
      }
      return [];
    }
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
  created: function() {
    this.fetchRolesAndStaff();
  }
}
</script>
