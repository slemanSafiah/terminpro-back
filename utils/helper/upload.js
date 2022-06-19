const multer = require('multer');
const path = require('path');

const upload = multer({
	storage: multer.memoryStorage(),
	// limits: {
	// 	fileSize: 1024 * 1024 * 5,
	// },
	fileFilter: function (req, file, cb) {
		checkFileType(req, file, cb);
	},
});

function checkFileType(req, file, cb) {
	const fileTypes = /jpeg|jpg|png|gif/;
	const extname = fileTypes.test(path.extname(file.originalname).toLocaleLowerCase());
	const mimeType = fileTypes.test(file.mimetype);
	if (mimeType && extname) {
		return cb(null, true);
	} else {
		return cb('Error : images only');
	}
}

exports.upload = upload;
