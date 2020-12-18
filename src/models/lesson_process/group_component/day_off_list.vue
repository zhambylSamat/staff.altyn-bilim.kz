<template>
  <v-dialog v-model='dialog' max-width='50%'>
    <v-card>
      <v-card-title>
        <span class='headline'>Праздниктер мен отменалар тізімі</span>
        <v-spacer></v-spacer>
        <v-btn color="grey darken-1" class='headline font-weight-black' text @click="closeDialog()">X</v-btn>
      </v-card-title>
      <v-card-text>
        <v-progress-circular v-if='loading_on_fetch_day_offs' :size="50" color="primary" indeterminate></v-progress-circular>
        <v-simple-table v-else>
          <template v-slot:default>
            <tbody>
              <tr>
                <td colspan="3">
                  <v-btn block color='info' @click='openDayOffForm()'>+ жаңа праздник н/се отмена</v-btn>
                </td>
              </tr>
              <tr v-for="(val, i) in getDayOffList" :key='i'>
                <td>{{ formatDate(val.date) }}</td>
                <td>{{ val.comment }}</td>
                <td>
                  <v-btn fab x-small outlined color='primary' @click='editDayOff(val, val.pk)'>
                    <v-tooltip top>
                      <template v-slot:activator="{on}">
                        <v-icon v-on='on'>mdi-account-edit</v-icon>
                      </template>
                      <span>Өзгерту</span>
                    </v-tooltip>
                  </v-btn>
                  <v-btn :loading='loading_on_delete' fab dark x-small class='mx-1' color="red" @click='remove(val.pk)'>
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
    <DayOffForm ref='dayOffForm' />
  </v-dialog>
</template>

<script>

import { mapGetters } from "vuex";
import { GET_DAY_OFF_LIST, DELETE_DAY_OFF } from "@/store/actions.type.js";
import DayOffForm from "@/models/lesson_process/group_component/day_off_form.vue";

export default {
  components: { DayOffForm },
  data() {
    return {
      dialog: false,
      loading_on_fetch_day_offs: false,
      loading_on_delete: false
    }
  },
  methods: {
    openDialog() {
      this.fetchDayOffList();
      this.dialog = true;
    },
    closeDialog() {
      this.loading_on_fetch_day_offs = false;
      this.loading_on_delete = false;
      this.dialog = false;
    },
    fetchDayOffList() {
      this.loading_on_fetch_day_offs = true;
      this.$store.dispatch(GET_DAY_OFF_LIST)
        .then(() => { this.loading_on_fetch_day_offs = false; })
        .catch(() => { this.closeDialog(); })
    },
    openDayOffForm() {
      this.$refs.dayOffForm.openDialog();
    },
    formatDate (date) {
      if (!date) return null;
      const [year, month, day] = date.split('-');
      return `${day}.${month}.${year}`
    },
    editDayOff(data, day_off_pk) {
      this.$refs.dayOffForm.editForm(data, day_off_pk);
    },
    remove(day_off_pk) {
      if (confirm("Вы уверены что хотите удалить?")) {
        this.loading_on_delete = true;
        this.$store.dispatch(DELETE_DAY_OFF, day_off_pk)
          .then(() => { this.loading_on_delete = false; })
          .catch(() => { this.loading_on_delete = false; });
      }
    }
  },
  computed: {
    ...mapGetters(['getDayOffList'])
  }
}
</script>
