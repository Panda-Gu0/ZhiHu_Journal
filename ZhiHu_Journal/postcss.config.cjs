// PostCSS 插件,用于将 px 单位转化为 rem 单位
module.exports = {
    plugins: {
      'postcss-pxtorem': {
        rootValue: 37.5,
        propList: ['*'],
      },
    },
  };
  
  