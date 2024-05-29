import { defineConfig } from 'vitepress'
import { genSide } from './utils.mjs'

export default defineConfig({
  base: "/notes/",
  head: [['link', { rel: 'icon', href: '/notes/favicon-32x32.png' }]],
  title: "Rico's notes",
  description: "",
  themeConfig: {
    nav: nav(),
    sidebar: {
      '/books/': { base: '/books/', items: await sidebarBooks() },
      '/engineering/': { base: '/engineering/', items: await sidebarEngineering() },
      '/interview/': { base: '/interview/', items: await sidebarInterview() },
      '/others/': { base: '/others/', items: await sidebarOthers() },
    },
    search: {
      provider: "local"
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
    {
      text: '前端工程',
      link: '/engineering/node_version',
      activeMatch: '/engineering/'
    },
    {
      text: '面试八股文',
      link: '/interview/cache',
      activeMatch: '/interview/'
    },
    {
      text: '其他',
      link: '/others/abbreviation',
      activeMatch: '/others/'
    },
  ]
}


async function sidebarBooks() {
  return [
    {
      text: '软件&架构设计',
      collapsed: false,
      items: await genSide('../books')
    }
  ]
}

async function sidebarEngineering() {
  return [
    {
      text: '解决方案',
      collapsed: false,
      items: await genSide('../engineering')
    }
  ]
}

async function sidebarInterview() {
  return [
    {
      text: '解决方案',
      collapsed: false,
      items: await genSide('../interview')
    }
  ]
}

async function sidebarOthers() {
  return [
    {
      text: '其他',
      collapsed: false,
      items: await genSide('../others')
    }
  ]
}
