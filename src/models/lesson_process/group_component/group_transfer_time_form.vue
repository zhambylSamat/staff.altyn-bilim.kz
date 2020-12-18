<template>
  <v-dialog v-model='dialog' max-width="50%">
    <v-card v-if='form != null'>
      <v-card-title>
        <span class='headline'>{{ group_info.title }}</span>
        <v-spacer></v-spacer>
        <v-btn color="grey darken-1" class='headline font-weight-black' text @click="closeDialog()">X</v-btn>
      </v-card-title>
      <v-card-text>
        <v-form ref='form' :model='form' @submit.prevent='onSubmit(form)'>
          <v-container>
            <v-row>
              <v-col cols='12' md='6' sm='6' xs='12'>
                <v-menu
                  ref='menu'
                  v-model='menu_from'
                  transition="scale-transition"
                  offset-y
                  full-width
                  min-width="290px">
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      v-model="computedFromDateFormatted"
                      label='Ауыстыру керек күн'
                      :rules="fromDateRules"
                      prepend-icon="mdi-calendar-month-outline"
                      hint="ДД.ММ.ГГГГ"
                      readonly
                      v-on="on"></v-text-field>
                  </template>
                  <v-date-picker
                    ref='picker'
                    :allowed-dates="allowedDates"
                    v-model="form.from_date"
                    scrollable
                    min="1980-01-01"
                    :disabled="is_edit"
                    :first-day-of-week="1"
                    locale="ru"
                    @update:picker-date="pickerUpdate($event)"
                    @change="save">
                    <v-spacer></v-spacer>
                  </v-date-picker>
                </v-menu>
              </v-col>
              <v-col cols='12' md='6' sm='6' xs='12'>
                <v-menu
                  ref='menu'
                  v-model='menu_to'
                  transition="scale-transition"
                  offset-y
                  full-width
                  min-width="290px">
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      v-model="computedToDateFormatted"
                      label='Сабақ болатын күн'
                      :rules="toDateRules"
                      prepend-icon="mdi-calendar-month-outline"
                      hint="ДД.ММ.ГГГГ"
                      readonly
                      v-on="on"></v-text-field>
                  </template>
                  <v-date-picker
                    ref='picker'
                    v-model="form.to_date"
                    scrollable
                    min="1980-01-01"
                    :disabled="is_edit"
                    :first-day-of-week="1"
                    locale="ru"
                    @change="save">
                    <v-spacer></v-spacer>
                  </v-date-picker>
                </v-menu>
              </v-col>
              <v-col cols='12'>
                <v-spacer></v-spacer>
                <v-btn type='submit' color='success'>Сақтау</v-btn>
                <v-btn outlined color='warning' class='ml-4' small @click="closeDialog()">Отмена</v-btn>
              </v-col>
            </v-row>
          </v-container>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>

import { ADD_GROUP_TIME_TRANSFER } from "@/store/actions.type.js";

export default {
  data() {
    return {
      dialog: false,
      form: null,
      group_info: {
        pk: null,
        title: null,
        schedule: null
      },
      availableDates: [],
      is_edit: false,
      menu_from: false,
      menu_to: false,
      loading_on_save_form: false,
      fromDateRules: [ v => !!v || "" ],
      toDateRules: [ v => !!v || "" ],
    }
  },
  methods: {
    openDialog(group_info) {
      this.group_info.pk = group_info.pk;
      this.group_info.title = group_info.title;
      this.group_info.schedule = group_info.schedule;
      this.setForm(this.group_info.pk);
      this.dialog = true;
    },
    closeDialog() {
      this.form = null,
      this.group_info.pk = null;
      this.group_info.title = null;
      this.loading_on_save_form = false;
      this.dialog = false;
    },
    save (date) {
      this.$refs.menu.save(date);
    },
    setForm(lesson_group_pk) {
      if (!this.is_edit) {
        this.form = {
          pk: null,
          lesson_group: lesson_group_pk,
          from_date: null,
          to_date: null
        }
      }
    },
    validate() {
      if (this.$refs.form.validate()) {
        return true;
      }
      return false;
    },
    onSubmit(form) {
      this.loading_on_save_form = true;
      if (this.validate()) {
        this.$store.dispatch(ADD_GROUP_TIME_TRANSFER, form)
          .then(() => { this.closeDialog(); })
          .catch(() => { this.closeDialog(); })
      }
    },
    formatDate (date) {
      if (!date) return null;
      const [year, month, day] = date.split('-');
      return `${day}.${month}.${year}`
    },
    allowedDates(a) {
        return this.availableDates.includes(a);
    },
    getGroupSchedule(schedule_obj) {
      var weeks = [];
      schedule_obj.forEach(elem => {
        weeks.push(elem.week_num);
      });
      return weeks;
    },
    daysInMonth(month, year) {
      return new Date(year, month, 0).getDate(); 
    },
    pickerUpdate: function(val) {
      var date_arr = val.split('-');
      var yearSelected = parseInt(date_arr[0]);
      let monthSelected = parseInt(date_arr[1]);
      let totalDay = new Date(yearSelected, monthSelected, 0).getDate();
      
      let availableDates = []
      for (let i = 1; i <= totalDay; i++) {
          let date = new Date(yearSelected, monthSelected-1, i);
          if (this.getGroupSchedule(this.group_info.schedule).includes(date.getDay())) {
            date.setDate(date.getDate() + 1);
            availableDates.push(date.toISOString().substring(0,10))
          }
      }
      this.availableDates = availableDates;
      this.allowedDates();
    },
  },
  computed:  {
    computedFromDateFormatted() {
      return this.formatDate(this.form.from_date);
    },
    computedToDateFormatted() {
      return this.formatDate(this.form.to_date);
    }
  }
}
</script>
