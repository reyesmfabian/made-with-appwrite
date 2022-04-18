<template>
  <div class="container-fluid g-0 m-0">
    <header class="row col-12 normalizar justify-content-center">
      <NavBar></NavBar>
      <h1 class="col col-10 text-center fw-bold my-2">
        Admin Dashboard
        <i class="fa-solid fa-diagram-project"></i>
      </h1>
    </header>

    <!-- SUBMITTED PROJECTS -->
    <section class="row col-12 normalizar justify-content-center mt-2">
      <div class="col col-11 col-xl-8 mx-auto">
        <h3 class="text-center">Submitted Projects</h3>
        <div class="row col-12 normalizar justify-content-center">
          <div class="col col-8 col-xl-6 text-center mx-auto my-2 normalizar">
            <el-input
              v-model="search"
              size="small"
              placeholder="Type to search"
            />
          </div>
          <!-- <div class="col col-3 col-xl-3 mx-auto my-auto text-center">
            <el-button type="primary" size="small">Invite Admin</el-button>
          </div> -->
        </div>
        <el-table
          :data="filterProjects"
          stripe
          border
          class="mx-1"
          :default-sort="{ prop: 'active', order: 'ascending' }"
        >
          <el-table-column label="Name" class="text-center">
            <template #default="scope">
              <div>
                <span>{{ scope.row.name }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="Links">
            <template #default="scope">
              <div style="display: flex; align-items: center">
                <el-button
                  v-if="scope.row.repository"
                  class="col col-5"
                  type="text"
                  @click="showService(scope.row.repository)"
                  ><i class="fa-brands fa-github fa-2x"></i
                ></el-button>
                <el-button
                  v-if="scope.row.homepage"
                  class="col col-5"
                  type="text"
                  @click="showService(scope.row.homepage)"
                  ><i class="fa-solid fa-link fa-2x"></i
                ></el-button>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="Is Active" prop="active" sortable>
            <template #default="scope">
              <el-tag class="ml-2" type="info">{{ scope.row.active }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="Actions">
            <template #default="scope">
              <el-button
                v-if="scope.row.active"
                size="small"
                type="success"
                class="col col-12 col-xl-3 mx-1"
                @click="enableDisableProject(scope.row, !scope.row.active)"
                >Disable</el-button
              >
              <el-button
                v-else
                size="small"
                type="info"
                class="col col-12 col-xl-3 mx-1"
                @click="enableDisableProject(scope.row, !scope.row.active)"
                >Enable</el-button
              >
              <el-button
                size="small"
                type="primary"
                class="col col-12 col-xl-3 mx-1"
                @click="openProject(scope.row)"
                >Show</el-button
              >
              <el-button
                size="small"
                type="danger"
                class="col col-12 col-xl-3 mx-1"
                @click="deleteProject(scope.row)"
                >Delete</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </div>

      <el-dialog
        v-model="showProject"
        title="Project Details"
        width="80%"
        :before-close="
          () => {
            showProject = false;
          }
        "
      >
        <section class="row col-12 normalizar justify-content-center">
          <div class="col col-12 col-xl-6 text-center">
            <el-card
              shadow="always"
              style="border-radius: 15px; min-height: 100%"
            >
              <h4 class="text-center fw-bold">{{ selectedProject.name }}</h4>
              <img
                v-if="selectedProject.image"
                :src="Server.loadLogo(selectedProject.image).toString()"
                style="width: 100%; height: 150px; border-radius: 15px"
              />

              <img
                v-else
                src="../../assets/no_image.png"
                style="width: 100%; height: 150px; border-radius: 15px"
              />
              <p class="text-justify mt-2">
                {{ selectedProject.description }}
              </p>
              <div class="row col-12 justify-content-center normalizar">
                <div class="col-6 text-center" v-if="selectedProject.homepage">
                  <p class="normalizar">WebPage</p>
                  <el-button
                    class="col col-5"
                    type="text"
                    @click="showService(selectedProject.homepage)"
                    ><i class="fa-solid fa-link fa-2x"></i
                  ></el-button>
                </div>
                <div
                  class="col-6 text-center"
                  v-if="selectedProject.repository"
                >
                  <p class="normalizar">Repository</p>
                  <el-button
                    class="col col-5"
                    type="text"
                    @click="showService(selectedProject.repository)"
                    ><i class="fa-brands fa-github fa-2x"></i
                  ></el-button>
                </div>
              </div>
              <p class="normalizar mt-2">
                <strong>License: </strong>{{ selectedProject.license }}
              </p>
              <p class="normalizar fw-bold mt-2">Appwrite Services:</p>
              <el-tag
                v-for="(service, index) in Convert.toServices(
                  selectedProject.services
                )"
                :key="index"
                class="mx-1 mt-1"
                type="info"
                @click="showService(service.url)"
                style="cursor: pointer"
                >{{ service.name }}</el-tag
              >
            </el-card>
          </div>
        </section>
      </el-dialog>
    </section>

    <Footer></Footer>
  </div>
</template>

<script lang="ts" setup>
// COMPONENTS
import Footer from "@/components/Footer.vue";
import NavBar from "@/components/NavBar.vue";
import { ElMessageBox } from "element-plus";

import { ref, onMounted, computed } from "vue";
// import mixins from "@/mixins";
import Server from "../../services/server";
import { Project, Convert } from "@/models/Project";

const allProjects = ref<Project[]>([]);
const selectedProject = ref<Project>();
const showProject = ref<boolean>(false);
const search = ref("");
onMounted(async () => {
  try {
    await loadProjects();
  } catch (error) {
    return;
  }
});

async function loadProjects() {
  try {
    allProjects.value.length = 0;
    allProjects.value = await Server.getAllProjects();
  } catch (error) {
    return;
  }
}
function showService(url: string) {
  window.open(url, "_blank");
}
function openProject(openProject: Project) {
  showProject.value = true;
  selectedProject.value = openProject;
}
const filterProjects = computed(() =>
  allProjects.value.filter(
    (data) =>
      !search.value ||
      data.name.toLowerCase().includes(search.value.toLowerCase())
  )
);
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

async function enableDisableProject(
  selectedProject: Project,
  isEnable: boolean
) {
  let action: string = isEnable ? "Enabled" : "Disabled";
  ElMessageBox.confirm(
    `This Project will permanently ${action}. Continue?`,
    "Project Change",
    {
      confirmButtonText: "OK",
      cancelButtonText: "Cancel",
      type: "warning",
    }
  ).then(async () => {
    try {
      await Server.enableDisableProject(selectedProject, isEnable);
      await loadProjects();
      ElMessageBox.alert(
        `The project has been successfully ${action}`,
        "Success",
        {
          confirmButtonText: "OK",
          showClose: false,
          type: "success",
        }
      );
    } catch (error) {
      ElMessageBox.alert("Error trying to modify the project", "Error", {
        confirmButtonText: "OK",
        showClose: false,
        type: "error",
      });
    }
  });
}
</script>
