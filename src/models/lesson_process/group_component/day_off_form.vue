<template>
  <v-dialog v-model='dialog' max-width='50%'>
    <v-card>
      <v-card-title>
        <span class='headline'>Праздниктер н/се отменалар тізімі енгізу</span>
        <v-spacer></v-spacer>
        <v-btn color="grey darken-1" class='headline font-weight-black' text @click="closeDialog()">X</v-btn>
      </v-card-title>
      <v-card-text>
        <v-progress-circular v-if='loading_on_saving_form' :size="50" color="primary" indeterminate></v-progress-circular>
        <v-form v-if='form!=null' ref='form' :model='form' @submit.prevent="onSubmit(form)">
          <v-container>
            <v-row>
              <v-col cols='12'>
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
                    v-model="form.dates"
                    scrollable
                    min="1980-01-01"
                    :disabled="is_edit"
                    :first-day-of-week="1"
                    locale="ru"
                    multiple
                    @change="save">
                    <v-spacer></v-spacer>
                    <v-btn text color="primary" @click="$refs.menu.save(form.dates)">OK</v-btn>
                  </v-date-picker>
                </v-menu>
              </v-col>
              <v-col cols='12'>
                <v-text-field v-model='form.comment' label="Комментарий" :rules="commentRules"></v-text-field>
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

import { mapGetters } from "vuex";
import { ADD_DAY_OFF_LIST, EDIT_DAY_OFF } from '@/store/actions.type.js';

export default {
  data() {
    return {
      dialog: false,
      loading_on_saving_form: false,
      is_edit: false,
      form: null,
      day_off_pk: null,
      menu: false,
      commentRules: [ v => !!v || '' ]
    }
  },
  methods: {
    openDialog() {
      this.setForm(null);
      this.dialog = true;
    },
    editForm(data, day_off_pk) {
      this.is_edit = true;
      this.day_off_pk = day_off_pk;
      this.setForm(data);
      this.dialog = true;
    },
    closeDialog() {
      // this.$refs.form.reset();
      this.day_off_pk = null;
      this.form = null;
      this.is_edit = false;
      this.loading_on_saving_form = false;
      this.dialog = false;
    },
    setForm(data) {
      if (!this.is_edit) {
        this.form = {
          dates: [],
          comment: '',
        }
      } else {
        this.form = {
          dates: [data.date],
          comment: data.comment
        }
      }
    },
    validate() {
      if (this.$refs.form.validate()) {
        return true;
      }
      return false;
    },
    save (date) {
      this.$refs.menu.save(date);
    },
    onSubmit(form) {
      if (this.validate()) {
        var credentials = [];
        form.dates.forEach(elem => {
          var tmp = {
            pk: this.day_off_pk,
            date: elem,
            comment: form.comment
          };
          credentials.push(tmp);
        });
        if (this.is_edit){
          this.$store.dispatch(EDIT_DAY_OFF, credentials[0])
            .then(() => { this.closeDialog(); })
            .catch(() => { this.closeDialog(); });
        } else {
          this.$store.dispatch(ADD_DAY_OFF_LIST, credentials)
            .then(() => { this.closeDialog(); })
            .catch(() => { this.closeDialog(); });
        }
      }
    },
    formatDate (date) {
      if (!date) return null;
      const [year, month, day] = date.split('-');
      return `${day}.${month}.${year}`
    },
  },
  computed: {
    ...mapGetters(['getDayOffList']),
    beautifyDates() {
      var tmp = [];
      this.form.dates.forEach(elem => {
        tmp += this.formatDate(elem) + ', ';
      });
      return tmp;
    },
  }
}
</script>
