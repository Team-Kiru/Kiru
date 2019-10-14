module.exports = (client, member) => {
	if (client.function['guildMemberAdd'] !== undefined)	client.function['guildMemberAdd'].forEach(fun => {
		fun(client, member)
	})
}
