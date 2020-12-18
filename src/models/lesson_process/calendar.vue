<!-- eslint-disable -->
<template>
  <div id='calendar'>
    <OfficeList :goToCalendarElement="goTo"/>
    <CalendarList ref="calendarList"/>
  </div>
</template>
<!-- eslint-enable -->

<script>

import OfficeList from "@/models/lesson_process/calendar_component/officeList.vue";
import CalendarList from "@/models/lesson_process/calendar_component/calendarList.vue";

export default {
  methods: {
    goTo(goto) {
      this.$refs.calendarList.goToElement(goto);
    }
  },
  components: {
    OfficeList,
    CalendarList,
  }
}
</script>
