<!-- eslint-disable -->
<template>
  <v-simple-table dense>
    <template v-slot:default>
      <tbody>
        <tr v-if="plans == null">
          Загрузка плана...
          <v-progress-linear indeterminate color="indigo"></v-progress-linear>
        </tr>
        <tr v-else v-for="(val, index) in plans" :key="index">
          <td><v-btn text small color='primary' @click="editPlan(student_pk, val.pk)">Жоспар: {{ val.subject_info.title }}</v-btn></td>
          <td colspan='4'></td>
          <td>{{ val.progress }}%</td>
        </tr>
        <tr>
          <td colspan='6'><v-btn x-small outlined color='indigo' @click="addNewPlan()">+ жоспар енгізу</v-btn></td>
        </tr>
      </tbody>
    </template>
  </v-simple-table>
</template>
<!-- eslint-enable -->

<script>

import { mapGetters } from "vuex";
import { SYNC_STUDENT_PLAN_ACTION_BY_STUDENT_ID } from "@/store/actions.type.js"

export default {
  props: ['student_pk', 'newPlanAction', 'editPlanAction'],
  data() {
    return {
      plans: null
    }
  },
  methods: {
    addNewPlan() {
      this.newPlanAction(this.student_pk);
    },
    editPlan(student_pk, student_plan_pk) {
      this.editPlanAction(student_pk, student_plan_pk);
    }
  },
  computed: {
    ...mapGetters(["getStudentPlansByUserPk"]),
  },
  created: function()  {
    this.plan = [];
    this.$store.dispatch(SYNC_STUDENT_PLAN_ACTION_BY_STUDENT_ID, {student_user_pk: this.student_pk})
      .then(() => {
        this.plans = this.getStudentPlansByUserPk(this.student_pk);
      });
  }
}
</script>
