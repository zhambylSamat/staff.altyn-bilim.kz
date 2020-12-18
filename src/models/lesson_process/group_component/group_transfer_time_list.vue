<template>
  <v-dialog v-model='dialog' max-width='50%'>
    <v-card>
      <v-card-title>
        <span class='headline'>Группаның ауысқан сабақ уақыттары | {{ group_info.title }}</span>
        <v-spacer></v-spacer>
        <v-btn color="grey darken-1" class='headline font-weight-black' text @click="closeDialog()">X</v-btn>
      </v-card-title>
      <v-card-text>
        <div v-if="loading_on_fetch_group_transfer_time" class='center'>
          <v-progress-circular :size="50" color="primary" indeterminate></v-progress-circular>
        </div>
        <v-simple-table v-else>
          <template v-slot:default>
            <tbody>
              <tr>
                <td colspan='2'>
                  <v-btn block color='info' @click='openGroupTransferTime(group_info)'>Группаның уақытын ауыстыру</v-btn>
                </td>
              </tr>
              <tr v-for="(val, i) in getGroupTimeTransferList" :key="i">
                <td>
                  <span class='subtitle-1'>{{ formatDate(val.from_date) }}</span>
                  &nbsp;
                  <v-icon>mdi-arrow-right</v-icon>
                  &nbsp;
                  <span class='subtitle-1'>{{ formatDate(val.to_date) }}</span>
                </td>
                <td>
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
    <GroupTransferTimeForm ref="groupTransferTimeForm" />
  </v-dialog>
</template>

<script>

import { mapGetters } from "vuex";
import { GET_GROUP_TIME_TRANSFER, DELETE_GROUP_TIME_TRANSFER } from "@/store/actions.type.js";
import GroupTransferTimeForm from '@/models/lesson_process/group_component/group_transfer_time_form.vue';

export default {
  components: { GroupTransferTimeForm },
  data() {
    return {
      dialog: false,
      group_info: {
        pk: null,
        title: null,
        schedule: null,
      },
      loading_on_fetch_group_transfer_time: false,
      loading_on_delete: false
    }
  },
  methods: {
    openDialog(group_id, group_title, schedule) {
      this.group_info.pk = group_id;
      this.group_info.title = group_title;
      this.group_info.schedule = schedule;
      this.fetchGroupTimeTransfer(this.group_info.pk);
      this.dialog = true;
    },
    closeDialog() {
      this.group_info.pk = null;
      this.group_info.title = null;
      this.loading_on_fetch_group_transfer_time = false;
      this.dialog = false;
    },
    fetchGroupTimeTransfer(lesson_group_id) {
      this.loading_on_fetch_group_transfer_time = true;
      this.$store.dispatch(GET_GROUP_TIME_TRANSFER, lesson_group_id)
        .then(() => { this.loading_on_fetch_group_transfer_time = false; console.log(this.getGroupTimeTransferList); })
        .catch(() => { this.loading_on_fetch_group_transfer_time = false; });
    },
    openGroupTransferTime(group_info) {
      this.$refs.groupTransferTimeForm.openDialog(group_info);
    },
    formatDate (date) {
      if (!date) return null;
      const [year, month, day] = date.split('-');
      return `${day}.${month}.${year}`
    },
    remove(group_time_transfer_id) {
      if (confirm("Вы уверены что хотите удалить?")) {
        this.loading_on_delete = true;
        this.$store.dispatch(DELETE_GROUP_TIME_TRANSFER, group_time_transfer_id)
          .then(() => { this.loading_on_delete = false; })
          .catch(() => { this.loading_on_delete = false; });
      }
    }
  },
  computed: {
    ...mapGetters(['getGroupTimeTransferList']),
  }
}
</script>
