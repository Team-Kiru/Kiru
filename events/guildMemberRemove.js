module.exports = (client, member) => {
	client.function['guildMemberRemove'].forEach(fun => {
		fun(client, member)
	})
}
