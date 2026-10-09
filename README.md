# 抽签转盘

独立的中文静态抽签工具。米白、深蓝灰和棕色的视觉元素参考 Wency 的个人网站源码；个人网站仓库未作修改。

## 本地运行

在仓库目录执行 `python3 -m http.server 8000 --bind 127.0.0.1`，用浏览器访问本地服务。无需安装依赖或构建。逻辑测试：`node --test tests/wheel.test.mjs`（Node.js 24）。

每行一个选项，支持 2–50 行非空内容。重复内容视为独立选项。使用 Web Crypto 和拒绝采样进行等概率抽取；转盘停在所选扇区中心。输入通过 textContent 显示，不解析为 HTML，不存储或上传。所有资源随站点提供，字体使用设备自带字体。支持原生键盘按钮操作和减少动画偏好。

## GitHub Pages

在 `LiviaM123/lucky-wheel` 的 Settings → Pages 中选择 **GitHub Actions**。推送到 main 后 `.github/workflows/pages.yml` 自动测试并部署。

预期公开网址：`https://liviam123.github.io/lucky-wheel/`。是否已经上线以成功的 Actions 部署及公开页面验证为准。完全免费，无需域名或服务器。GitHub Pages 在中国大陆的可访问性不作保证，需要朋友在国内关闭 VPN 后测试；本网站不加载外部字体、CDN 或接口。
