const Tag = require("../models/tag.model");

class TagService {
	static async getAllTags() {
		return await Tag.find();
	}
}

module.exports = TagService;
