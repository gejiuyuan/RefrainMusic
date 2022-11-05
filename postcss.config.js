/** @format */

const PostcssPxtorem = require('postcss-pxtorem');

module.exports = {
	plugins: [
		PostcssPxtorem({
			propList: ['*'],
		}),
	],
};
