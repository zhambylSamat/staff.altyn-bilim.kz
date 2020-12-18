<template>
  <div id='office_list'>
    <v-container>
      <v-row no-gutters justify='center'>
        <v-col cols='12'>
          <v-card class='mx-auto' elevation="5">
            <v-list>
              <v-list-item v-for="(item, i) in getOfficeList" :key="i" @click="goTo(item.pk)"> <!-- setTarget('#suda'); $vuetify.goTo(target, options) -->
                <v-list-item-content>
                  <v-list-item-title v-text="'Кабинет: ' + item.title"></v-list-item-title>
                </v-list-item-content>
                <v-list-item-content>
                  <v-list-item-title v-text="'Мұғалімдер: N/A'"></v-list-item-title>
                </v-list-item-content>
                <v-list-item-content>
                  <v-list-item-title v-text="'Группалар: N/A'"></v-list-item-title>
                </v-list-item-content>
                <v-list-item-content>
                  <v-list-item-title v-text="'Оқушылар: N/A'"></v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-list-item v-if='!cabinetForm'>
                <v-list-item-title @click="openCabinetForm()" class='primary--text' v-text="'+ Жаңа кабинет'"></v-list-item-title>
              </v-list-item>
              <v-list-item v-else>
                <v-form ref='form' :model='form' @submit.prevent='onSubmit(form)' style='width: 100%;'>
                  <v-container>
                    <v-row>
                      <v-col cols='2'>
                        <v-text-field v-model='form.title' dense label='Кабинет' :rules='officeRule'></v-text-field>
                      </v-col>
                      <v-col cols='6'>
                        <v-btn color="blue darken-1" small type='submit' :loading="submitLoading" outlined>Сақтау</v-btn>
                        <v-btn color="blue-grey lighten-1" small text @click="closeCabinetForm()">Отмена</v-btn>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-form>
              </v-list-item>
            </v-list>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>

import { GET_OFFICE_LIST, SET_OFFICE } from "@/store/actions.type.js";
import { mapGetters } from "vuex";

export default {
  props: ['goToCalendarElement'],
  data() {
    return {
      cabinetForm: false,
      submitLoading: false,
      form: {
        title: ''
      },
      officeRule: [
        v => !!v || '',
      ]
    }
  },
  methods: {
    openCabinetForm() {
      this.form.title = '';
      this.cabinetForm = true;
    },
    closeCabinetForm() {
      this.cabinetForm = false;
    },
    onSubmit(form) {
      if (this.validate()) {
        this.submitLoading = true;
        this.$store.dispatch(SET_OFFICE, form)
          .then(() => { 
            this.submitLoading = false;
            this.cabinetForm = false;
          })
          .catch(() => {
            this. submitLoading = false;
          });
      }
    },
    validate() {
      if (this.$refs.form.validate()) {
        return true;
      }
      return false;
    },
    goTo(goto) {
      this.goToCalendarElement(goto);
    }
  },
  computed: {
    ...mapGetters(["getOfficeList"])
  },
  created: function() {
    this.$store.dispatch(GET_OFFICE_LIST);
  }
}
</script>
