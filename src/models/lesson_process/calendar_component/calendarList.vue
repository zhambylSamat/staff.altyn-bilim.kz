<template>
  <div id='calendar-list'>
    <v-container>
      <v-row no-gutters justify="center">
        <v-col cols='12'>
          <v-card class='mx-auto mb-4' elevation='5'>
            <v-btn text color='primary' @click="newCalendar()">+ Жаңа сабақ кестесі</v-btn>
          </v-card>
          <v-card v-for="(office, i) in sortedSchedule" :key="i" class='px-4 py-2 mb-4' :id="'office-'+office[0]">
            <p class='title'>{{ office[1].title }}</p>
            <v-simple-table>
              <template v-slot:default>
                <tbody>
                  <template v-for="(week, j) in office[1].weeks">
                    <tr :key="j+''+i">
                      <td style='width: 10%;' :rowspan="week.times.length + 1">{{week.title}}</td>
                    </tr>
                    <template v-for="(time, k) in week.times">
                      <tr :key="k+''+j+''+i">
                        <td style='width: 30%'>{{ time.start_time }} - {{ time.finish_time }}</td>
                        <td style='width: 60%;' v-if="time.group != null">{{ group }}</td>
                        <td style='width: 60%;' v-else>N/A</td>
                      </tr>
                    </template>
                    <tr :key="j+''+i+'empty'">
                      <td colspan='3' style='height: 0px; border:none; border-top:1px solid black !important;'></td>
                    </tr>
                  </template>
                </tbody>
              </template>
            </v-simple-table>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <CalendarForm ref="calendarForm"/>
  </div>
</template>

<script>

import { mapGetters } from "vuex";
import { GET_SCHEDULE_LIST } from "@/store/actions.type.js";
import CalendarForm from "@/models/lesson_process/calendar_component/calendarForm.vue";

export default {
  components: { CalendarForm },
  data() {
    return {
      targetTo: '',
    }
  },
  methods: {
    setTarget(target) {
      this.targetTo = target;
    },
    goToElement(id) {
      this.targetTo = id;
      if (this.getBeautifiedSchedules[id] !== undefined) {
        this.$vuetify.goTo(this.target, this.options);
      }
    },
    newCalendar() {
      this.$refs.calendarForm.openCalendarForm();
    },
  },
  computed: {
    ...mapGetters(['getSchedules']),
    target () {
      const value = '#office-'+this.targetTo;
      return value
    },
    options () {
      return {
        duration: 1000,
        offset: 0,
        easing: 'easeInOutCubic',
      }
    },
    getBeautifiedSchedules() {
      var result = {};
      this.getSchedules.forEach(elem => {
        if (result[elem.office] === undefined) {
          result[elem.office.toString()] = {
            title: elem.office_info.title,
            weeks: {}
          }
        }
        if (result[elem.office].weeks[elem.week_num] === undefined) {
          result[elem.office].weeks[elem.week_num] = {
            title: elem.week_day_info.title,
            times: []
          }
        }
        result[elem.office].weeks[elem.week_num].times.push({
            start_time: elem.start_time,
            finish_time: elem.finish_time,
            group: elem.group
          });
      });
      return result;
    },
    sortedSchedule() {
      var schedules = this.getBeautifiedSchedules;
      var result = Object.keys(schedules).map(function(key) {
        return [key, schedules[key]];
      });
      return result.sort((a, b) => {
        return a[1].title.localeCompare(b[1].title);
      });
    }
  },
  created: function() {
    this.$store.dispatch(GET_SCHEDULE_LIST);
  }
}
</script>

<style scoped>
  td {
    border: 1px solid lightgray;
  }
</style>
