exports.eval = {
  info: () => {
    return { 'hidden': true }
  },
  run: (client, message) => {
    if (client.params.get('owners').includes(message.author.id)) {
      try {
        let val = eval(message.content.replace(client.extraFunction.getPrefix(client, message) + 'eval ', ''))
        if (val !== undefined) message.reply(val)
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
