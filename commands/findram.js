const _ = require('lodash');
const fs = require('fs');
const https = require('https');
const Promise = require('promise');
const { Storage } = require('@google-cloud/storage');
const CLOUD_BUCKET = process.env.CLOUD_BUCKET;	//todo add to bot.json

const SMW_RAM = require('../var/SMW/RAM.json');
const storage = new Storage(process.env.PROJECT_ID);
const bucket = storage.bucket(CLOUD_BUCKET);

module.exports = {
        name: 'findram',
        description: 'Searches for a SMW RAM address.',
        args: false,
        usage: 'reznor',
        helpDoc: 'placeholder',
        execute(message, args) {
			//return message.reply('the ping pongs at midnight');
			SMW_RAM.forEach(address => {
				//todo check address.address for a match
				[...new Set(address.description.split(' '))].forEach(word => {
					//todo check for multi-word search terms (ex: 'map16 vram')
					if (word.toLowerCase() === args[0].toLowerCase()) {
						//todo logic when match is found
						return message.reply(address.address, address.size, address.size === 1?'byte':'bytes', '\n', address.description, '\n');
					}
				});
			});
		}
};
/*
		let reply = [];
		//return message.reply('the ping pongs at midnight');
		smwram.forEach(address => {
			//todo check address.address for a match
			let description = [...new Set(address.description.split(' '))];
			
			description.forEach(word => {

				//todo check for multi-word search terms (ex: 'map16 vram')
				if (word.toLowerCase() === args[0].toLowerCase()) {
					//todo logic when match is found
					let byteOrBytes = address.size===1?'byte':'byte';
					reply.push(`**${address.address}** ${address.size} ${byteOrBytes}\n${address.description}\n`);
				}
			});
		});
		if (!reply)
			return message.reply('no matching addresses');
		
		let response = reply.join('');
		if (response.length > 1000) {
			sendToGCS(response)
				.then(respUrl => message.reply(respUrl))
				.catch(err => console.error(`ERROR: cannot upload to gcs. ${err}`));
		}
		else return message.reply(response);
	}
}

function sendToGCS(text) {
	return new Promise((fulfill, reject) => {
		let uid =  Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
		let file = bucket.file(uid);
		let buff = new Buffer.from(text);
		//todo upload text to gcs
		if (!text)
			reject('no text to upload');

		let stream = file.createReadStream(buff, {
			metadata: {
				contentType: 'text/plain'
			}
		})
		.on('error', reject)
		.on('finish', () => {
			if (DEBUG === 2) console.log('uploaded ' + uid);
			fulfill('https://storage.googleapis.com/snesbot-overflow/' + uid);
		});
	});
}
*/


/*
https.get('https://www.smwcentral.net/?p=memorymap&game=smw&region=ram&max=', resp => {
	let data = '';

	resp.on('data', chunk => data += chunk);

	resp.on('end', () => console.log(data));
}).on('error', err => console.error(err));
 */
