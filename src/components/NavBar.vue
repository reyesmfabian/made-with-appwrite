<template>
  <nav class="navbar navbar-expand-lg navbar-light px-2">
    <button
      class="navbar-toggler"
      type="button"
      data-bs-toggle="collapse"
      data-bs-target="#navbarNav"
      aria-controls="navbarNav"
      aria-expanded="false"
      aria-label="Toggle navigation"
    >
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse justify-content-end" id="navbarNav">
      <ul class="navbar-nav">
        <li class="nav-item">
          <a
            class="nav-link text-button"
            href="/"
            style="text-decoration: none"
          >
            Home
          </a>
        </li>
        <li class="nav-item" v-if="store.connected">
          <a
            class="nav-link text-button"
            @click="showSubmit = true"
            style="text-decoration: none"
          >
            Submit Project
          </a>
        </li>
        <li class="nav-item" v-if="store.connected">
          <a
            class="nav-link text-button"
            href="/my-projects"
            style="text-decoration: none; cursor: pointer"
          >
            My Projects
          </a>
        </li>
        <li class="nav-item" v-if="store.connected && store.isAdmin">
          <a
            class="nav-link text-button"
            href="/dashboard"
            style="text-decoration: none; cursor: pointer"
          >
            Dashboard
          </a>
        </li>
        <li
          class="nav-item"
          data-bs-target=".navbar-collapse.show"
          data-bs-toggle="collapse"
          v-if="!store.connected"
        >
          <a
            class="nav-link text-button"
            style="text-decoration: none"
            @click="showRegister = true"
          >
            Register
          </a>
        </li>
        <li
          v-if="store.connected"
          class="nav-item"
          data-bs-target=".navbar-collapse.show"
          data-bs-toggle="collapse"
        >
          <a
            class="nav-link text-button"
            style="text-decoration: none; color: #f02e65 !important"
            @click="Server.logout()"
          >
            Sign Out
          </a>
        </li>
        <li
          v-else
          class="nav-item"
          data-bs-target=".navbar-collapse.show"
          data-bs-toggle="collapse"
        >
          <a
            class="nav-link text-button"
            style="text-decoration: none"
            @click="showLogin = true"
          >
            Login
          </a>
        </li>
      </ul>
    </div>
  </nav>

  <!-- REGISTER DIALOG -->
  <el-dialog
    v-model="showRegister"
    title="Create an account"
    :width="isMobile() ? '80%' : '40%'"
    :before-close="
      () => {
        showRegister = false;
      }
    "
  >
    <section class="row col-12">
      <el-form
        ref="registerFormRef"
        :model="registerForm"
        :rules="registerRules"
        label-width="120px"
        class="demo-registerForm"
        size="default"
      >
        <el-form-item label="Name:" prop="name">
          <el-input v-model="registerForm.name" />
        </el-form-item>
        <el-form-item label="E-Mail:" prop="email">
          <el-input v-model="registerForm.email" />
        </el-form-item>
        <el-form-item label="Password:" prop="password">
          <el-input
            type="password"
            show-password
            v-model="registerForm.password"
          />
        </el-form-item>
      </el-form>
    </section>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="showRegister = false">Cancel</el-button>
        <el-button
          type="primary"
          :loading-icon="Eleme"
          :loading="loading"
          @click="register(registerFormRef)"
          >Create Account</el-button
        >
      </span>
    </template>
  </el-dialog>

  <!-- LOGIN DIALOG -->
  <el-dialog
    v-model="showLogin"
    title="Sign in"
    :width="isMobile() ? '80%' : '40%'"
    :before-close="
      () => {
        showLogin = false;
      }
    "
  >
    <section class="row col-12">
      <el-form
        ref="loginFormRef"
        :model="loginForm"
        :rules="loginRules"
        label-width="120px"
        class="demo-loginForm"
        size="default"
      >
        <el-form-item label="E-Mail:" prop="email">
          <el-input v-model="loginForm.email" />
        </el-form-item>
        <el-form-item label="Password:" prop="password">
          <el-input
            type="password"
            show-password
            v-model="loginForm.password"
          />
        </el-form-item>
      </el-form>
    </section>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="showLogin = false">Cancel</el-button>
        <el-button
          type="primary"
          :loading-icon="Eleme"
          :loading="loading"
          @click="login(loginFormRef)"
          >Sign in</el-button
        >
      </span>
    </template>
  </el-dialog>

  <!-- SUBMIT PROJECT DIALOG -->
  <el-dialog
    v-model="showSubmit"
    title="Submit a project"
    :width="isMobile() ? '80%' : '50%'"
    :before-close="
      () => {
        showSubmit = false;
      }
    "
  >
    <section class="row col-12">
      <el-form
        ref="submitFormRef"
        :model="submitForm"
        :rules="submitRules"
        label-width="120px"
        class="demo-submitForm"
        size="default"
      >
        <el-form-item label="Name:" prop="name">
          <el-input v-model="submitForm.name" />
        </el-form-item>
        <el-form-item label="Description:" prop="description">
          <el-input v-model="submitForm.description" />
        </el-form-item>
        <el-form-item label="Home Page:" prop="homepage">
          <el-input v-model="submitForm.homepage" />
        </el-form-item>
        <el-form-item label="Repo URL:" prop="repository">
          <el-input v-model="submitForm.repository" />
        </el-form-item>
        <el-form-item label="Appwrite:" prop="services">
          <el-checkbox-group v-model="submitForm.services">
            <el-checkbox
              v-for="service in services"
              :key="service.name"
              :label="service.name"
              >{{ service.name }}</el-checkbox
            >
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="Open Source ?:" prop="isopen">
          <el-switch
            v-model="submitForm.isopen"
            style="margin-left: 24px"
            inline-prompt
            :active-icon="Check"
            :inactive-icon="Close"
          />
        </el-form-item>
        <el-form-item label="License:" pro="license">
          <el-select v-model="submitForm.license" class="m-2">
            <el-option
              v-for="item in licenses"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="Image 720x300" prop="image">
          <div class="col-12 my-2">
            <div id="preview" class="my-2">
              <img v-if="urlImage" :src="urlImage" width="360" height="150" />
            </div>
            <input
              class="form-control"
              accept=".jpg, .png"
              type="file"
              @change="onFileChange"
              ref="file-input"
            />
          </div>
        </el-form-item>
      </el-form>
    </section>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="showSubmit = false">Cancel</el-button>
        <el-button
          type="primary"
          :loading-icon="Eleme"
          :loading="loading"
          @click="submitProject(submitFormRef)"
          >Submit Project</el-button
        >
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
// ELEMENTS
import { ElMessageBox } from "element-plus";
import { Check, Close, Eleme } from "@element-plus/icons-vue";
import type { FormInstance } from "element-plus";
import { mainStore } from "@/store/store";
import { ref, reactive } from "vue";
// import mixins from "@/mixins";
import Server from "@/services/server";
import { Project } from "@/models/Project";

