const fs = require('fs')
exports.getLocalizedCommand = (client, message, command) => {
  let getSpecificLanguage = client.data.get('userSpecificSettings.' + message.author.id + '.language')
  if (getSpecificLanguage === undefined) {
    getSpecificLanguage = client.data.get('serverSpecificSettings.' + message.guild.id + '.language')
    if (getSpecificLanguage === undefined) { getSpecificLanguage = 'en' }
  }
  try {
    return JSON.parse(fs.readFileSync('./commands/localization/' + getSpecificLanguage + '/' + command + '.json', 'utf8'))
  } catch (error) {
    if (error.code === 'ENOENT') {
      client.log("Can't find proper data for lang " + getSpecificLanguage + ' for command ' + command + '.')
      return JSON.parse(fs.readFileSync('./commands/localization/en/' + command + '.json', 'utf8'))
    }
  }
}

exports.getPrefix = (client, message) => {
  if (message.guild !== null) {
    if (client.data.get('serverSpecificSettings.' + message.guild.id + '.prefix') === undefined ||
  client.data.get('serverSpecificSettings.' + message.guild.id + '.prefix') === '') {
      return client.params.get('prefix')
    } else {
      return client.data.get('serverSpecificSettings.' + message.guild.id + '.prefix')
    }
  } else {
    return client.params.get('prefix')
  }
}
