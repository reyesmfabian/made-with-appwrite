// eslint-disable-next-line @typescript-eslint/no-var-requires
const inquirer = require("inquirer");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const sdk = require("node-appwrite");
let client = new sdk.Client();
let database = new sdk.Database(client);
let teams = new sdk.Teams(client);
let users = new sdk.Users(client);

require("colors");

console.log("==============================================\n".green);
console.log("Made With Appwrite Server Generate Script\n".green);
console.log("Requirements:".green);
console.log("* Appwrite Instance With 0.11.1 Version".green);
console.log("* SMTP Service Enabled".green);
console.log("* Appwrite Project ID".green);
console.log("* Appwrite Project Endpoint URL".green);
console.log("* Site URL set in Platforms (console)".green);

console.log(
  "* API KEY with all scopes selected -> You can generate it from the Web console\n"
    .green
);
console.log("GitHub: @reyesmfabian".red);
console.log("==============================================".green);

const questions = [
  {
    type: "input",
    name: "name",
    message: "Admin Name:",
  },
  {
    type: "input",
    name: "email",
    message: "Admin E-Mail:",
    validate: (value) => {
      const regex = new RegExp("^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$");
      const pass = value.match(regex);
      if (pass) {
        return true;
      }
      return "Enter a valid E-Mail";
    },
  },
  {
    type: "input",
    name: "password",
    message: "Admin Password:",
    validate: (value) => {
      const pass = value.match(/^(?=.*\d).{8,}$/);
      if (pass) {
        return true;
      }
      return "The password must be at least 8 characters long";
    },
  },
  {
    type: "input",
    name: "api_endpoint",
    message: "Paste your Appwrite Project Endpoint URL:",
  },
  {
    type: "input",
    name: "project_id",
    message: "Paste your Appwrite Project ID:",
  },
  {
    type: "input",
    name: "api_key",
    message: "Paste your Appwrite Api Key:",
  },
  {
    type: "input",
    name: "site_url",
    message: 'Paste your "Made With Appwrite" Site URL:',
  },
  // {
  //   type: "input",
  //   name: "phone",
  //   message: "What's your phone number",
  //   validate(value) {
  //     const pass = value.match(
  //       /^([01]{1})?[-.\s]?\(?(\d{3})\)?[-.\s]?(\d{3})[-.\s]?(\d{4})\s?((?:#|ext\.?\s?|x\.?\s?){1}(?:\d+)?)?$/i
  //     );
  //     if (pass) {
  //       return true;
  //     }

  //     return "Please enter a valid phone number";
  //   },
  // },
];

inquirer.prompt(questions).then(async (answers) => {
  const api_key = answers.api_key;
  const name = answers.name;
  const email = answers.email;
  const password = answers.password;
  const project_id = answers.project_id;
  const api_endpoint = answers.api_endpoint;
  const site_url = answers.site_url;

  client.setEndpoint(api_endpoint).setProject(project_id).setKey(api_key);
  try {
    console.log("Creating Admin Team.....".green);
    const adminTeam = await teams.create("admins");
    console.log("Creating Projects Collection.....".green);
    const projectsCollection = await database.createCollection(
      "Projects",
      ["*"],
      ["*"],
      [
        {
          type: "text",
          key: "name",
          label: "Name",
          default: "",
          array: false,
          required: false,
        },
        {
          type: "text",
          key: "description",
          label: "Description",
          default: "",
          array: false,
          required: false,
        },
        {
          type: "text",
          key: "license",
          label: "License",
          default: "",
          array: false,
          required: false,
        },
        {
          type: "text",
          key: "repository",
          label: "Repository",
          default: "",
          array: false,
          required: false,
        },
        {
          type: "text",
          key: "homepage",
          label: "Homepage",
          default: "",
          array: false,
          required: false,
        },
        {
          type: "text",
          key: "services",
          label: "Services",
          default: "",
          array: false,
          required: false,
        },
        {
          type: "text",
          key: "image",
          label: "Image",
          default: "",
          array: false,
          required: false,
        },
        {
          type: "boolean",
          key: "active",
          label: "Active",
          default: false,
          array: false,
          required: false,
        },
        {
          type: "text",
          key: "owner",
          label: "Owner",
          default: "",
          array: false,
          required: false,
        },
        {
          type: "boolean",
          key: "isopen",
          label: "Is Open",
          default: false,
          array: false,
          required: false,
        },
      ]
    );
    console.log("Creating Admins Collection.....".green);
    const adminsCollection = await database.createCollection(
      "Admins",
      ["*"],
      [`team:${adminTeam.$id}`],
      [
        {
          type: "text",
          key: "userid",
          label: "User ID",
          default: "",
          array: false,
          required: false,
        },
        {
          type: "text",
          key: "name",
          label: "Name",
          default: "",
          array: false,
          required: false,
        },
      ]
    );
    console.log("Creating Admin User.....".green);
    const user = await users.create(email, password, name);

    console.log("Creating Admin Document.....".green);
    await database.createDocument(
      adminsCollection.$id,
      {
        userid: user.$id,
        name: name,
      },
      [`user:${user.$id}`, `team:${adminTeam.$id}`],
      [`team:${adminTeam.$id}`]
    );

    console.log("Integrate Admin into Admin Group.....".green);
    await teams.createMembership(adminTeam.$id, email, ["owner"], site_url);

    console.log("==============================================".green);
    console.log(
      "Save the following information to add to the .env file of the front-end solution\n"
        .green
    );
    console.log("Appwrite Project ID: ".green, project_id);
    console.log("Appwrite Endpoint URL: ".green, api_endpoint);
    console.log("Projects Collection ID: ".green, projectsCollection.$id);
    console.log("Admins Collection ID: ".green, adminsCollection.$id);
    console.log("Admin Team ID: ".green, adminTeam.$id, "\n");
    console.log("Your login credentials to the web platform\n".green);
    console.log("Username: ".green, email);
    console.log("Password: ".green, password, "\n");
    console.log(
      "¡ You can now delete the API Key from your Appwrite console for security reasons !.\n"
        .red
    );
    console.log("==============================================".green);
  } catch (error) {
    console.log(error);
  }
});
