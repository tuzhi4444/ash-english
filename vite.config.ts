import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { viteSingleFile } from 'vite-plugin-singlefile';

/** 交付产物的正式标题（index.html 里那个是开发期的警示标题） */
const APP_TITLE = 'Ash英语 · 听说一体训练';

/**
 * index.html 同时充当两个角色：Vite 的开发入口，和构建产物的模板。
 * 开发入口里放了"你打开错文件了"的兜底提示（防止双击源码得到一片白屏），
 * 但那段提示和警示标题不能跟着进产物——所以构建时在这里剥掉、换回正式标题。
 */
function stripDevFallback(): Plugin {
  return {
    name: 'strip-dev-fallback',
    apply: 'build',
    transformIndexHtml(html) {
      return html
        .replace(/<title>[\s\S]*?<\/title>/, `<title>${APP_TITLE}</title>`)
        .replace(/<!--dev-fallback-start-->[\s\S]*?<!--dev-fallback-end-->/, '');
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  // 相对路径：产物不依赖站点根目录，放哪个文件夹都能跑
  base: './',
  plugins: [
    react(),
    stripDevFallback(),
    // 把 JS/CSS 全部内联进 index.html，构建出单个可双击打开的文件。
    // 必须内联而不能只改成相对路径：file:// 下的 ES module 会被 CORS 拦掉
    // （origin 为 null），外链脚本一律加载不了，页面只会白屏。
    viteSingleFile(),
  ],
});
