module.exports = {
	root: true,

	env: {
		node: true
	},

	extends: ["plugin:vue/essential", "@vue/prettier"],

	rules: {
		"prettier/prettier": {
			"tabs": true,
		},
		"no-console": "off",
		"no-debugger": "off",
		"vue/array-bracket-spacing": "warning",
		"vue/arrow-spacing": "warning",
		"vue/eqeqeq": "warning",
		"indent": ["error", "tab"]
	},

	parserOptions: {
		parser: "babel-eslint"
	}
};
