// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require("prism-react-renderer/themes/github");
const darkCodeTheme = require("prism-react-renderer/themes/dracula");


/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "ChatGPT提问模版-快速使用ChatGPT工作学习赚钱",
  // tagline: '方便中文使用 ChatGPT 快捷指令',
  favicon: 'https://tiwen.redtom.com/static/imgs/index/logo.png',

  // 站点 URL
  url: "https://tiwen.redtom.com/",
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  // baseUrl: '/chatgpt/',
  // 站点的 base URL，带有末尾斜杠。
  baseUrl: "/",

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: "redtom", // Usually your GitHub org/user name.
  projectName: "ChatGPT-prompts", // Usually your repo name.

  onBrokenLinks: "log",
  onBrokenMarkdownLinks: "warn",

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: "zh-Hans",
    locales: ["zh-Hans"],
  },

  presets: [
    [
      "classic",
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        /* docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
        }, */
        theme: {
          customCss: require.resolve("./src/css/custom.css"),
        },
        gtag: {
          trackingID: "G-RWKZTY2P9R",
          anonymizeIP: false,
        },
      }),
    ],
  ],
  plugins: [
    [
      "ideal-image",
      /** @type {import('@docusaurus/plugin-ideal-image').PluginOptions} */
      ({
        quality: 70,
        max: 1030,
        min: 640,
        steps: 2,
        // Use false to debug, but it incurs huge perf costs
        disableInDev: true,
      }),
    ],
    "./plugins/piwik.js",
    "./plugins/instantpage.js",
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Replace with your project's social card
      // image: 'img/docusaurus-social-card.jpg',
      metadata: [{
        name: "keywords",
        content: "prompt,ChatGPT,AI prompts,提示词"
      }, ],
      navbar: {
        title: '',
        logo: {
          alt: "ChatGPT Shortcuts",
          src: 'https://tiwen.redtom.com/static/imgs/index/logo-zh-v1.svg',
          href: 'https://tiwen.redtom.com',
        },
        items: [{
            to: 'https://ai.redtom.com/console/create',
            label: 'AI创作',
            position: 'left',
            className: 'nav-text-gray'
          },
          {
            to: 'http://chat.redtom.com/',
            label: 'AI聊天',
            position: 'left',
            className: 'nav-text-gray'
          },
          {
            to: 'https://tiwen.redtom.com',
            label: 'AI提示库',
            position: 'left',
            className: 'nav-text-light'
          }
        ],
      },
      footer: {
        style: "dark",
        copyright: `<div></div>`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),
};

module.exports = config;