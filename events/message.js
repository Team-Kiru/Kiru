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
  try {cmd.run(client, message)}
  catch (exception) {
    client.channels.get(client.params.get('channels.genericLogs')).send("@here There's an issue with one of your plugins.\n" + exception.stack)
    console.log(exception.stack)
    message.reply("I.. I did something naughty, and an error occured.\nI-I'll b-be a good boy, and report the e-error though!")
  }
}
