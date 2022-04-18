// To parse this data:
//
//   import { Convert, Project } from "./file";
//
//   const project = Convert.toProject(json);

export interface Project {
  $id?: string;
  $collection?: string;
  $permissions?: Permissions;
  name: string;
  description: string;
  image: string;
  license: string;
  repository: string;
  homepage: string;
  owner: string;
  isopen: boolean;
  services: string;
  active: boolean;
}

export interface Permissions {
  read: string[];
  write: string[];
}

export interface Service {
  name: string;
  url: string;
}

// Converts JSON strings to/from your types
export class Convert {
  public static toProject(json: string): Project {
    return JSON.parse(json);
  }

  public static toServices(json: string): Service[] {
    return JSON.parse(json);
  }

  public static projectToJson(value: Project): string {
    return JSON.stringify(value);
  }
}
