/**
 * @introduction 详见： 
 *  eslint rules： https://eslint.bootcss.com/docs/rules/
 *  eslint typescript rules： https://www.npmjs.com/package/@typescript-eslint/eslint-plugin
 */
module.exports = {
    "env": {
        "browser": true,
        "es2021": true
    },
    "extends": [
        "eslint:recommended",
        "plugin:vue/essential",
        "plugin:@typescript-eslint/recommended"
    ],
    "parserOptions": {
        "ecmaVersion": 12,
        "parser": "@typescript-eslint/parser",
        "sourceType": "module"
    },
    "plugins": [
        "vue",
        "@typescript-eslint"
    ],
    "rules": {
        "no-alert": "off",
        "no-unsafe-finally": "off",
        "no-empty": "off",
        "no-extra-boolean-cast": "off",
        //是否禁用不必要的\转义字符
        "no-useless-escape": "off",
        "@typescript-eslint/no-var-requires": "off",
        "@typescript-eslint/no-empty-function": "off",
        "@typescript-eslint/no-unused-vars": "off",
        //允许!非空断言
        "@typescript-eslint/no-non-null-assertion": "off",
        //允许声明any类型
        "@typescript-eslint/no-explicit-any": "off",
        //导出函数和类的公共类方法是否需要显式返回和参数类型 
        "@typescript-eslint/explicit-module-boundary-types": "off",
        //是否允许空接口（interface）
        "@typescript-eslint/no-empty-interface": ["off"],
        //是否允许有额外的分号（;），如{}块级作用域后就不需要;
        "@typescript-eslint/no-extra-semi": ["warn"]
    }
};
