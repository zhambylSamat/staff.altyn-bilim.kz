<!-- eslint-disable -->
<template>
  <v-app id='student'>
    <v-card class='mx-5 mt-3 py-3' width='98%' elevation="10">
      <v-btn outlined class='mx-2' color='primary' @click="openStudentFormDialog">+ жаңа оқушы</v-btn>
      <v-btn outlined class='mx-2' color='primary'>Хабарландыру</v-btn> 
    </v-card>

    <StudentList :edit_student="editStudentFormDialog" :newPlanAction="openStudentPlanFormDialog" :editPlanAction="editStudentPlanAction" />


    <StudentForm ref='studentFormDialog'/>
    <StudentPlanForm ref='studentPlanFormDialog'/>
  </v-app>
</template>
<!-- eslint-enable -->

<script>
import StudentForm from "@/models/user/student_component/studentForm.vue";
import StudentList from "@/models/user/student_component/studentList.vue";
import StudentPlanForm from "@/models/user/student_component/studentPlanForm.vue";

export default {
  components: {
    StudentForm,
    StudentList,
    StudentPlanForm
  },
  methods: {
    openStudentFormDialog() {
      this.$refs.studentFormDialog.openStudentFormDialog();
    },
    editStudentFormDialog(student) {
      this.$refs.studentFormDialog.editStudentFormDialog(student);
    },
    openStudentPlanFormDialog(student_pk) {
      this.$refs.studentPlanFormDialog.openStudentPlanFormDialog(student_pk);
    },
    editStudentPlanAction(student_pk, student_plan_pk) {
      this.$refs.studentPlanFormDialog.editStudentPlanFormDialog(student_pk, student_plan_pk);
    }
  }
}
</script>
