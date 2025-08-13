import { defineConfig } from 'vite';
import legacy from '@vitejs/plugin-legacy';
import { createHtmlPlugin } from 'vite-plugin-html';
import { visualizer } from 'rollup-plugin-visualizer';
// import viteImagemin from 'vite-plugin-imagemin';
import { resolve } from 'path';

export default defineConfig({
  // 基础配置
  base: './',
  
  // 构建配置
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    minify: 'terser',
    
    // 代码分割配置
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        // 如果有其他HTML页面，可以在这里添加
        // about: resolve(__dirname, 'about.html'),
      },
      output: {
        // 静态资源文件名配置
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          const fileName = assetInfo.names?.[0] || assetInfo.name || '';

          if (/\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/i.test(fileName)) {
            return `assets/media/[name]-[hash][extname]`;
          }
          if (/\.(png|jpe?g|gif|svg|webp|avif)(\?.*)?$/i.test(fileName)) {
            return `assets/images/[name]-[hash][extname]`;
          }
          if (/\.(woff2?|eot|ttf|otf)(\?.*)?$/i.test(fileName)) {
            return `assets/fonts/[name]-[hash][extname]`;
          }
          if (/\.css$/i.test(fileName)) {
            return `assets/css/[name]-[hash][extname]`;
          }
          if (/\.json$/i.test(fileName)) {
            return `assets/js/[name]-[hash][extname]`;
          }
          return `assets/[name]-[hash][extname]`;
        },
      },
    },
    
    // Terser压缩配置
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    
    // 资源内联阈值
    assetsInlineLimit: 4096,
  },
  
  // 开发服务器配置
  server: {
    port: 3000,
    open: true,
    cors: true,
    host: true,
  },
  
  // 预览服务器配置
  preview: {
    port: 4173,
    open: true,
    cors: true,
    host: true,
  },
  
  // 插件配置
  plugins: [
    // HTML处理插件
    createHtmlPlugin({
      minify: true,
      inject: {
        data: {
          title: 'Heat Transfer Oil System Retrofit',
          description: 'Professional heat transfer oil system retrofit solution',
        },
      },
    }),

    // 浏览器兼容性插件
    legacy({
      targets: ['defaults', 'not IE 11'],
      additionalLegacyPolyfills: ['regenerator-runtime/runtime'],
      renderLegacyChunks: true,
      polyfills: [
        'es.symbol',
        'es.array.filter',
        'es.promise',
        'es.promise.finally',
        'es/map',
        'es/set',
        'es.array.for-each',
        'es.object.define-properties',
        'es.object.define-property',
        'es.object.get-own-property-descriptor',
        'es.object.get-own-property-descriptors',
        'es.object.keys',
        'es.object.to-string',
        'web.dom-collections.for-each',
        'esnext.global-this',
        'esnext.string.match-all'
      ]
    }),

    // 图片优化插件（暂时禁用，可以手动启用）
    // process.env.NODE_ENV === 'production' && viteImagemin({
    //   gifsicle: {
    //     optimizationLevel: 7,
    //     interlaced: false,
    //   },
    //   mozjpeg: {
    //     quality: 80,
    //     progressive: true,
    //   },
    //   pngquant: {
    //     quality: [0.65, 0.8],
    //     speed: 4,
    //   },
    //   svgo: {
    //     plugins: [
    //       {
    //         name: 'removeViewBox',
    //         active: false,
    //       },
    //       {
    //         name: 'removeEmptyAttrs',
    //         active: false,
    //       },
    //     ],
    //   },
    // }),

    // 构建分析插件（仅在分析模式下启用）
    ...(process.env.ANALYZE ? [visualizer({
      filename: 'dist/stats.html',
      open: true,
      gzipSize: true,
      brotliSize: true,
    })] : []),
  ],
  
  // CSS配置
  css: {
    postcss: {
      plugins: [
        // 可以在这里添加PostCSS插件
      ],
    },
  },
  
  // 静态资源处理
  assetsInclude: ['**/*.xml', '**/*.txt', '**/*.json'],

  // 公共文件处理
  publicDir: 'public',
});
