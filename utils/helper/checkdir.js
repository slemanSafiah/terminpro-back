const fs = require('fs');
const path = require('path');

exports.checkDir = (filePath) => {
	return new Promise(async (resolve, reject) => {
		let dir = path.dirname(filePath);
		fs.access(dir, async (err) => {
			if (err) {
				console.log(err);
				await fs.mkdir(dir, () => {
					resolve(true);
					
				});
			} else {
				resolve(true);
			}
		});
	});
};
