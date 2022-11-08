<template>
  <div id="app" style="min-width: 1536px">
    <router-view />
    <el-backtop />
  </div>
</template>

<script>
export default {
  name: "app",
  mounted() {
    window.addEventListener("unload", () => {
      window.sessionStorage.setItem("state", JSON.stringify(this.$store.state));
    });
    window.addEventListener("load", () => {
      window.sessionStorage.removeItem("state");
    });
  },
  beforeDestroy() {
    window.removeEventListener("unload");
    window.removeEventListener("load");
  },
};
</script>
