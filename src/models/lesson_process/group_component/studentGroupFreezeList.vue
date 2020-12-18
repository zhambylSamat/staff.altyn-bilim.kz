<template>
  <v-dialog v-model='dialog' width="50%">
    <v-card v-if='full_name != null'>
      <v-card-title>
          <span class='headline'>Оқушының замарозкалары | {{ full_name }}</span>
          <v-spacer></v-spacer>
          <v-btn color="grey darken-1" class='headline font-weight-black' text @click="closeDialog()">X</v-btn>
        </v-card-title>
        <v-progress-linear v-if="loading.on_fetch_student_group_freeze_list" indeterminate color="primary"></v-progress-linear>
        <v-card-text v-else-if="full_name != null">
          <v-simple-table>
            <template v-slot:default>
              <tbody>
                <tr>
                  <td colspan='4'>
                    <v-btn v-if="!add_form" block small color='info' @click='openStudentGroupFreezeForm()'>+ оқушының замарозкасын енгізу</v-btn>
                    <v-form v-else ref='form' :model='form' @submit.prevent="">
                      <v-container>
                        <v-row>
                          <v-col cols='3'>
                            <span class='subtitle-1'>{{ new Date().toISOString().substr(0,10) }}</span>
                          </v-col>
                          <v-col cols='9'>
                            <v-text-field v-model='form.comment' dense label='Коммент' :rules="commentRules"></v-text-field>
                          </v-col>
                        </v-row>
                        <v-row>
                          <v-col cols='12'>
                            <v-spacer></v-spacer>
                            <v-btn small color='success' @click='onSubmit(form)' :loading="loading.on_save">Сақтау</v-btn>
                            <v-btn outlined small color='warning' class='ml-2' @click="cancelForm()">Отмена</v-btn>
                          </v-col>
                        </v-row>
                      </v-container>
                    </v-form>
                  </td>
                </tr>
                <tr v-for="(val, i) in getCurrentStudentGroupFreeze" :key="i">
                  <td>{{ i + 1 }}</td>
                  <td>{{ formatDate(val.date) }}</td>
                  <td>{{ val.comment }}</td>
                  <td>
                    <v-btn v-if="accessToDelete(val.date)" :loading='loading.on_delete_student_group_freeze' fab dark x-small class='mx-1' color="red" @click='deleteStudentGroupFreeze(val.pk)'>
                      <v-tooltip top>
                        <template v-slot:activator="{ on }">
                          <v-icon v-on='on'>mdi-trash-can</v-icon>
                        </template>
                        <span>Удалить</span>
                      </v-tooltip>
                    </v-btn>
                  </td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>

import { mapGetters } from "vuex";
import { GET_STUDENT_GROUP_FREEZE_LIST, CREATE_STUDENT_GROUP_FREEZE, DELETE_STUDENT_GROUP_FREEZE } from "@/store/actions.type.js";

export default {
  data() {
    return {
      dialog: false,
      loading: {
        on_fetch_student_group_freeze_list: false,
        on_delete_student_group_freeze: false,
        on_save: false
      },
      lesson_group_student_id: null,
      full_name: null,
      add_form: false,
      form: null,
      commentRules: [ v => !!v || "" ],
    }
  },
  methods: {
    openDialog(lesson_group_student_id, full_name) {
      this.dialog = true;
      this.lesson_group_student_id = lesson_group_student_id;
      this.full_name = full_name;
      console.log('lesson_group_student_id', this.lesson_group_student_id);
      this.fetchStudentGroupFreezeList(this.lesson_group_student_id);
      this.setForm(this.lesson_group_student_id);
    },
    closeDialog() {
      this.dialog = false;
      this.loading.on_save = false;
      this.loading.on_fetch_student_group_freeze_list = false;
      this.loading.on_delete_student_group_freeze = false;
      this.lesson_group_student_id = null;
      this.add_form = false;
      this.form = null;
      this.full_name = false;
    },
    deleteStudentGroupFreeze(student_group_freeze_id) {
      if (confirm("Оқушының замарозкасын өшіруге келісесінба?")) { 
        this.loading.on_delete_student_group_freeze = false;
        this.$store.dispatch(DELETE_STUDENT_GROUP_FREEZE, student_group_freeze_id)
          .then(() => { this.loading.on_delete_student_group_freeze = false; })
          .catch(() => { this.closeDialog(); })
      }
    },
    validate() {
      if (this.$refs.form.validate()) {
        return true;
      }
      return false;
    },
    onSubmit(form) {
      if (this.validate()) {
        this.loading.on_save = true;
        this.$store.dispatch(CREATE_STUDENT_GROUP_FREEZE, form)
          .then(() => { this.cancelForm(); })
          .catch(() => { this.cancelForm(); })
      }
    },
    cancelForm() {
      this.setForm(null);
      this.loading.on_save = false;
      this.add_form = false;
    },
    openStudentGroupFreezeForm() {
      this.add_form = true;
    },
    setForm(lesson_group_student_id) {
      this.loading.on_save = false;
      this.form = {
        date: new Date().toISOString().substr(0,10),
        comment: '',
        lesson_group_student: lesson_group_student_id == null ? null : lesson_group_student_id
      }
    },
    formatDate (date) {
      if (!date) return null;
      const [year, month, day] = date.split('-');
      return `${day}.${month}.${year}`
    },
    fetchStudentGroupFreezeList(lesson_group_student_id) {
      this.loading.on_fetch_student_group_freeze_list = true;
      this.$store.dispatch(GET_STUDENT_GROUP_FREEZE_LIST, lesson_group_student_id)
        .then(() => { this.loading.on_fetch_student_group_freeze_list = false; })
        .catch(() => { this.cancelForm(); });
    },
    accessToDelete(date) {
      var freeze_date = new Date(date);
      var today = new Date();
      var freeze_year = freeze_date.getFullYear();
      var freeze_month = freeze_date.getMonth();
      var freeze_day = freeze_date.getDate();

      var today_year = today.getFullYear();
      var today_month = today.getMonth();
      var today_day = today.getDate();
      return (freeze_year == today_year && freeze_month == today_month && freeze_day == today_day);
    }
  },
  computed: {
    ...mapGetters(['getCurrentStudentGroupFreeze']),
  }
}
</script>
