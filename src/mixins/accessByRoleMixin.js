import { mapGetters } from "vuex";

export const accessByRoleMixin = {
  methods: {
    accessToEditProfile(item) {
      var current_user_role_info = this.getRoleInfoByPrefix(this.currentUser.role);
      var target_user_role_info = this.getRoleInfoByPrefix(item.user.role);
      if (this.currentUser.pk === item.user.pk) {
        return true;
      } else {
        return current_user_role_info.level < target_user_role_info.level;
      }
    },
    accessToChangeRole(item) {
      if (item.user.pk !== "") {
        var current_user_role_info = this.getRoleInfoByPrefix(this.currentUser.role);
        var target_user_role_info = this.getRoleInfoByPrefix(item.user.role);
        return current_user_role_info.level < target_user_role_info.level;
      }
      return true;
    }
  },
  computed: {
    ...mapGetters(["currentUser", "getStaffRoles", "getRoleInfoByPrefix"]),
  },
}