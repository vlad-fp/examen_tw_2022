import { router } from "../server.js";
import "./sync.js";
import { operations } from "./operations.js";

router
.route("/spacecraft")
.get(async (_, res) => {
    const result = await operations.getSpacecrafts();
    res.status(200).json(result);
});

router.route("/spacecraft/:id")
.get(async function getSpacecraft(req, res) {
    const id = req.params.id;
    var result = await operations.getSpacecraft(id);
    res.status(200).json(result);
});

router.route("/spacecraft")
.post(async function createSpacecraft(req, res)  {
    try {
        await operations.createSpacecraft(req.body);
        res.status(201).json("Success!")
    } catch (err) {
        console.error(req.statusMessage);
    }
});

router.route("/spacecraft/:id")
.put(async ({ body, params: {id}}, res) => {
    try {
        await operations.updateSpacecraft(id, body);
        res.status(200).json("Success!")
    } catch (err) {
        console.error(err);
    }
});

router.route("/spacecraft/:id")
.delete(async ({ params: { id }}, res) => {
    try {
        await operations.deleteSpacecraft(id);
        res.status(200).json(`Success! Deleted spacecraft with id ${id}!`);
    } catch (err) {
        console.error(err);
    }
});

router
.route("/spacecraft/:id/astronauts")
.get(async (_, res) => {
    const result = await operations.getAstronauts(id);
    res.status(200).json(result);
});


router
.route("/spacecraft/astronauts")
.post(async ({body}, res) => {
    try {
        await operations.createSpacecraftAstronauts(body);
        res.status(200).json("Success!");
    } catch(err) {
        console.log(err);
    }
});

router
.route("/spacecraft/:id/astronauts")
.put(async ({body, params: {id}}, res) => {
    await operations.updateSpacecraftAstronauts(id, body);
    res.status(200).json("Success!");
});

router
.route("/spacecraft/:id/astronauts")
.delete(async ({params: {id}}, res) => {
    await operations.deleteSpacecraftAstronauts(id);
    res.status(200).json("Deleted astronauts");
});