exports.imageHandler = async (req, res, next) => {
	if (req.file) {
		const image = req.file;
		req.body.profilePhoto = {
			filename: Date.now().toString() + image.originalname,
			size: image.size,
			buffer: image.buffer,
		};
	}

	if (req.files) {
		if (req.files.photo) {
			const image = req.files.photo[0];
			req.body.photo = {
				filename: Date.now().toString() + image.originalname,
				size: image.size,
				buffer: image.buffer,
			};
		}
		if (req.files.album) {
			let imageArr = [...req.files.album];
			let album = imageArr.map((img) => {
				return {
					filename: Date.now().toString() + img.originalname,
					size: img.size,
					buffer: img.buffer,
				};
			});
			req.body.album = album;
		}
	}
	next();
};
