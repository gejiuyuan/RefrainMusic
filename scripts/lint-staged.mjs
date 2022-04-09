/** 
 * 对commit的文件进行一系列检测
 */

import lintStaged from 'lint-staged';

const formatCmd = ["npm run prettier"];

const checkCmd = ["npm run check"];

const globCmdMap = { 
  "*.{ts,tsx,html,scss,css,js,mjs,jsx,md}": formatCmd,
  "*.{ts,tsx,js,mjs}": checkCmd,
  "*.d.ts": checkCmd
}

const config = { 
  concurrent: false,
  // configPath: '../lint-staged.config.js',
  config: globCmdMap,
  cwd: process.cwd(), 
  maxArgLength: null, 
}

try {
  const success = await lintStaged(config);
  console.log(success ? 'lint-staged检验成功!' : 'lint-staged检验失败!')
} catch (e) {
  // Failed to load configuration
  console.error(e)
}