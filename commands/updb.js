const _ = require('lodash');
const fs = require('fs');
const https = require('https');
const Promise = require('promise');

let SMW_RAM = require('../var/SMW/RAM.json');
let SMW_ROM = require('../var/SMW/ROM.json');

module.exports = {
	name: 'updb',
	description: 'ups the db. do not use',
	args: false,
	usage: 'don\'t',
	helpDoc: 'placeholder',
	execute(message, args) {

		updateSMWMaps()
			.then(() => {
				console.log('MAPS UPDATED!!!');
				return 'YES SUCCESS!!!';
				//return message.reply('maps updated!');
			})
			.catch(err => {
				console.error('u fucked up', err)
				return 'BAD ERROR!'
				//message.reply('*ERROR UPDATING MAP(S)*:', err)
			});
		//updateYIMaps();
	}
};

function genericFetch(url) {
	return new Promise((fulfill, reject) => {
		let data = [];
		https.get(url, response => {
			console.log('status code:', response.statusCode);
			if (response.statusCode !== 200)
				reject('HTTP RESPONSE ERROR:', response);

			response.on('data', chunk => {
				data.push(chunk);
			});

			response.on('end', () => {
				try {
					const parsedData = JSON.parse(data.join(''));
					console.log('PARSED!');
					fulfill(parsedData);
				} catch (e) {
					reject('PARSE ERROR:', e);
				}
			});
		}).on('error', err => reject('HTTP REQUEST ERROR:', err))
	})
}

function updateSMWMaps() {
	return new Promise((fulfill, reject) => {
		const MAPS = [
			{
				currentData: SMW_RAM,
				type: 'RAM',
				url: 'https://www.smwcentral.net/ajax.php?a=getmap&m=smwram'
			},
			{
				currentData: SMW_ROM,
				type: 'ROM',
				url: 'https://www.smwcentral.net/ajax.php?a=getmap&m=smwrom'
			}
		];
		let promises = [];
		MAPS.forEach(map => {
			promises.push(new Promise((fulfill, reject) => {
				updateMap('SMW', map.type, map.currentData, map.url)
					.then(fulfill)
					.catch(reject)
			}));
			///console.log('promise length:', promises.length, promises);
		});

		/* continue when all maps are updated */
		if (promises.length)
			Promise.all(promises)
				.then(fulfill)
				.catch(reject);
	});
}

function updateYIMaps() {
	// updateYIRAM();
	// updateYISRAM();
	// updateYIROM();
}

//updates currentData if data at url is newer
function updateMap(game, mapType, currentData, url) {
	return new Promise((fulfill, reject) => {
		genericFetch(url)
			.then(parsedMap => {
				console.log('SUCCESSFULLY PARSED:', parsedMap[0]);
				console.log('parsed length:', parsedMap.length);
				console.log('base map length:', currentData.length);
				console.log('saving...')

				if (parsedMap.length >= (currentData.length || 0)) {
					saveMap(game, mapType, parsedMap)
						.then(fulfill)
						.catch(reject);
				}
			})
			.catch((err, data) => {
				console.error(err, data);
				reject(err, data);
			});
	});
}

function saveMap(game, mapType, parsedMap) {
	return new Promise((fulfill, reject) => {
		const mapPath = '../var/' + game + '/' + mapType + '.json';
		let mapString = '{}';
		console.log('PRE-WRITE MAP:', parsedMap[0]);
		try {
			mapString = JSON.stringify(parsedMap);
			console.log('stringified:', mapString[0]);
		} catch (e) {
			reject('ERROR WRITING TO FILE:', e);
		}
		fs.writeFile(mapPath, mapString, err => {
			if (err) {
				console.error('ERROR SAVING FILE:', err);
				reject({error: err, msg: 'ERROR SAVING FILE'});
			}
			console.log(`saved ${game} ${mapType} map data successfully! path: ${mapPath}`);
			fulfill();
		});
	});
}