const store = mainStore();
const loading = ref(false);

const isMobile = () => {
  if (screen.width <= 760) {
    return true;
  } else {
    return false;
  }
};

const showRegister = ref(false);

const registerFormRef = ref<FormInstance>();
const registerForm = reactive({
  name: "",
  password: "",
  email: "",
});

const showLogin = ref(false);

const loginFormRef = ref<FormInstance>();
const loginForm = reactive({
  password: "",
  email: "",
});

const registerRules = reactive({
  name: [
    { required: true, message: "Please input your name", trigger: "blur" },
    { min: 3, max: 30, message: "Length should be 3 to 30", trigger: "blur" },
  ],
  email: [
    { required: true, message: "Please input your email", trigger: "blur" },
    { type: "email", message: "Email is not valid", trigger: "blur" },
  ],
  password: [
    { required: true, message: "Please input your password", trigger: "blur" },
    { min: 5, max: 20, message: "Length should be 5 to 20", trigger: "blur" },
  ],
});

const loginRules = reactive({
  email: [
    { required: true, message: "Please input your email", trigger: "blur" },
    { type: "email", message: "Email is not valid", trigger: "blur" },
  ],
  password: [
    { required: true, message: "Please input your password", trigger: "blur" },
    { min: 5, max: 20, message: "Length should be 5 to 20", trigger: "blur" },
  ],
});

const showSubmit = ref(false);
const submitFormRef = ref<FormInstance>();
const submitForm = reactive({
  name: "",
  description: "",
  license: "MIT",
  repository: "",
  homepage: "",
  services: [],
  isopen: true,
  image: "",
});

