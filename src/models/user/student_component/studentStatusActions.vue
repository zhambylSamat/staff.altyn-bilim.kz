<template>
  <div style='position: relative; z-index: 1;'>
    <v-btn
      fab
      dark
      outlined
      x-small
      class='mx-1'
      color='info'
      @click.native='editProfile(item)'>
      <v-tooltip top>
        <template v-slot:activator="{on}">
          <v-icon v-on='on'>mdi-account-edit</v-icon>
        </template>
        <span>Анкетаны өзгерту</span>
      </v-tooltip>
    </v-btn>
    <v-btn
      fab
      outlined
      dark
      x-small
      class='mx-1'
      color="orange darken"
      @click="openStudentFreeze(item.user)">
      <v-tooltip top>
        <template v-slot:activator="{ on }">
          <v-icon v-on='on'>mdi-snowflake</v-icon>
        </template>
        <span>Оқушының замарозкасы</span>
      </v-tooltip>
    </v-btn>
    <v-btn
      fab
      dark
      x-small
      class='mx-1'
      color="green"
      v-if="item.student.has_payment"
      @click='payment(item.user.pk, "NO")'>
      <v-tooltip top>
        <template v-slot:activator="{ on }">
          <v-icon v-on='on'>mdi-currency-kzt</v-icon>
        </template>
        <span>Оплатасы жоқ</span>
      </v-tooltip>
    </v-btn>
    <v-btn
      fab
      dark
      x-small
      class='mx-1'
      color="orange darken-1"
      v-if="!item.student.has_payment"
      @click='payment(item.user.pk, "YES")'>
      <v-tooltip top>
        <template v-slot:activator="{ on }">
          <v-icon v-on='on'>mdi-currency-kzt</v-icon>
        </template>
        <span>Оплатасын өткізді</span>
      </v-tooltip>
    </v-btn>
    <v-btn
      fab
      dark
      x-small
      class='mx-1'
      color="indigo"
      v-if="item.student.has_contract"
      @click='contract(item.user.pk, "NO")'>
      <v-tooltip top>
        <template v-slot:activator="{ on }">
          <v-icon v-on='on'>mdi-file-document</v-icon>
        </template>
        <span>Договор өткізбеген</span>
      </v-tooltip>
    </v-btn>
    <v-btn
      fab
      dark
      x-small
      class='mx-1'
      color="orange darken-1"
      v-if="!item.student.has_contract"
      @click='contract(item.user.pk, "YES")'>
      <v-tooltip top>
        <template v-slot:activator="{ on }">
          <v-icon v-on='on'>mdi-file-document</v-icon>
        </template>
        <span>Договор өткізді</span>
      </v-tooltip>
    </v-btn>
    <v-btn fab dark x-small class='mx-1' color="red" @click='archive(item.user.pk)'>
      <v-tooltip top>
        <template v-slot:activator="{ on }">
          <v-icon v-on='on'>mdi-archive</v-icon>
        </template>
        <span>Архив</span>
      </v-tooltip>
    </v-btn>
  </div>
</template>


<script>

import {
  SET_STUDENT_PAYMENT_STATUS_ACTION,
  SET_STUDENT_CONTRACT_STATUS_ACTION
} from "@/store/actions.type.js";

export default {
  props: ['item', 'edit_student', 'student_freeze_list'],
  methods: {
    payment(pk, payment) {
      if (confirm("Оплатасы жоқпа?")) {
        var data = {
          student_pk: pk,
          has_payment: payment
        }
        this.$store.dispatch(SET_STUDENT_PAYMENT_STATUS_ACTION, data);
      }
    },
    contract(pk, contract) {
      if (confirm("Договор өткізілмегенба?")) {
        var data = {
          student_pk: pk,
          has_contract: contract
        }
        this.$store.dispatch(SET_STUDENT_CONTRACT_STATUS_ACTION, data);
      }
    },
    archive(pk) {
      if (confirm('Архивке жіберілуы керекпа?')) {
        console.log('archive', pk);
      }
    },
    editProfile(item) {
      this.edit_student(item);
    },
    openStudentFreeze(user_info) {
      this.student_freeze_list(user_info);
    }
  }
}
</script>