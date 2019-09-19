const _ = require('lodash');
const https = require('https');
const SMW_RAM = require('../var/SMW/RAM.json');

module.exports = {
	name: 'ram',
	description: 'Returns information about a given SMW RAM address.',
	args: false,
	usage: '$7e0019',
	helpDoc: 'placeholder',
	execute(message, args) {
		//return message.reply('the ping pongs at midnight');
		let results = [];
		if (!args)
			return message.reply('*ERR:* no address given!');

		let address = _.upperCase(args[0]);
		let found = {};
		SMW_RAM.forEach(addressEntry => {
			if (addressEntry.address === address) {
				found = {};
				return true;
			}
		});

		if (!found) {
			console.error('address not found:', address);
		} else {
			return message.reply(`Address: ${found.address}\nSize: ${found.size}Type: ${found.type}\nDescription: ${found.description}`);
		}
	}


};
