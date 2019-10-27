exports.info = () => {
  // This is what help will see.
  return {
    'name': 'Example', // The name of the command.
    'author': 'Team Kiru', // Who wrote this? Put "Team Kiru", if you want to remain Anonymous.
    'category': 'Miscellanious', // What category should Kiru put this command under?
    'description': '', // What is the focus of this command?
    'syntax': 'example', // How should this command be used? are there any arguments?
    'hidden': true // Should this just not show up at help at all?
  }
}

exports.run = (client, message) => {

  // This is where you can let your heart grow fonder! Let it wander around and enjoy the weird scenery.
  // It's going to be here for a while, after all.

}
