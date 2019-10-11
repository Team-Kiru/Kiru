const Enmap = require("enmap")
const cron = require("node-cron")
const discord = require("discord.js")
const ConfigGrab = require("node-json-config")
const bannedEvents = ["webserver.js", "api.js", "extrafunctions.js"]
const fs = require("fs")
const path = require("path")

const triggerNewPresence = () => {
	client.data.save()
	client.params.save()
	if (client.data.get("presence").length === 0) {
		client.user
			.setPresence({
				game: {
					type: "LISTENING",
					name: "the community!"
				},
				status: "online"
			})
			.then(() => {
				client.log("I changed my presence!")
			})
	} else {
		client.user
			.setPresence({
				game: {
					name: client.data.get("presence")[
						Math.floor(
							Math.random() * client.data.get("presence").length
						)
					]
				}
			})
			.then(() => {
				client.log("I changed my presence!")
			})
	}
	client.data.put("presence", [])
}

const msg = message => {
	client.channels.get(client.params.get("channels.genericLogs")).send(message)
	console.log(message)
}

process.on("uncaughtException", err => {
	console.log("There's an issue in one of your modules. " + err.stack)
})

const client = new discord.Client()
client.data = new ConfigGrab(path.join(__dirname, "./config/data.json"))
client.params = new ConfigGrab(path.join(__dirname, "./config/config.json"))
client.extraFunction = require(path.join(
	__dirname,
	"./events/extrafunctions.js"
))

fs.readdir("./events/", (err, files) => {
	if (err) return console.error(err.stack)
	files.forEach(file => {
		if (!bannedEvents.includes(file) && file.endsWith(".js")) {
			let event = null
			try {
				event = require(path.join(__dirname, `./events/${file}`))
			} catch (e) {
				console.error(
					`Cannot load event ${file} - Things in /events/ are critical, so Kiru will be shutting down.\n` +
						e.stack
				)
				process.exit(1)
			}
			const eventName = file.split(".")[0]
			client.on(eventName, event.bind(null, client))
		}
	})
})

const addCommands = () => {
	client.commands = new Enmap()
	fs.readdir(path.join(__dirname, "./commands/"), (err, files) => {
		if (err) return console.error(err.stack)
		files.forEach(file => {
			if (!file.endsWith(".js")) return
			let quip = false
			let props = null
			try {
				props = require(path.join(__dirname, `./commands/${file}`))
			} catch (e) {
				console.error(
					`Cannot load plugin ${file} - See stack trace. Ignoring plugin.\n` +
						e.stack
				)
				quip = true
			}
			if (!quip) {
				if (Object.keys(props).includes("run")) {
					const commandName = file.split(".")[0]
					if (props.load !== undefined) props.load(client)
					client.commands.set(commandName, props)
				} else {
					for (let i = 0; i !== Object.keys(props).length; i++) {
						if (props[Object.keys(props)[i]].load !== undefined) {
							props[Object.keys(props)[i]].load(client)
						}
						client.commands.set(
							Object.keys(props)[i],
							props[Object.keys(props)[i]]
						)
					}
				}
			}
		})
		console.log("All commands are loaded!")
	})
}

client.reloadAll = () => {
	Object.keys(require.cache).forEach(key => {
		delete require.cache[key]
	})
	addCommands()
	client.log("Reloaded all commands.")
}

client.on("ready", () => {
	addCommands()
	client.log = msg
	client.log("===================================================")
	client.log(
		`Logged in as ${client.user.tag} on ` + new Date().toUTCString() + "!"
	)
	if (!fs.existsSync(path.join(__dirname, "./commands/core.js"))) {
		console.log(
			"===================================================\n" +
				"WARNING!\nThis version of Kiru will be unsupported by Team Kiru!\n" +
				"Core.js is required for proper operation.\n" +
				"==================================================="
		)
	}

	cron.schedule("*/30 * * * *", () => {
		triggerNewPresence()
	})
	triggerNewPresence()
})

client.login(client.params.get("token"))
