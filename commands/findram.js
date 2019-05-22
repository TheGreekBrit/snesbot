const https = require('https');
const smwram = require('../smwmap.json');

module.exports = {
        name: 'findram',
        description: 'Searches for a SMW RAM address.',
        args: false,
        usage: 'reznor',
        helpDoc: 'placeholder',
        execute(message, args) {
			//return message.reply('the ping pongs at midnight');
			smwram.forEach(address => {
				//todo check address.address for a match
				[...new Set(address.description.split(' '))].forEach(word => {
					//todo check for multi-word search terms (ex: 'map16 vram')
					if (word.toLowerCase() === args[0].toLowerCase()) {
						//todo logic when match is found
						return message.reply(address.address, address.size, address.size === 1?'byte':'bytes', '\n', address.description, '\n');
					}
				});
			})
		}
}





/*
https.get('https://www.smwcentral.net/?p=memorymap&game=smw&region=ram&max=', resp => {
	let data = '';

	resp.on('data', chunk => data += chunk);

	resp.on('end', () => console.log(data));
}).on('error', err => console.error(err));
 */
