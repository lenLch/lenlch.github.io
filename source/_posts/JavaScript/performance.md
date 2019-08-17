---
title: performance
date: 2019-05-04 20:20:22
tags:
- Performance Optimize
categories:
- JavaScript
---

1. 动态 import
2. ui 组件按需加载
3. 使用 CDN, webpack `externals: { "echarts": "echarts" }`
4. 开启 Gzip 压缩 `devServer: { compress: true }`



Tree Shaking: 打包时把一些没用到的代码删除, 保证打包后的体积最小.
babelrc: modules: false
package.json: sideEffects: false/ [.css, .less, .sass]

Code Spliting: 代码分割
	
分离第三方库:
```
webpack.base.conf.js
optimization: {
	splitChunks: {
		cacheGroups: {
			venders: {
				test: /node_modules/,
				name: 'vendors',
				chunks: 'all'
			}
		}
	}
}
```

动态导入 / 按需加载
比如路由配置的时候进行动态导入

提取复用的业务代码
```
default: {
	minSize: 0,
	minChunks: 2,
	reuseExistingChunk: true,
	name: 'utils'
}
```

分离非首页使用且复用程度小的第三方库
```
lodash: {
	test: /node_modules\/lodash\//, // lodash 库单独打包，并命名为 vender-lodash
	name: 'vender-lodash'
}
```
缓存:
```
optimization: {
	runtimeChunk: {
		name: 'mainfest'
	}
}
```

使用内置的hashedModulesPlugin

webpack plugin:
	webpack-bundle-analyzer, 将打包结果显示到网页上


兼容问题:
	1. 不同的浏览器的默认样式不同, 可以使用 normalize.css 抹平这些差异. 或者直接 margin:0; padding: 0;

	2. html5shiv.js 解决 ie9 以下浏览器对 html5 新增标签不识别的问题.

	3. respond.js 解决ie9 一下浏览器不支持 css3 Media Query 问题

	4. IE 条件注释

	5. IE 属性过滤器 (hack)

	6. 浏览器 css 兼容前缀
		-o- opera
		-ms- IE
		-moz- Firefox
		-webkit- Chrome

	7. a 标签的几种 css 状态的顺序 love hate

	8. css: normalize 
	
	9. 事件: addEventListener, removeEventListener / attachEvent, detachEvent
	10. 获取一些属性: document.documentElement.属性 | document.body.属性
	11. 在header 里面添加一些浏览器的 hack.
	12. IE不能使用 opacity: filter: 

webpack:

常见的loader: file-loader, url-loader, source-map-loader, image-loader, babel-loader, css-loader, style-loader, eslint-loader.

常见的plugin: commons-chunk-plugin, html-webpack-plguin, uglify-js-pugin, extract-text-plugin, define-plugin, hotModuleReplacementPlguin, webpack-bundler-analyzer, compression-webpack-plugin, 