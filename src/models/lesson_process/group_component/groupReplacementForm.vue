<template>
  <v-dialog v-model='dialog' persistent max-width='50%'>
    <v-card v-if='dialog'>
      <v-card-title>
        <span class='headline'>Группаға замена н/се отменасын енгізу | {{ group_info.title }}</span>
        <v-spacer></v-spacer>
        <v-btn color="grey darken-1" class='headline font-weight-black' text @click="closeDialog()">X</v-btn>
      </v-card-title>
      <v-card-text>
        <v-form ref='form' :model='form' @submit.prevent="onSubmit(form)">
          <v-container>
            <v-row>
              <v-col cols='12' md='6' sm='6' xs=12>
                <v-menu
                  ref='menu'
                  v-model='menu'
                  :close-on-content-click="false"
                  transition="scale-transition"
                  offset-y
                  full-width
                  min-width="290px">
                  <template v-slot:activator="{ on }">
                    <v-combobox
                      v-model="beautifyDates"
                      label='Дата'
                      chips
                      autocomplete='off'
                      prepend-icon="mdi-calendar-month-outline"
                      hint="ДД.ММ.ГГГГ"
                      dense
                      v-on="on"></v-combobox>
                  </template>
                  <v-date-picker
                    ref='picker'
                    v-model="form_dates"
                    :max="availableToDate"
                    min="1980-01-01"
                    :disabled="is_edit"
                    :allowed-dates="allowedDates"
                    @update:picker-date="pickerUpdate($event)"
                    :first-day-of-week="1"
                    locale="ru"
                    multiple
                    @change="save"></v-date-picker>
                </v-menu>
              </v-col>
              <v-col>
                <v-autocomplete dense
                  autocomplete="off"
                  label="Мұғалім"
                  :items="getAllTeachers()"
                  item-text="full_name"
                  item-value='pk'
                  v-model="form.teacher"></v-autocomplete>
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
import { SET_GROUP_REPLACEMENT, EDIT_GROUP_REPLACEMENT } from "@/store/actions.type.js";

export default {
  data() {
    return {
      dialog: false,
      group_info: {
        pk: null,
        title: null,
        teacher_user_id: null,
        schedudle: null,
      },
      form_dates: [],
      form: {
        lesson_group: null,
        date: null,
        teacher: null,
      },
      menu: false,
      replacementDateRules: [
        v => !!v || ""
      ],
      availableDates: [],
      is_edit: false,
      submitLoading: false,
    }
  },
  methods: {
    openDialog(items) {
      this.group_info = items;
      this.dialog = true;
      this.form.lesson_group = this.group_info.pk;
    },
    editForm(data, group_info) {
      this.group_info = group_info;
      this.dialog = true;
      this.is_edit = true;
      this.form = data;
      this.form_dates = [this.form.date];
    },
    closeDialog() {
      this.group_info = {
        pk: null,
        title: null,
        teacher_user_id: null,
        schedudle: null,
      };
      this.form = {
        lesson_group: null,
        date: null,
        teacher: null,
      }
      this.is_edit = false;
      this.form_dates = [];
      this.dialog = false;
    },
    getAllTeachers() {
      var result = [
        {
          pk: null,
          full_name: 'Сабақ отмена'
        }
      ]
      this.getTeachers.forEach(elem => {
        if (elem.user.pk != this.group_info.teacher_user_id) {
          var tmp = {
            pk: elem.staff.pk,
            full_name: elem.user.last_name + ' ' + elem.user.first_name
          };
          result.push(tmp);
        }
      });
      return result;
    },
    getGroupSchedule(schedule_obj) {
      var weeks = [];
      schedule_obj.forEach(elem => {
        weeks.push(elem.week_num);
      });
      return weeks;
    },
    formatDate (date) {
      if (!date) return null;
      const [year, month, day] = date.split('-');
      return `${day}.${month}.${year}`
    },
    // validate() {
    //   if (this.$refs.form.validate()) {
    //     return true;
    //   }
    //   return false;
    // },
    save (date) {
      this.$refs.menu.save(date);
    },
    allowedDates(a) {
        return this.availableDates.includes(a);
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
    onSubmit(form) {
      if (this.form_dates.length > 0) {
        this.submitLoading = true;
        if (this.is_edit){
          this.$store.dispatch(EDIT_GROUP_REPLACEMENT, this.form)
            .then(() => { this.submitLoading = false; this.closeDialog(); })
            .catch(() => { this.submitLoading = false; this.closeDialog(); })
        } else {
          var forms = [];
          this.form_dates.forEach(elem => {
            this.form.date = elem;
            forms.push(Object.assign({}, form));
          });
          this.$store.dispatch(SET_GROUP_REPLACEMENT, forms)
            .then(() => { this.submitLoading = false; this.closeDialog(); })
            .catch(() => { this.submitLoading = false; this.closeDialog(); });
        }
      }
    },
  },
  computed: {
    ...mapGetters(['getSchedules', 'getTeachers']),
    availableToDate() {
      var date = new Date();
      return new Date(date.setMonth(date.getMonth()+1)).toISOString().substr(0,10);
    },
    beautifyDates() {
      var tmp = [];
      this.form_dates.forEach(elem => {
        tmp += this.formatDate(elem) + ', ';
      });
      return tmp;
    },
  },
  watch: {
    // menu (val) {
    //   val && setTimeout(() => (this.$refs.picker.activePicker = 'YEAR'));
    // },
  }
}
</script>
