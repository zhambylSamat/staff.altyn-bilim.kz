<!-- eslint-disable -->
<template>
  <v-app id='staff'>
    <v-card class='mx-5 mt-3 py-3' width='98%' elevation="10">
      <v-btn outlined class='mx-2' color='primary' @click="openStaffFormDialog">+ жаңа қызметкер</v-btn>
    </v-card>

    <StaffList :edit_staff="editStaffFormDialog" />


    <StaffForm ref='staffFormDialog'/>
  </v-app>
</template>
<!-- eslint-enable -->

<script>
import StaffForm from "@/models/user/staff_component/staffForm.vue";
import StaffList from "@/models/user/staff_component/staffList.vue";

export default {
  components: {
    StaffForm,
    StaffList
  },
  methods: {
    openStaffFormDialog() {
      this.$refs.staffFormDialog.openStaffFormDialog();
    },
    editStaffFormDialog(staff) {
      this.$refs.staffFormDialog.editStaffFormDialog(staff);
    }
  }
}
</script>
