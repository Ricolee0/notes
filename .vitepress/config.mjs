import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  base: "/notes/",
  title: "Rico's notes",
  description: "",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: nav(),

    sidebar: {
      '/books/': { base: '/books/', items: sidebarBooks() }
    }
  }
})

function nav() {
  return [
    {
      text: '读书笔记',
      link: '/books/elephant_uml',
      activeMatch: '/books/'
    },
    // {
    //   text: '参考',
    //   link: '/zh/reference/site-config',
    //   activeMatch: '/zh/reference/'
    // }
  ]
}


function sidebarBooks() {
  return [
    {
      text: '软件&架构设计',
      collapsed: false,
      items: [
        { text: '大象：Thinking in UML', link: 'elephant_uml' },
        { text: 'ThoughtWorks 现代企业架构白皮书', link: 'thoughtWorks' }
      ]
    }
  ]
}

// thoughtWorks