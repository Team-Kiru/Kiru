const Enmap = require('enmap')
const discord = require('discord.js')
const ConfigGrab = require('node-json-config')
const bannedEvents = ['webserver.js', 'api.js', 'extrafunctions.js']
const fs = require('fs')
const path = require('path')

// When there's an issue, Kiru should seize up (Not expected behavior, but it happens).
process.on('uncaughtException', err => {
  console.error("There's an issue in one of your modules. " + err.stack)
})

// Initialize an internal paramater for the config. This should never leave the main bot.
const params = require(path.join(__dirname, './config/config.json'))

const client = new discord.Client()
client.params = { name: params.aboutme.name, owners: params.owners, prefix: params.prefix, logs: params.channels }
client.data = new ConfigGrab(path.join(__dirname, './config/data.json'))
client.extraFunction = require(path.join(__dirname, './events/extrafunctions.js'))

// The proper way to log a message through Kiru, and to save hassle for developers and users alike.
// Please don't use "console.log" - use client.log instead.
client.log = message => {
  client.channels.get(params.channels.genericLogs).send(message)
  console.log(message)
}

// Load up any non-standard events, like understanding commands and messages.
fs.readdir('./events/', (err, files) => {
  if (err) return console.error(err.stack)
  // Go through every file in events.
  //   - Make sure it ends in .js, and isn't litter from something from the banned events.
  //   - If it isn't litter, then add try to add it.
  //     - Throw a tantrum if it fails.
  files.forEach(file => {
    if (!bannedEvents.includes(file) && file.endsWith('.js')) {
      let event = null
      try { event = require(path.join(__dirname, `./events/${file}`)) }
      catch (e) {
        console.error(`Cannot load event ${file} - Things in /events/ are critical, so Kiru will be shutting down.\n` + e.stack)
        process.exit(1)
      }
      const eventName = file.split('.')[0]
      client.on(eventName, event.bind(null, client))
    }
  })
})

// The worse possible way to add and reload commands, I know.
// TODO: Rework addCommands() to properly reload the modules.
const addCommands = () => {
  client.commands = new Enmap()
  client.function = {}
  // Begin by creating a recursive directory search in the modules directory.
  // If FS itself has an issue, throw a fit.
  fs.readdir(path.join(__dirname, './modules/'), (err, files) => {
    if (err) return console.error(err.stack)
    files.forEach(file => {
      if (!file.endsWith('.js')) return
      let commandError = false
      let props = null
      // Try to require the file- therby adding it to the bot itself.
      // Throw a fit if you're unable.
      try { props = require(path.join(__dirname, `./modules/${file}`)) }
      catch (e) {
        console.error(`Cannot load plugin ${file} - See stack trace. Ignoring plugin.\n` + e.stack)
        commandError = true
      }

      if (!commandError) {
        if (Object.keys(props).includes('run')) {
          const commandName = file.split('.')[0]
          if (props.load !== undefined) props.load(client)
          client.commands.set(commandName, props)
        } else {
          for (let i = 0; i !== Object.keys(props).length; i++) {
            Object.keys(props[Object.keys(props)[i]]).forEach(pluginName => {
              if (pluginName === 'load') props[Object.keys(props)[i]].load(client)
              else if (pluginName.startsWith('On_')) {
                const plugin = pluginName.replace('On_', '')
                if (client.function[plugin] === undefined) client.function[plugin] = []
                client.function[plugin].push(props[Object.keys(props)[i]][pluginName])
              }
              client.commands.set(Object.keys(props)[i], props[Object.keys(props)[i]])
            })
          }
        }
      }
    })
    client.log('all commands are loaded!')
  })
}

// reloadAll is a rather dangerous way to reload ATM.
// TODO: Make reloadAll at least a little safer.
// TODO: Consider adding reload("Plugin/ALL").
client.reloadAll = () => {
  Object.keys(require.cache).forEach(key => {
    delete require.cache[key]
  })
  addCommands()
  client.log('Reloaded all commands.')
}

// Once the bot is actually ready:
//   - Add Commands
//   - Check if core.js is available
//   - Screech if it isn't.
client.on('ready', () => {
  addCommands()
  client.user.setPresence({
    game: {
      type: 'LISTENING',
      name: 'the community!'
    },
    status: 'online'
  })

  client.log('===================================================')
  client.log(
    `Logged in as ${client.user.tag} on ` + new Date().toUTCString() + '!'
  )
  if (!fs.existsSync(path.join(__dirname, './modules/core.js'))) console.log('WARNING!\nThis version of Kiru will be unsupported by Team Kiru!\n' + 'Core.js is required for proper operation.')
})

client.login(params['token'])
