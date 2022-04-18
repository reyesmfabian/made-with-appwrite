import { mainStore } from "@/store/store";
import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/:pathMatch(.*)*",
    name: "404-not-found",
    component: () => import("../views/404/index.vue"),
  },
  {
    path: "/",
    name: "Home",
    component: () => import("@/views/home/index.vue"),
  },
  {
    path: "/my-projects",
    name: "MyProjects",

    component: () => import("@/views/projects/index.vue"),
    meta: { requiresAuth: true, onlyAdmin: false },
  },
  {
    path: "/dashboard",
    name: "Dashboard",

    component: () => import("@/views/dashboard/index.vue"),
    meta: { requiresAuth: true, onlyAdmin: true },
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  const store = mainStore();
  const protectedRoute = to.matched.some((record) => record.meta.requiresAuth);
  const onlyAdmin = to.matched.some((record) => record.meta.onlyAdmin);

  // ONLY MEMBERS CHECK ROUTES
  if (protectedRoute && !store.connected) {
    next({ name: "Home" });
  }

  // ONLY ADMIN CHECK ROUTES
  if (onlyAdmin && !store.isAdmin) {
    next({ name: "Home" });
  }
  // OPEN ROUTES
  next();
});

export default router;
