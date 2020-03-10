module.exports = {
	root: true,

	env: {
		node: true
	},

	extends: ["plugin:vue/essential", "@vue/prettier"],

	rules: {
		"prettier/prettier": {
			tabs: false
		},
		"no-console": "off",
		"vue/max-attributes-per-line": [
			4,
			{
				singleline: 20,
				multiline: {
					max: 1,
					allowFirstLine: false
				}
			}
		],
		"no-debugger": "off",
		"vue/array-bracket-spacing": "warning",
		"vue/arrow-spacing": "warning",
		"vue/eqeqeq": "warning",
		indent: ["off", "tab"],
		printWidth: 150
	},

	parserOptions: {
		parser: "babel-eslint"
	}
};
