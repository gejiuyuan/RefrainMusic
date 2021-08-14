module.exports = {
  '*.{ts,tsx,scss,js,jsx,json,html,css,md,}': ['npm run prettier'],
  '*.ts?(x)': ['npm run check:eslint']
}