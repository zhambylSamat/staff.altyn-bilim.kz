<!-- eslint-disable -->
<template>
  <v-row justify="center">
    <v-dialog v-model="staffForm" persistent max-width='30%'>
      <v-card>
        <v-card-title>
          <span class='headline'>Қызметкерлердің анкетасы</span>
          <v-spacer></v-spacer>
          <v-btn color="grey darken-1" class='headline font-weight-black' text @click="closeStaffFormDialog">X</v-btn>
        </v-card-title>
        <v-card-text>
          <v-form ref='form' :model='form' @submit.prevent="onSubmit(form)">
            <v-container>
              <v-row>
                <v-col cols='12'>
                  <v-text-field v-model="form.user.last_name" dense label='Тегі' :readonly="is_readonly" :rules="firstNameRules"></v-text-field>
                  <v-text-field v-model="form.user.first_name" dense label='Аты' :readonly="is_readonly" :rules="lastNameRules"></v-text-field>
                  <v-text-field v-model="form.user.username" dense label='Username' :readonly="is_readonly" :rules="usernameRules"></v-text-field>
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
                        label='Туылған күні'
                        prepend-icon="mdi-calendar-month-outline"
                        hint="ДД.ММ.ГГГГ"
                        readonly
                        v-on="on"></v-text-field>
                    </template>
                    <v-date-picker
                      ref='picker'
                      v-model="form.staff.dob"
                      :max="new Date().toISOString().substr(0,10)"
                      min="1980-01-01"
                      :first-day-of-week="1"
                      locale="ru"
                      :readonly="is_readonly"
                      @change="save"></v-date-picker>
                  </v-menu>
                  <v-select
                    v-if="accessToChangeRole(form)"
                    :items="getStaffRolesByCurrentUserLevel"
                    label='Роль'
                    item-text="description"
                    item-value="prefix"
                    :rules="roleRules"
                    dense
                    :readonly="is_readonly"
                    v-model="form.user.role" requried></v-select>
                </v-col>
              </v-row>
            </v-container>
            <v-divider></v-divider>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue-grey lighten-1" text @click="closeStaffFormDialog()">Отмена</v-btn>
              <v-btn v-if="!is_readonly" color="blue darken-1" :loading="submitLoading" type='submit' outlined>Сақтау</v-btn>
            </v-card-actions>
          </v-form>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn v-if="is_readonly && accessToEditProfile(form)" color="orange darken-1" outlined @click="accessToEdit()">Изменить</v-btn>
          </v-card-actions>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-row>
</template>
<!-- eslint-enable -->

<script>

import { mapGetters } from "vuex";
import { CREATE_STAFF, UPDATE_STAFF } from "@/store/actions.type.js";
import { accessByRoleMixin } from "@/mixins/accessByRoleMixin.js";

export default {
  mixins: [ accessByRoleMixin ],
  data() {
    return {
      staffForm: false,
      is_readonly: false,
      is_edit: false,
      form: {},
      submitLoading: false,
      menu: false,
      firstNameRules: [
        v => !!v || ''
      ],
      lastNameRules: [
        v => !!v || ''
      ],
      usernameRules: [
        v => !!v || ''
      ],
      roleRules: [
        v => !!v || ""
      ],
    }
  },
  methods: {
    openStaffFormDialog() {
      this.is_readonly = false;
      this.is_edit = false;
      this.staffForm = true;
      this.setDefaultForm();
    },
    editStaffFormDialog(staff) {
      this.form = staff;
      this.is_readonly = true;
      this.is_edit = true;
      this.staffForm = true;
    },
    accessToEdit() {
      this.is_readonly = false;
    },
    closeStaffFormDialog() {
      this.staffForm = false;
    },
    setDefaultForm() {
      this.form = {
        user: {
          pk: '',
          first_name: '',
          last_name: '',
          username: '',
          role: null,
        },
        staff: {
          pk: '',
          dob: null
        }
      }
    },
    save (date) {
      this.$refs.menu.save(date);
    },
    formatDate (date) {
      if (!date) return null;
      const [year, month, day] = date.split('-');
      return `${day}.${month}.${year}`
    },
    validate() {
      if (this.$refs.form.validate()) {
        return true;
      }
      return false;
    },
    onSubmit(form) {
      if (this.validate()) {
        this.submitLoading = true;
        if (this.is_edit) {
          this.$store.dispatch(UPDATE_STAFF, form)
            .then(() => {
              this.closeStaffFormDialog();
              this.submitLoading = false;
            })
            .catch(() => {
              this.closeStaffFormDialog();
              this.submitLoading = false;
            });
        } else {
          this.$store.dispatch(CREATE_STAFF, form)
            .then(() => {
              this.closeStaffFormDialog();
              this.submitLoading = false;
            })
            .catch(() => {
              this.closeStaffFormDialog();
              this.submitLoading = false;
            });
        }
      }
    }
  },
  watch: {
    menu (val) {
      val && setTimeout(() => (this.$refs.picker.activePicker = 'YEAR'));
    },
    date () {
      this.form.staff.dob = this.formatDate(this.date);
    }
  },
  computed: {
    computedDateFormatted () {
      return this.formatDate(this.form.staff.dob)
    },
    ...mapGetters(["getStaffRoles", "getStaffRolesByCurrentUserLevel"]),
  },
  created() {
    this.setDefaultForm();
  }
}
</script>
