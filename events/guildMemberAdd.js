module.exports = (client, member) => {
	client.function['guildMemberAdd'].forEach(fun => {
		fun(client, member)
	})
}
