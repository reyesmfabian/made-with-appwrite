<template>
  <div id="app" class="custom-class">
    <router-view />
  </div>
</template>

<style lang="scss">
@import url("https://fonts.googleapis.com/css2?family=Nunito:wght@600&display=swap");
@import url("https://fonts.googleapis.com/css2?family=Dosis:wght@400;700&display=swap");
@import url("https://fonts.googleapis.com/css2?family=Lato:wght@400;700&display=swap");

#app {
  font-family: "Lato", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: #f8f8f8;
}

.normalizar {
  --bs-gutter-y: 0;
  --bs-gutter-x: 0;
  margin: 0;
}

.custom-class {
  --el-color-primary: #0a6fb4;
}
.text-button {
  color: #0a6fb4 !important;
  font-weight: bold;
  cursor: pointer;
}
html{
  background-color: #0a6fb4;
}
</style>
