/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Appwrite } from "appwrite";

const appwrite = new Appwrite();
appwrite
  .setEndpoint(process.env.VUE_APP_ENDPOINT!)
  .setProject(process.env.VUE_APP_PROJECTID!)
  .setLocale("en");

export { appwrite };
