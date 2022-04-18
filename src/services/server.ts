import { mainStore } from "../store/store";
import { appwrite } from "../appwrite";
import mixins from "../mixins";
import router from "@/router/index";
import { Project } from "@/models/Project";

class Server {
  async registerAccount(email: string, password: string, name: string) {
    try {
      await appwrite.account.create(email, password, name);
      return true;
    } catch (error) {
      return false;
    }
  }

  async login(username: string, password: string) {
    const store = mainStore();
    let success = false;
    await appwrite.account.createSession(username, password).then(async () => {
      const user = await mixins().checkLogin();
      if (!user) {
        return;
      }
      const isAdmin = await this.checkAdmin(user.$id);
      store.setUser(true, user.$id, user.name, user.email, isAdmin);
      success = true;
    });
    return success;
  }

  async logout() {
    try {
      await appwrite.account.deleteSession("current");
      mixins().clearState();
      await router.push({
        name: "Home",
      });
    } catch (error) {
      return false;
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async uploadImage(file: any) {
    const store = mainStore();
    const image = await appwrite.storage.createFile(
      file,
      ["*"],
      [`user:${store.id}`, `team:${mixins().adminTeam}`]
    );
    return image.$id;
  }

  async createProject(project: Project) {
    const store = mainStore();
    try {
      const result = await appwrite.database.createDocument(
        mixins().projectsCollection,
        {
          name: project.name,
          description: project.description,
          image: project.image,
          license: project.license,
          repository: project.repository,
          homepage: project.homepage,
          owner: project.owner,
          isopen: project.isopen,
          services: project.services,
        },
        ["*"],
        [`user:${store.id}`, `team:${mixins().adminTeam}`]
      );
      return result;
    } catch (error) {
      return false;
    }
  }

  async getOpenProjects() {
    const response = await appwrite.database.listDocuments(
      mixins().projectsCollection,
      ["isopen=1", "active=1"]
    );
    const projects = response.documents as Project[];
    return projects;
  }

  async getCommercialProjects() {
    const response = await appwrite.database.listDocuments(
      mixins().projectsCollection,
      ["isopen=0", "active=1"]
    );
    const projects = response.documents as Project[];
    return projects;
  }

  async getProjectsByUser(userId: string) {
    const response = await appwrite.database.listDocuments(
      mixins().projectsCollection,
      [`owner=${userId}`]
    );
    const projects = response.documents as Project[];
    return projects;
  }

  async getAllProjects() {
    const response = await appwrite.database.listDocuments(
      mixins().projectsCollection
    );
    const projects = response.documents as Project[];
    return projects;
  }
  loadLogo(imageId: string) {
    const image = appwrite.storage.getFileView(imageId);
    return image;
  }

  async checkAdmin(userId: string) {
    const response = await appwrite.database.listDocuments(
      mixins().adminsCollection,
      [`userid=${userId}`]
    );
    if (response.documents.length > 0) {
      return true;
    } else {
      return false;
    }
  }

  async deleteProject(project: Project) {
    await appwrite.database.deleteDocument(
      mixins().projectsCollection,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      project.$id!
    );
    await appwrite.storage.deleteFile(project.image);
  }

  async enableDisableProject(project: Project, isEnable: boolean) {
    await appwrite.database.updateDocument(
      mixins().projectsCollection,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      project.$id!,
      {
        active: isEnable,
      },
      project.$permissions?.read,
      project.$permissions?.write
    );
  }
}

export default new Server();
