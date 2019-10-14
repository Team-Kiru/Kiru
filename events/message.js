module.exports = (client, message) => {
  if (message.author.bot) return

  client.function.message.forEach(fun => {
    fun(client, message)
  })

  if (
    !message.content.startsWith(client.extraFunction.getPrefix(client, message))
  ) {
    return
  }
  console.log('u')
  const command = message.content
    .slice(client.extraFunction.getPrefix(client, message).length)
    .trim()
    .split(/ +/g)
    .shift()
    .toLowerCase()
  console.log('p')
  const cmd = client.commands.get(command)
  console.log('i')
  if (!cmd) return
  console.log(x)
  client.timeInvoked = Date.now()
  cmd.run(client, message)
}
