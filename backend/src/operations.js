import { Spacecrafts, Astronauts } from "./sync.js";
import seq from "sequelize";

async function sequelizeAuth(sequelizeConnection) {
    try {
      await sequelizeConnection.authenticate();
      console.log("Sequelize has succesfully connected to the database");
    } catch (err) {
      throw err;
    }
}
  
async function sequelizeSync(sequelizeConnection) {
    try {
      await sequelizeConnection.sync({ force: true, alter: true });
      console.log("Sync complete!");
    } catch (err) {
      throw err;
    }
}

async function executeInitialDatabasePopulation() {
    // Seeding Spacecraft
    await Spacecrafts.create({
        name: "Nebuchadnezzar",
        max_speed: 2600,
        max_weight: 440.15
    });

    // Seeding Astronauts
    await Astronauts.create({
        name: "John Wilkinson",
        role: "commander",
        spacecraftId: 1
    });
    await Astronauts.create({
        name: "Alex Hamlet",
        role: "pilot",
        spacecraftId: 1
    });
    await Astronauts.create({
        name: "Deagon Blackley",
        role: "engineer",
        spacecraftId: 1
    });
    await Astronauts.create({
        name: "Jacob Starr",
        role: "soldier",
        spacecraftId: 1
    });
}

async function initSequelize(sequelizeConnection) {
    await sequelizeAuth(sequelizeConnection);
    await sequelizeSync(sequelizeConnection);
    await executeInitialDatabasePopulation();
}

/* WRAPPER */
async function execAsyncRequest(asyncRequest) {
    try {
        return await asyncRequest();
    } catch (err) {
        throw err;
    }
}
/* WRAPPER */

async function getSpacecrafts() 
{
    return await execAsyncRequest(
        async function getSpacecrafts() {
            return await Spacecrafts.findAll();
        }
    );
}

async function getSpacecraft(id) 
{
    return await execAsyncRequest(
        async function getSpacecraft() {
            return await Spacecrafts.findByPk(id);
        }
    );
}

async function createSpacecraft(spacecraft)
{
    return await execAsyncRequest(
        async function updateSpacecraft() {
            return await Spacecrafts.create({
                name: spacecraft.name,
                max_speed: spacecraft.max_speed,
                max_weight: spacecraft.max_weight
            });
        }
    );
}

async function updateSpacecraft(id, spacecraft)
{
    return await execAsyncRequest(
        async function updateSpacecraft() {
            const sc = await Spacecrafts.findByPk(id);
            if (sc) {
                return await sc.update({
                    name: spacecraft.name,
                    max_speed: spacecraft.max_speed,
                    max_weight: spacecraft.max_weight
                });
            }
        }
    );
}

async function deleteSpacecraft(id)
{
    return await execAsyncRequest(
        async function deleteSpacecraft() {
            const spacecraft = await Spacecrafts.findByPk(id);
            if (spacecraft) {
                await spacecraft.destroy();
            }
        }
    );
}

async function getAstronauts(spacecraft_id)
{
    return await execAsyncRequest(
        async function getAstronauts() {
            return await Astronauts.findAll({ where: {
                parent: spacecraft_id
            }});
        }
    );
}

async function createSpacecraftAstronauts(spacecraft)
{
    return await execAsyncRequest(
        async function createAstronauts() {
            return await Spacecrafts.create({
                name: spacecraft.name,
                max_speed: spacecraft.max_speed,
                max_weight: spacecraft.max_weight
            }, {
                include: [ spacecraft.astronauts ]
            });
        }
    )
}

async function updateSpacecraftAstronauts(id, spacecraft)
{
    return await execAsyncRequest(
        async function updateSpacecraft() {
            const sc = await Spacecrafts.findByPk(id, {include: Astronauts});
            if (sc) {
                await sc.update({
                    name: spacecraft.name,
                    max_speed: spacecraft.max_speed,
                    max_weight: spacecraft.max_weight
                }, {
                    include: [spacecraft.astronauts]
                });
            }
        }
    );
}

async function deleteSpacecraftAstronauts(spacecraft_id)
{
    return await execAsyncRequest(
        async function deleteSpacecraft() {
            const spacecraft = await Spacecrafts.findByPk(id, { include: Astronauts});
            if (spacecraft.astronauts) {
                spacecraft.astronauts.forEach(
                    astronaut => astronaut.destroy()
                );
            }
        }
    );
}

export const operations = {
    init: initSequelize,
    getSpacecrafts: getSpacecrafts,
    getSpacecraft: getSpacecraft,
    createSpacecraft: createSpacecraft,
    updateSpacecraft: updateSpacecraft,
    deleteSpacecraft: deleteSpacecraft,
    getAstronauts: getAstronauts,
    createSpacecraftAstronauts: createSpacecraftAstronauts,
    updateSpacecraftAstronauts: updateSpacecraftAstronauts,
    deleteSpacecraftAstronauts: deleteSpacecraftAstronauts
};