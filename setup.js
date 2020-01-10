const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
})
const path = require('path')
const ConfigGrab = require('node-json-config')
const conf = new ConfigGrab(path.join(__dirname, './config/config.json'))
config = {}

let installer = () => {
	console.log('88      a8P   88\n88    ,88\'    ""\n88  ,88"\n88,d88\'       88  8b,dPPYba,  88       88\n8888"88,      88  88P\'   "Y8  88       88\n88P   Y8b     88  88          88       88\n88     "88,   88  88          "8a,   ,a88\nb88       Y8b  88  88           `"YbbdP\'Y8\nThanks for picking Kiru to be your framework!\nThe installer is licensed with the KTD Blue License, available at:\nhttps://raw.githubusercontent.com/Team-Kiru/Kiru/master/LICENSE\n\nFirst, let\'s get the bot\'s name.\n')
	readline.question("Name: [Kiru]", (name) => {
		if (name.trim().length === 0) config.aboutme = {"name": "Kiru"}
		else config.aboutme = {"name": name}
		console.log("Okay! Now that we have the name of your bot, I need the bot token. You can make a bot here:\nhttps://discordapp.com/developers/applications/\nWatch this for some help.\nhttps://i.imgur.com/NvFQcFk.gifv\nNote, Self-botting is not only against the TOS, Discord.JS doesn't have the functionality.")
		readline.question("Token: ", (token) => {
			
		})
	})
}

if (!process.argv[2]) console.warn("There's no need for you to run the setup script, since Yarn and NPM should do that for you.\nIf you seriously need to setup, then run with the argument 'force'.")
else switch(process.argv[2].toString().toLowerCase()) {
	case "setup":
		if (require('fs').existsSync(path.join(__dirname, './config/config.json'))) {

		} else {
			installer()
		}
		
	break
	case "force":
		installer()
	break
}
