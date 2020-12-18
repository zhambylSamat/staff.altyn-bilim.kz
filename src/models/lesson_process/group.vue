<!-- eslint-disable -->
<template>
  <div id='group'>
    <GroupList :key='groupListComponentKey' @re_render_from_group_list="reRenderGroupList()"  :open_visit_log="openVisitLog" />
    <VisitLog ref="visit_log" />
  </div>
</template>
<!-- eslint-enable -->

<script>

import { mapGetters } from "vuex";
import { GET_TEACHER_LIST, GET_SCHEDULE_LIST } from "@/store/actions.type.js";
import GroupList from "@/models/lesson_process/group_component/groupList.vue";
import VisitLog from "@/models/lesson_process/group_component/visit_log.vue";
// import GroupStudentForm from '@/models/lesson_process/group_component/groupStudentForm.vue';

export default {
  components: { VisitLog, GroupList },
  data() {
    return {
      groupListComponentKey: 0
    }
  },
  methods: {
    reRenderGroupList() {
      this.groupListComponentKey++;
    },
    openVisitLog(group_id, group_title) {
      this.visit_log = {
        group_id: group_id,
        group_title: group_title
      };
      this.$refs.visit_log.openDialog(group_id, group_title);
    },
  },
  computed: {
    ...mapGetters(["getTeachers", "getSchedules"])
  },
  created: function() {
    if (this.getTeachers.length == 0) {
      this.$store.dispatch(GET_TEACHER_LIST);
    }
    if (this.getSchedules.length == 0) {
      this.$store.dispatch(GET_SCHEDULE_LIST);
    }
  }
}
</script>
