<template>
  <div class="container-fluid g-0 m-0">
    <header class="row col-12 normalizar justify-content-center">
      <NavBar></NavBar>
      <h1 class="col col-10 text-center fw-bold my-2">
        My Submitted Projects
        <i class="fa-solid fa-diagram-project"></i>
      </h1>
    </header>

    <!-- MY PROJECTS -->
    <section class="row col-12 normalizar justify-content-center mt-2">
      <div v-if="myProjects.length != 0" class="row col-12">
        <div
          v-for="project in myProjects"
          :key="project.$id"
          class="col col-12 col-xl-2 mt-3"
        >
          <el-card
            shadow="always"
            style="border-radius: 15px; min-height: 100%"
          >
            <p class="text-center fw-bold">{{ project.name }}</p>
            <img
              v-if="project.image"
              :src="Server.loadLogo(project.image).toString()"
              style="width: 100%; height: 150px; border-radius: 15px"
            />

            <img
              v-else
              src="../../assets/no_image.png"
              style="width: 100%; height: 150px; border-radius: 15px"
            />
            <p class="text-justify mt-2">
              {{ project.description }}
            </p>
            <div class="row col-12 justify-content-center normalizar">
              <!-- <div class="col-6 text-center">
                <el-button
                  class="col col-5"
                  type="text"
                  @click="showService(project.homepage)"
                  ><i class="fa-solid fa-pen-to-square fa-2x"></i
                ></el-button>
              </div> -->
              <div class="col-6 text-center">
                <el-button
                  class="col col-5"
                  type="text"
                  @click="deleteProject(project)"
                >
                  <i class="fa-solid fa-trash-can fa-2x"></i>
                </el-button>
              </div>
            </div>
          </el-card>
        </div>
      </div>
      <div class="row col-10" v-else>
        <el-skeleton animated />
        <br />
        <el-skeleton animated style="--el-skeleton-circle-size: 100px">
          <template #template>
            <el-skeleton-item variant="circle" />
          </template>
        </el-skeleton>
      </div>
    </section>

    <Footer></Footer>
  </div>
</template>

<script lang="ts" setup>
// COMPONENTS
import Footer from "@/components/Footer.vue";
import NavBar from "@/components/NavBar.vue";
import { ElMessageBox } from "element-plus";

import { mainStore } from "@/store/store";
import { ref, onMounted } from "vue";
// import mixins from "@/mixins";
import Server from "../../services/server";
import { Project } from "@/models/Project";

const store = mainStore();
const myProjects = ref<Project[]>([]);

onMounted(async () => {
  try {
    await loadProjects();
  } catch (error) {
    return;
  }
});

async function loadProjects() {
  try {
    myProjects.value.length = 0;
    myProjects.value = await Server.getProjectsByUser(store.id);
  } catch (error) {
    return;
  }
}

async function deleteProject(selectedProject: Project) {
  ElMessageBox.confirm(
    "This Project will permanently delete. Continue?",
    "Project Delete",
    {
      confirmButtonText: "OK",
      cancelButtonText: "Cancel",
      type: "warning",
    }
  ).then(async () => {
    try {
      await Server.deleteProject(selectedProject);
      await loadProjects();
      ElMessageBox.alert(
        "The project has been successfully deleted",
        "Success",
        {
          confirmButtonText: "OK",
          showClose: false,
          type: "success",
        }
      );
    } catch (error) {
      ElMessageBox.alert("Error trying to delete project", "Error", {
        confirmButtonText: "OK",
        showClose: false,
        type: "error",
      });
    }
  });
}
</script>
