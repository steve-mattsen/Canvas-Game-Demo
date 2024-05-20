module.exports = {
	module: {
		rules: [
			{
				test: /\/public\/\.(png|svg|jpg|jpeg|gif)$/i,
				type: 'asset/resource',
			},
		]
	}
}