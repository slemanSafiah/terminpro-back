const { Exception, httpStatus } = require('../../../../utils');
const Category = require('./Category');
const paths = require('../../../../paths');
const fs = require('fs').promises;

async function uploadImage(photo) {
	let image = Buffer.from(photo, 'base64');
	let fileName = Date.now().toString() + '.jpg';
	await fs.writeFile(`./uploads/category/${fileName}`, image);
	return `/uploads/category/${fileName}`;
}

class CategoryService {
	constructor(data) {
		this.name = data.name;
	}

	async save() {
		const result = await new Category(this).save();
		return { data: result };
	}

	async update(id) {
		const category = await Category.findOne({ _id: id });
		if (!category) throw new Exception(httpStatus.CONFLICT, 'Category not found');
		if (this.image) this.image = await uploadImage(this.image);

		const result = await Category.findOneAndUpdate({ _id: id }, this, {
			omitUndefined: true,
			useFindAndModify: false,
			new: false,
		});
		if (!result) throw new Exception(httpStatus.INTERNAL_SERVER_ERROR, 'Error in update Category data');
		if (result.image) await fs.unlink(`${paths.app}/${result.image}`);

		return { data: result };
	}

	static async delete(id) {
		console.log(id);
		const result = await Category.findOneAndDelete({ _id: id });
		return { msg: 'done' };
	}

	static async getById(id) {
		//FIXME
		const result = await Category.findById(id);
		if (!result) throw new Exception(httpStatus.NOT_FOUND, 'Category not found');
		result.image = `http://161.35.193.253/media2/${result.image.slice(9)}`;
		return { data: result };
	}

	static async getAllCategories() {
		//FIXME
		const result = await Category.find({});
		return { data: result };
	}
}

module.exports = CategoryService;
