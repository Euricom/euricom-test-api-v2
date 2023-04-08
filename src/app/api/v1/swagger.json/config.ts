import pkg from "../../../../../package.json";

const config = {
  info: {
    title: "Euricom Test API - V2",
    version: pkg.version,
    description: `
<a href="/api/v1/swagger.json">/api/v1/swagger.json</a>
        `,
    contact: {
      name: "Euricom",
      url: "https://euri.com",
      email: "peter.cosemans@euri.com",
    },
    license: {
      name: "MIT",
      url: "https://opensource.org/licenses/MIT",
    },
  },
};

export default config;
