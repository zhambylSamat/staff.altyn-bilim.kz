<template>
  <div>
    <div v-if="student_visit != null">
      <v-icon v-if="student_visit.attendance" color='success'>mdi-plus</v-icon>
      <v-icon v-else color='error'>mdi-minus</v-icon>
      <span class='subtitle-1'> | </span>
      <!-- <v-icon v-if="!student_visit.attendance || student_visit.no_home_work" color='gray'>mdi-minus</v-icon> -->
      <span v-if='!student_visit.attendance'>N/A</span>
      <span v-else>{{ student_visit.home_work }}</span>
    </div>
    <div v-else>
      -
    </div>
  </div>
</template>

<script>
export default {
  props: ['student_visit']
}
</script>
