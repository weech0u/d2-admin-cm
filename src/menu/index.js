import { uniqueId } from 'lodash'

/**
 * @description 给菜单数据补充上 path 字段
 * @description https://github.com/d2-projects/d2-admin/issues/209
 * @param {Array} menu 原始的菜单数据
 */
function supplementPath (menu) {
  return menu.map(e => ({
    ...e,
    path: e.path || uniqueId('d2-menu-empty-'),
    ...e.children ? {
      children: supplementPath(e.children)
    } : {}
  }))
}

export const menuHeader = supplementPath([
//   { path: '/index', title: '首页', icon: 'home' },
])

export const menuAside = supplementPath([
  { path: '/index', title: '首页', icon: 'home' },
  {
    title: '公司管理',
    icon: 'folder-o',
    children: [
      { path: '/page1', title: '公司列表' },
    ]
  },
  {
    title: '合同管理',
    icon: 'folder-o',
    children: [
      { path: '/page2', title: '合同列表' },
    ]
  },
  {
    title: '服务管理',
    icon: 'folder-o',
    children: [
      { path: '/page3', title: '服务列表' },
    ]
  },
])
