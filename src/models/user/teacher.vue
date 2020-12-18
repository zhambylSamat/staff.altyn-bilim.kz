<!-- eslint-disable -->
<template>
  <v-app id='teacher'>
    <v-card class='mx-5 mt-3 py-3' width='98%' elevation="10">
      <v-btn outlined class='mx-2' color='primary' @click="openTeacherFormDialog">+ жаңа мұғалім</v-btn>
    </v-card>

    <TeacherList :edit_teacher="editTeacherFormDialog"/>


    <TeacherForm ref='teacherFormDialog'/>
  </v-app>
</template>
<!-- eslint-enable -->

<script>
import TeacherForm from "@/models/user/teacher_component/teacherForm.vue";
import TeacherList from "@/models/user/teacher_component/teacherList.vue";

export default {
  components: {
    TeacherForm,
    TeacherList
  },
  methods: {
    openTeacherFormDialog() {
      this.$refs.teacherFormDialog.openTeacherFormDialog();
    },
    editTeacherFormDialog(teacher) {
      this.$refs.teacherFormDialog.editTeacherFormDialog(teacher);
    }
  }
}
</script>
