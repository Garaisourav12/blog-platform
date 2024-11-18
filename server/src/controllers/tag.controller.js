const TagService = require("../services/tag.service");

class TagController {
	static async getAllTags(req, res, next) {
		try {
			const tags = await TagService.getAllTags();
			return res.status(200).json({
				success: true,
				message: "Tags retrieved successfully",
				data: tags,
			});
		} catch (error) {
			next(error);
		}
	}
}

module.exports = TagController;
