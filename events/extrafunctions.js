const fs = require('fs')

// Check the user settings, then server settings. (Disabled)
// If the module doesn't have the correct language, default back to english (as a base of reference.)
// PLEASE ONLY USE THIS E.F. FOR ENGLISH.
// Unless we get enough translations into other languages, this is useless.
exports.getLocalizedCommand = (client, message, command) => {
  // Check if the user has any data regarding the language of their choice.
  let getSpecificLanguage = client.data.get('userSpecificSettings.' + message.author.id + '.language')
  // if they don't-
  if (getSpecificLanguage === undefined) {
    // Check if the _server_ has any language settings.
    getSpecificLanguage = client.data.get('serverSpecificSettings.' + message.guild.id + '.language')
    // If they don't, set language to english.
    if (getSpecificLanguage === undefined) { getSpecificLanguage = 'en' }
  }
  try {
    // Find the language they wanted.
    return JSON.parse(fs.readFileSync('./modules/localization/' + getSpecificLanguage + '/' + command + '.json', 'utf8'))
  } catch (error) {
    // If the language doesn't exist-
    if (error.code === 'ENOENT') {
      // Throw a fit about the command, and try english.
      client.log("Can't find proper data for lang " + getSpecificLanguage + ' for command ' + command + '.')
      try { return JSON.parse(fs.readFileSync('./modules/localization/en/' + command + '.json', 'utf8')) }
      catch (e) {
        // and if _that_ doesn't exist, throw an error, which Kiru will catch.
        if (error.code === 'ENOENT') throw new Error('No Suitable Language found. Perhaps you made a misspelling.')
      }
    }
  }
}

// Get Kiru's prefix - which may be altered in some servers.
exports.getPrefix = (client, message) => {
  // If the message is a DM, or Discord doesn't report a guild (for some reason), return Kiru's default prefix.
  if (message.guild !== null) {
    // If the guild doesn't have a prefix, it's the default with you.
    if (client.data.get('serverSpecificSettings.' + message.guild.id + '.prefix') === undefined || client.data.get('serverSpecificSettings.' + message.guild.id + '.prefix') === '') return client.params.prefix
    // If it does, return the custom prefix.
    else return client.data.get('serverSpecificSettings.' + message.guild.id + '.prefix')
  } else return client.params.prefix
}

exports.parse = (client, message, string) => {

}