const submitRules = reactive({
  name: [
    {
      required: true,
      message: "Please input the project name",
      trigger: "blur",
    },
    { min: 3, max: 30, message: "Length should be 3 to 30", trigger: "blur" },
  ],
  description: [
    { required: true, message: "Please input a description", trigger: "blur" },
    { min: 5, max: 140, message: "Length should be 5 to 140", trigger: "blur" },
  ],
  license: [
    { required: true, message: "Please select the license", trigger: "blur" },
    { min: 5, max: 30, message: "Length should be 5 to 30", trigger: "blur" },
  ],
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const licenses: any = [
  {
    value: "Commercial",
    label: "Commercial",
  },
  {
    value: "MIT",
    label: "MIT",
  },
  {
    value: "Apache-2.0",
    label: "Apache-2.0",
  },
  {
    value: "GPL-3.0",
    label: "GPL-3.0",
  },
  {
    value: "ISC",
    label: "ISC",
  },
  {
    value: "BSD-2-Clause",
    label: "BSD-2-Clause",
  },
  {
    value: "BSD-3-Clause",
    label: "BSD-3-Clause",
  },
  {
    value: "BSD-4-Clause",
    label: "BSD-4-Clause",
  },
  {
    value: "MPL-2.0",
    label: "MPL-2.0",
  },
  {
    value: "Unlicense",
    label: "Unlicense",
  },
  {
    value: "AGPL-3.0",
    label: "AGPL-3.0",
  },
  {
    value: "LGPL-3.0",
    label: "LGPL-3.0",
  },
  {
    value: "GPL-2.0",
    label: "GPL-2.0",
  },
  {
    value: "LGPL-2.1",
    label: "LGPL-2.1",
  },
  {
    value: "GPL-3.0",
    label: "GPL-3.0",
  },
  {
    value: "LGPL-2.0",
    label: "LGPL-2.0",
  },
  {
    value: "EPL-1.0",
    label: "EPL-1.0",
  },
  {
    value: "CC0-1.0",
    label: "CC0-1.0",
  },
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const services: any = [
  {
    name: "Account",
    url: "https://appwrite.io/docs/client/account",
  },
  {
    name: "Users",
    url: "https://appwrite.io/docs/server/users",
  },
  {
    name: "Teams",
    url: "https://appwrite.io/docs/client/teams",
  },
  {
    name: "Database",
    url: "https://appwrite.io/docs/client/database",
  },
  {
    name: "Storage",
    url: "https://appwrite.io/docs/client/storage",
  },
  {
    name: "Functions",
    url: "https://appwrite.io/docs/client/functions",
  },
  {
    name: "Locale",
    url: "https://appwrite.io/docs/client/locale",
  },
  {
    name: "Avatars",
    url: "https://appwrite.io/docs/client/avatars",
  },
  {
    name: "Health",
    url: "https://appwrite.io/docs/server/health",
  },
];

const urlImage = ref("");

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const onFileChange = (e: any) => {
  image.value = e.target.files[0];
  urlImage.value = URL.createObjectURL(image.value);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const image: any = ref();

async function register(formEl: FormInstance | undefined) {
  if (!formEl) return;
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      showRegister.value = false;
      loading.value = true;
      const success = await Server.registerAccount(
        registerForm.email,
        registerForm.password,
        registerForm.name
      );
      if (success) {
        ElMessageBox.alert(
          "The account has been successfully created \n You can now log in with the data you provided.",
          "Success",
          {
            confirmButtonText: "OK",
            showClose: false,
            type: "success",
          }
        );
        loading.value = false;
      } else {
        ElMessageBox.alert("Error trying to create account", "Error", {
          confirmButtonText: "OK",
          showClose: false,
          type: "error",
          callback: () => {
            console.log("Vamos all");
          },
        });
        loading.value = false;
      }
    } else {
      console.log("error submit!", fields);
    }
  });
}

async function login(formEl: FormInstance | undefined) {
  if (!formEl) return;
  await formEl.validate(async (valid) => {
    if (valid) {
      loading.value = true;
      try {
        await Server.login(loginForm.email, loginForm.password);
        loading.value = false;
        showLogin.value = false;
        formEl.resetFields();
      } catch (error) {
        loading.value = false;
        ElMessageBox.alert("Invalid Credentials", "Error", {
          confirmButtonText: "OK",
          showClose: false,
          type: "error",
        });
      }
    }
  });
}

async function submitProject(formEl: FormInstance | undefined) {
  if (!formEl) return;
  await formEl.validate(async (valid) => {
    if (valid) {
      loading.value = true;
      // GENERATE CHECKED SERVICES
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const checkedServices: any[] = [];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      submitForm.services.forEach((service: any) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        services.forEach((item: any) => {
          if (service === item.name) {
            checkedServices.push({ url: item.url, name: item.name });
          }
        });
      });
      // UPLOAD IMAGE TO STORAGE
      let imageId = "";
      if (image.value) {
        if (image.value.size > 300000) {
          ElMessageBox.alert("The image must be less than 300KB", "Error", {
            confirmButtonText: "OK",
            showClose: false,
            type: "error",
          });
          return;
        }
        try {
          imageId = await Server.uploadImage(image.value);
        } catch (error) {
          ElMessageBox.alert("Error trying to upload the image", "Error", {
            confirmButtonText: "OK",
            showClose: false,
            type: "error",
          });
          loading.value = false;
          return;
        }
      }

      // GENERATE PROJECT
      const project: Project = {
        name: submitForm.name,
        description: submitForm.description,
        image: imageId,
        services: JSON.stringify(checkedServices),
        license: submitForm.license,
        homepage: submitForm.homepage,
        owner: store.id,
        isopen: submitForm.isopen,
        repository: submitForm.repository,
        active: false,
      };
      const result = await Server.createProject(project);
      if (!result) {
        ElMessageBox.alert("Error trying to create a project", "Error", {
          confirmButtonText: "OK",
          showClose: false,
          type: "error",
        });
        loading.value = false;
        return;
      }
      formEl.resetFields();
      ElMessageBox.alert(
        "The project has been successfully submitted",
        "Success",
        {
          confirmButtonText: "OK",
          showClose: false,
          type: "success",
        }
      );
      loading.value = false;
      showSubmit.value = false;
    }
  });
}
</script>
