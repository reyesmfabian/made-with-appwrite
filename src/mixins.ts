import { appwrite } from "./appwrite";
import router from "@/router/index";
import { mainStore } from "./store/store";

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const mixins = () => {
  const store = mainStore();
  const checkLogin = async () => {
    try {
      const user = await appwrite.account.get();
      return user;
    } catch (err) {
      clearState();
      await router.push({
        name: "Home",
      });
      return false;
    }
  };
  const clearState = () => {
    store.$reset();
    localStorage.clear();
  };

  // CONSTANTS
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const projectsCollection: string = process.env.VUE_APP_PROJECTSCOLLECTION!;
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const adminsCollection: string = process.env.VUE_APP_ADMINSCOLLECTION!;
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const adminTeam: string = process.env.VUE_APP_ADMINTEAM!;

  return {
    checkLogin,
    clearState,
    projectsCollection,
    adminsCollection,
    adminTeam,
  };
};

export default mixins;
