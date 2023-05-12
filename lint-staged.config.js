// lint-staged 配置文件   // "*.{scss,vue}": "stylelint --syntax=scss"
module.exports = {
  'src/**/*.{js,jsx,vue}': 'eslint --max-warnings=0',
  '*.{css,scss,vue}': 'stylelint'
}
