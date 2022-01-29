export var sequelizeConfigProps = {
  host: "localhost",
  port: 3307,
  dialect: "mariadb",
  dialectOptions: {
    options: {
      enableArithAbort: true,
      trustedConnection: true,
    },
  },
};
