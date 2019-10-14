module.exports = (client, message) => {
  if (message.author.bot) return
  if (client.function.message !== undefined) {
    client.function.message.forEach(fun => {
      fun(client, message)
    })
  }

  if (!message.content.startsWith(client.extraFunction.getPrefix(client, message))) {
    return
  }
  const command = message.content
    .slice(client.extraFunction.getPrefix(client, message).length)
    .trim()
    .split(/ +/g)
    .shift()
    .toLowerCase()
  const cmd = client.commands.get(command)
  if (!cmd) return
  client.timeInvoked = Date.now()
  cmd.run(client, message)
}
