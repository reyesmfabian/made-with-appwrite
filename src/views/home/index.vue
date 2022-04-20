<template>
  <div class="container-fluid g-0 m-0">
    <header class="row col-12 normalizar justify-content-center">
      <NavBar></NavBar>
      <h1 class="col col-10 text-center fw-bold my-3">
        Made With <span style="color: #f02e65">Appwrite</span>
        <i class="fa-solid fa-heart-pulse"></i>
      </h1>
      <h3 class="col col-10 text-center">
        An accurate and verified list of production-ready projects made with
        Appwrite
      </h3>
    </header>

    <!-- OPEN SOURCE PROJECTS -->
    <section class="row col-12 normalizar justify-content-center mt-4">
      <h2 class="col col-10 text-center fw-bold">Open Source Projects</h2>
      <hr class="col-10" />
      <div v-if="openProjects.length != 0" class="row col-12">
        <div
          v-for="project in openProjects"
          :key="project.$id"
          class="col col-12 col-md-6 col-lg-4 col-xl-3 mt-3"
        >
          <el-card
            shadow="always"
            style="border-radius: 15px; min-height: 100%"
          >
            <h4 class="text-center fw-bold">{{ project.name }}</h4>
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
              <div class="col-6 text-center" v-if="project.homepage">
                <p class="normalizar">WebPage</p>
                <el-button
                  class="col col-5"
                  type="text"
                  @click="showService(project.homepage)"
                  ><i class="fa-solid fa-link fa-2x"></i
                ></el-button>
              </div>
              <div class="col-6 text-center" v-if="project.repository">
                <p class="normalizar">Repository</p>
                <el-button
                  class="col col-5"
                  type="text"
                  @click="showService(project.repository)"
                  ><i class="fa-brands fa-github fa-2x"></i
                ></el-button>
              </div>
            </div>
            <p class="normalizar mt-2">
              <strong>License: </strong>{{ project.license }}
            </p>
            <p class="normalizar fw-bold mt-2">Appwrite Services:</p>
            <el-tag
              v-for="(service, index) in Convert.toServices(project.services)"
              :key="index"
              class="mx-1 mt-1"
              type="info"
              @click="showService(service.url)"
              style="cursor: pointer"
              >{{ service.name }}</el-tag
            >
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

    <!-- COMMERCIAL PROJECTS -->
    <section class="row col-12 normalizar justify-content-center mt-4">
      <h2 class="col col-10 text-center fw-bold">Commercial Projects</h2>
      <hr class="col-10" />
      <div v-if="commercialProjects.length != 0" class="row col-12">
        <div
          v-for="project in commercialProjects"
          :key="project.$id"
          class="col col-12 col-md-6 col-lg-4 col-xl-3 mt-3"
        >
          <el-card
            shadow="always"
            style="border-radius: 15px; min-height: 100%"
          >
            <h4 class="text-center fw-bold">{{ project.name }}</h4>
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
              <div class="col-6 text-center" v-if="project.homepage">
                <p class="normalizar">WebPage</p>
                <el-button
                  class="col col-5"
                  type="text"
                  @click="showService(project.homepage)"
                  ><i class="fa-solid fa-link fa-2x"></i
                ></el-button>
              </div>
              <div class="col-6 text-center" v-if="project.repository">
                <p class="normalizar">Repository</p>
                <el-button
                  class="col col-5"
                  type="text"
                  @click="showService(project.repository)"
                  ><i class="fa-brands fa-github fa-2x"></i
                ></el-button>
              </div>
            </div>
            <p class="normalizar mt-2">
              <strong>License: </strong>{{ project.license }}
            </p>
            <p class="normalizar fw-bold mt-2">Appwrite Services:</p>
            <el-tag
              v-for="(service, index) in Convert.toServices(project.services)"
              :key="index"
              class="mx-1 mt-1"
              type="info"
              @click="showService(service.url)"
              style="cursor: pointer"
              >{{ service.name }}</el-tag
            >
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
import { onMounted, ref } from "vue";
import { Project, Convert } from "@/models/Project";
import Server from "../../services/server";

const openProjects = ref<Project[]>([]);
const commercialProjects = ref<Project[]>([]);

onMounted(async () => {
  try {
    openProjects.value = await Server.getOpenProjects();
    commercialProjects.value = await Server.getCommercialProjects();
  } catch (error) {
    return;
  }
});

function showService(url: string) {
  window.open(url, "_blank");
}
</script>
