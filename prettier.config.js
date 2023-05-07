/** @format */

const os = require('os');

const conf = {
	//是否制表符替代空格控制缩进
	useTabs: true,

	tabWidth: 2,

	//一行最大宽度，90个字符
	printWidth: 90,

	//每一行后始终打印分号
	semi: true,

	endOfLine: os.platform() === 'win32' ? 'crlf' : 'lf',

	//字符串使用单引号
	singleQuote: true,

	quoteProps: 'as-needed',

	//文字和括号之间打印空格
	bracketSpacing: true,

	//使用(x)=>x形式，而非x=>x
	arrowParens: 'always',

	//尾随逗号处理
	//详见https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Trailing_commas#trailing_commas_in_functions
	trailingComma: 'all',

	insertPragma: true,
	embeddedLanguageFormatting: 'off',

	//对html等daima进行换行
	//详见：https://www.prettier.cn/docs/options.html#html-whitespace-sensitivity
	htmlWhitespaceSensitivity: 'strict',

	//对.vue文件进行代码缩进
	vueIndentScriptAndStyle: true,
};

module.exports = conf;
