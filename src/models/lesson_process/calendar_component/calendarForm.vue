<!-- eslint-disable -->
<template>
  <div id='calendar-form'>
    <v-row justify="center">
      <v-dialog v-model="calendarForm" persistent max-width='30%'>
        <v-card>
          <v-card-title>
            <span class='headline'>Сабақ кесетсін құрастыру</span>
            <v-spacer></v-spacer>
            <v-btn color="grey darken-1" class='headline font-weight-black' text @click="closeCalendarForm()">X</v-btn>
          </v-card-title>
          <v-card-text>
            <v-form ref='form' :model='form' @submit.prevent="onSubmit(form)">
              <v-container>
                <v-row>
                  <v-col cols='12'>
                    coming soon...
                  </v-col>
                </v-row>
              </v-container>
              <v-divider></v-divider>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue-grey lighten-1" text @click="closeCalendarForm()">Отмена</v-btn>
                <v-btn color="blue darken-1" :loading="submitLoading" type='submit' outlined>Сақтау</v-btn>
              </v-card-actions>
            </v-form>
            <!-- <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn v-if="is_readonly" color="orange darken-1" outlined @click="accessToEdit()">Изменить</v-btn>
            </v-card-actions> -->
          </v-card-text>
        </v-card>
      </v-dialog>
    </v-row>
  </div>
</template>
<!-- eslint-enable -->

<script>

// import { CREATE_TEACHER, UPDATE_TEACHER } from "@/store/actions.type.js";

export default {
  data() {
    return {
      calendarForm: false,
      form: {},
      submitLoading: false,
    }
  },
  methods: {
    openCalendarForm() {
      this.calendarForm = true;
      this.setDefaultForm();
    },
    closeCalendarForm() {
      this.calendarForm = false;
    },
    setDefaultForm() {
      this.form = {};
    },
    onSubmit(form) {
      console.log('clicked onSubmit', form);
    }
  },
  created() {
    this.setDefaultForm();
  }
}
</script>
