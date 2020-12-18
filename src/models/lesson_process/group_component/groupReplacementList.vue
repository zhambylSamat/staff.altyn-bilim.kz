<template>
  <v-dialog v-model="dialog" max-width='50%'>
    <v-card>
      <v-card-title>
        <span class='headline'>Замена немесе отменалар тізімі | {{ group_info.title }}</span>
        <v-spacer></v-spacer>
        <v-btn color="grey darken-1" class='headline font-weight-black' text @click="closeDialog()">X</v-btn>
      </v-card-title>
      <v-card-text>
        <div v-if="loading_on_fetch_group_replace_list" class='text-center'>
          <v-progress-circular :size="50" color="primary" indeterminate></v-progress-circular>
        </div>
        <v-simple-table v-else>
          <template v-slot:default>
            <tbody>
              <tr>
                <td>#</td>
                <td colspan="3">
                  <v-btn block small color='info' @click='addGroupReplacement(group_info)'>Группаға замена н/се отменасын енгізу</v-btn>
                </td>
              </tr>
              <tr v-for="(val, i) in getGroupReplaceList" :key='i'>
                <td>{{ i+1 }}</td>
                <td>{{ formatDate(val.date) }}</td>
                <td>
                  <span v-if="val.teacher == null">
                    Сабақ отмена
                  </span>
                  <span v-else>
                    Замена: {{ val.user_info.last_name }} {{ val.user_info.first_name }}
                  </span>
                </td>
                <td>
                  <v-btn v-if='val.teacher != null || true' fab x-small outlined color='primary' @click='editGroupReplacement(val, group_info)'>
                    <v-tooltip top>
                      <template v-slot:activator="{on}">
                        <v-icon v-on='on'>mdi-account-edit</v-icon>
                      </template>
                      <span>Өзгерту</span>
                    </v-tooltip>
                  </v-btn>
                  <span v-else>Өзгертуге болмайды</span>
                  <v-btn :loading='loading_on_delete' fab dark x-small class='mx-1' color="red" @click='remove(val.pk, val.date, group_info.title)'>
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
import { GET_GROUP_REPLACE_LIST, DELETE_GROUP_REPLACEMENT } from "@/store/actions.type.js";

export default {
  props: ['open_group_replacement_form', 'edit_group_replacement_form'],
  data() {
    return {
      dialog: false,
      group_info: {
        pk: null,
        title: null,
        teacher_user_id: null,
        schedule: null,
      },
      loading_on_fetch_group_replace_list: false,
      loading_on_delete: false,
    }
  },
  methods: {
    openDialog(items) {
      this.group_info.pk = items.group_id;
      this.group_info.title = items.group_title;
      this.group_info.teacher_user_id = items.teacher_user_id;
      this.group_info.schedule = items.schedule;
      this.dialog = true;
      this.fetchGroupReplaceList(this.group_info.pk);
    },
    closeDialog() {
      this.group_info = {
        pk: null,
        title: null
      };
      this.dialog = false;
    },
    formatDate (date) {
      if (!date) return null;
      const [year, month, day] = date.split('-');
      return `${day}.${month}.${year}`
    },
    fetchGroupReplaceList(group_id) {
      this.loading_on_fetch_group_replace_list = true;
      this.$store.dispatch(GET_GROUP_REPLACE_LIST, group_id)
        .then(() => { this.loading_on_fetch_group_replace_list = false;})
        .catch(() => { this.loading_on_fetch_group_replace_list = false; this.closeDialog() });
    },
    addGroupReplacement(group_info) {
      this.open_group_replacement_form(group_info);
    },
    editGroupReplacement(data, group_info) {
      this.edit_group_replacement_form(data, group_info);
    },
    remove(group_replacement_pk, date, group_title) {
      if (confirm("Вы точно хотите удалить за: " + this.formatDate(date) + "? Группа: " + group_title)) {
        this.loading_on_delete = true;
        this.$store.dispatch(DELETE_GROUP_REPLACEMENT, group_replacement_pk)
          .then(() => { this.loading_on_delete = false; })
          .catch(() => { this.loading_on_delete = false; this.closeDialog(); });
      }
    }
  },
  computed: {
    ...mapGetters(['getGroupReplaceList'])
  }
}
</script>
