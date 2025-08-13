export default {
  plugins: {
    // 自动添加浏览器前缀
    autoprefixer: {
      overrideBrowserslist: [
        '> 1%',
        'last 2 versions',
        'not dead',
        'not ie <= 11'
      ],
      grid: true
    },
    
    // CSS压缩和优化（仅在生产环境）
    ...(process.env.NODE_ENV === 'production' ? {
      cssnano: {
        preset: ['default', {
          // 保留重要的注释
          discardComments: {
            removeAll: false,
          },
          // 优化CSS规则
          normalizeWhitespace: true,
          // 合并相同的规则
          mergeLonghand: true,
          // 压缩颜色值
          colormin: true,
          // 优化字体权重
          minifyFontValues: true,
          // 优化选择器
          minifySelectors: true,
          // 移除未使用的CSS规则
          discardUnused: false, // 设为false避免误删
          // 压缩SVG
          svgo: {
            plugins: [
              {
                name: 'preset-default',
                params: {
                  overrides: {
                    removeViewBox: false,
                  },
                },
              },
            ],
          },
        }]
      }
    } : {})
  }
};
