//TODO: Actually make EVAL Work. I'm stupid as fuck when it comes to this, so...
exports.eval = {
  info: () => {
    return { 'hidden': true }
  },
  run: (client, message) => {
    if (client.params.get('owners').includes(message.author.id)) {
      try {
        let val = new Function(client, message, message.content.replace(client.extraFunction.getPrefix(client, message) + 'eval ', ''))
        void 0!==val&&message.reply(val)
      } catch (error) { message.reply(error) }
    }
  }
}
exports.reload = {
  info: () => {
    return { 'hidden': true }
  },
  run: (client, message) => {
    let arg = message.content.replace(client.extraFunction.getPrefix(client, message) + 'reload', '').trim().split(' ')
    if (client.params.get('owners').includes(message.author.id)) {
      if (arg[0] === '' || arg[0] === 'all') {
        message.reply('Reloading.')
        client.reloadAll()
      }
    }
  }
}
