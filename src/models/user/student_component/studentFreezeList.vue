<template>
  <v-dialog v-model='dialog' width="50%">
    <v-card v-if='user_info != null'>
      <v-card-title>
          <span class='headline'>Оқушының замарозкалары | {{ user_info.last_name }} {{ user_info.first_name }}</span>
          <v-spacer></v-spacer>
          <v-btn color="grey darken-1" class='headline font-weight-black' text @click="closeDialog()">X</v-btn>
        </v-card-title>
        <v-progress-linear v-if="loading.on_fetch_student_freeze_list" indeterminate color="primary"></v-progress-linear>
        <v-card-text v-else-if="user_info != null">
          <v-simple-table>
            <template v-slot:default>
              <tbody>
                <tr>
                  <td colspan='4'>
                    <v-btn block small color='info' @click='openStudentFreezeForm()'>+ оқушының замарозкасын енгізу</v-btn>
                  </td>
                </tr>
                <tr v-for="(val, i) in getCurrentStudentFreeze" :key="i">
                  <td>{{ i + 1 }}</td>
                  <td>{{ clearRange(val.from_date, val.to_date) }}</td>
                  <td>{{ val.comment }}</td>
                  <td>
                  <v-btn fab x-small outlined color='primary' @click='editStudentFreeze(val)'>
                    <v-tooltip top>
                      <template v-slot:activator="{on}">
                        <v-icon v-on='on'>mdi-lead-pencil</v-icon>
                      </template>
                      <span>Өзгерту</span>
                    </v-tooltip>
                  </v-btn>
                  <v-btn v-if="access_to_delete(val.from_date)" :loading='loading.on_delete_student_freeze' fab dark x-small class='mx-1' color="red" @click='deleteStudentFreeze(val.pk)'>
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
    <StudentFreezeForm ref='student_freeze_form' />
  </v-dialog>
</template>

<script>

import { mapGetters } from "vuex";
import { GET_STUDENT_FREEZE_LIST, DELETE_STUDENT_FREEZE } from "@/store/actions.type.js";
import StudentFreezeForm from "@/models/user/student_component/studentFreezeForm.vue";

export default {
  components: { StudentFreezeForm },
  data() {
    return {
      dialog: false,
      loading: {
        on_fetch_student_freeze_list: false,
        on_delete_student_freeze: false,
      },
      user_info: null
    }
  },
  methods: {
    openDialog(user_info) {
      this.user_info = user_info;
      this.dialog = true;
      this.fetchStudentFreeList(this.user_info.pk);
    },
    closeDialog() {
      this.dialog = false;
      this.user_info = null;
      this.loading.on_fetch_student_freeze_list = false;
      this.loading.on_delete_student_freeze = false;
    },
    fetchStudentFreeList(student_user_id) {
      this.loading.on_fetch_student_freeze_list = true;
      this.$store.dispatch(GET_STUDENT_FREEZE_LIST, student_user_id)
        .then(() => { this.loading.on_fetch_student_freeze_list = false; })
        .catch(() => { this.closeDialog(); })
    },
    editStudentFreeze(student_freeze) {
      this.$refs.student_freeze_form.editDialog(this.user_info, student_freeze);
    },
    deleteStudentFreeze(student_freeze_id) {
      if (confirm('Оқушының замарозкасын өшіруге сенімдісіңбе?')) {
        this.loading.on_delete_student_freeze = true;
        this.$store.dispatch(DELETE_STUDENT_FREEZE, student_freeze_id)
          .then(() => { this.loading.on_delete_student_freeze = false; })
          .catch(() => { this.closeDialog(); })
      }
    },
    openStudentFreezeForm() {
      this.$refs.student_freeze_form.openDialog(this.user_info);
    },
    formatDate (date) {
      if (!date) return null;
      const [year, month, day] = date.split('-');
      return `${day}.${month}.${year}`
    },
    clearRange(from_date, to_date) {
      return this.formatDate(from_date) + ' - ' + this.formatDate(to_date);
    },
    access_to_delete(from_date) {
      from_date = new Date(from_date);
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
    }
  },
  computed: {
    ...mapGetters(['getCurrentStudentFreeze'])
  }
}
</script>
