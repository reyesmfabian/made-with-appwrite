import { defineStore } from "pinia";

export const mainStore = defineStore({
  // id is required so that Pinia can connect the store to the devtools
  id: "mainstore",
  state: () => ({
    connected: false,
    id: "",
    name: "",
    email: "",
    isAdmin: false,
  }),
  getters: {},
  actions: {
    setUser(
      connected: boolean,
      id: string,
      name: string,
      email: string,
      isAdmin: boolean
    ) {
      this.connected = connected;
      this.id = id;
      this.name = name;
      this.email = email;
      this.isAdmin = isAdmin;
    },
  },
});
