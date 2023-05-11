// lint-staged 配置文件
export default {
  'src/**/*.{js,jsx,vue}': 'eslint --max-warnings=0',
  // '*.{css,scss,vue}': 'stylelint',
  "*.css": "stylelint",
  "*.scss": "stylelint --syntax=scss"
}
