<template>
  <v-dialog v-model='dialog' max-width="50%">
    <v-card v-if='form != null && user_info != null'>
      <v-card-title>
        <span class='headline'>{{ user_info.last_name }} {{ user_info.first_name }}</span>
        <v-spacer></v-spacer>
        <v-btn color="grey darken-1" class='headline font-weight-black' text @click="closeDialog()">X</v-btn>
      </v-card-title>
      <v-card-text>
        <v-form ref='form' :model='form'>
          <v-container>
            <v-row>
              <v-col cols='12' md='6' sm='6' xs='12'>
                <v-date-picker
                  ref='picker'
                  v-model="computedRange"
                  :min="getMinDate"
                  :first-day-of-week="1"
                  locale="ru"
                  range>
                </v-date-picker>
              </v-col>
              <v-col cols='12' md='6' sm='6' xs='12'>
                <v-text-field v-model='form.comment' dense label='Коммент' :rules="commentRules"></v-text-field>
                <v-spacer></v-spacer>
                <v-btn small color='success' @click='onSubmit(form)' :loading="loading.on_save">Сақтау</v-btn>
                <v-btn outlined small color='warning' class='ml-2' @click="closeDialog()">Отмена</v-btn>
              </v-col>
            </v-row>
          </v-container>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>

import { CREATE_STUDENT_FREEZE, EDIT_STUDENT_FREEZE } from '@/store/actions.type.js';

export default {
  data() {
    return {
      dialog: false,
      form: null,
      user_info: null,
      loading: {
        on_save: false
      },
      is_edit: false,
      commentRules: [ v => !!v || "" ],
      rangeDateRules: [ v => !!v || "" ],
    }
  },
  methods: {
    openDialog(user_info) {
      this.user_info = user_info;
      this.setForm(this.user_info);
      this.dialog = true;
    },
    editDialog(user_info, data) {
      this.user_info = user_info;
      this.is_edit = true;
      this.setForm(this.user_info, data);
      this.dialog = true;
    },
    closeDialog() {
      this.dialog = false;
      this.loading.on_save = false;
      this.form = null;
      this.is_edit = false;
      this.user_info = null;
    },
    setForm(user_info, data) {
      if (!this.is_edit) {
        this.form = {
          student: user_info.pk,
          from_date: null,
          to_date: null,
          range: [],
          comment: '',
        }
      } else {
        this.form = {
          pk: data.pk,
          student: user_info.pk,
          from_date: data.from_date,
          to_date: data.to_date, // not important may be null
          range: [data.from_date, data.to_date],
          comment: data.comment
        };
      }
    },
    validate() {
      if (this.$refs.form.validate()) {
        return true;
      }
      return false;
    },
    onSubmit(form) {
      if (this.validate() && form.range.length == 2) {
        form = this.clearForm(form);
        console.log('form', form);
        this.loading.on_save = true;
        if (form.pk === undefined) {
          this.$store.dispatch(CREATE_STUDENT_FREEZE, form)
            .then(() => { this.closeDialog(); })
            .catch(() => { this.closeDialog(); });
        } else {
          this.$store.dispatch(EDIT_STUDENT_FREEZE, form)
            .then(() => { this.closeDialog(); })
            .catch(() => { this.closeDialog(); });
        }
      }
    },
    clearForm(form) {
      if (form.range.length == 2) {
        var date_1 = new Date(form.range[0]);
        var date_2 = new Date(form.range[1]);
        if (date_1 > date_2) {
          form.from_date = date_2.toISOString().substr(0,10);
          form.to_date = date_1.toISOString().substr(0,10);
        } else {
          form.from_date = date_1.toISOString().substr(0,10);
          form.to_date = date_2.toISOString().substr(0,10);
        }
      }
      return form;
    },
  },
  computed: {
    getMinDate() {
      var date = new Date().setDate(new Date().getDate() - 1);
      return new Date(date).toISOString().substr(0,10);
    },
    computedRange: {
      get() {
        return this.form.range;
      },
      set([first_date, second_date]) {
        if (this.access_to_select_from_date || !this.is_edit) {
          if (this.form.range.length == 0 || this.form.range.length == 2) {
            this.form.range = [first_date];
          } else if (this.form.range.length == 1) {
            this.form.range.push(second_date);
          }
        } else {
          this.form.range = [this.form.from_date, first_date];
        }
      },
    },
    access_to_select_from_date() {
      var from_date = new Date(this.form.from_date);
      var today = new Date();
      var from_year = from_date.getFullYear();
      var from_month = from_date.getMonth();
      var from_day = from_date.getDate();

      var today_year = today.getFullYear();
      var today_month = today.getMonth();
      var today_day = today.getDate();
      if (from_year <= today_year && from_month <= today_month && from_day <= (today_day - 1)) {
        return false;
      }
      return true;
    },
  }
}
</script>
