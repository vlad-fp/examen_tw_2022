import { Sequelize } from "sequelize";
import { sequelizeConfigProps } from "../config.js";
import { operations } from "./operations.js";

const sequelizeConnection = new Sequelize(
    "space_db",
    "root",
    "",
    sequelizeConfigProps
);

export const Spacecrafts = sequelizeConnection.define("spacecrafts", {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        validate: {
            min: {
                args: [3],
                msg: "Minimum 3 characters required"
            }
        }
    },
    max_speed: {
        type: Sequelize.INTEGER,
        allowNull: false,
        validate: {
            min: 1000
        }
    },
    max_weight: {
        type: Sequelize.FLOAT,
        allowNull: false,
        validate: {
            min: 200
        }
    }
});

export const Astronauts = sequelizeConnection.define("astronauts", {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        validate: {
            min: {
                args: [5],
                msg: "Minimum 5 characters required"
            }
        }
    },
    role: {
        type: Sequelize.ENUM("commander", "pilot", "engineer", "soldier"),
        defaultValue: "soldier"
    }
});

Astronauts.belongsTo(Spacecrafts);
Spacecrafts.hasMany(Astronauts);

// only create once
// operations.init(sequelizeConnection);

export { sequelizeConnection };