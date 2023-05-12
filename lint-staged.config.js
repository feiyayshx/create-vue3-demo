// lint-staged 配置文件
module.exports = {
  'src/**/*.{js,jsx,vue}': 'eslint --max-warnings=0',
  // '*.{css,scss,vue}': 'stylelint',
  "*.css": "stylelint",
  "*.scss": "stylelint --syntax=scss"
}
