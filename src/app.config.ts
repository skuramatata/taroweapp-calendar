export default {
  pages: [
    'pages/login/login',
    'pages/index/index',
    'pages/approve/approve'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'WeChat',
    navigationBarTextStyle: 'black'
  },
  tabBar: {
    'backgroundColor': '#fafafa',
    'borderStyle': 'white',
    'selectedColor': '#AB956D',
    'color': '#666',
    'list': [
      { 'text': '日程', 'pagePath': 'pages/index/index', 'iconPath': 'assets/calender.png', 'selectedIconPath': 'assets/calender-s.png' },
      { 'text': '审批', 'pagePath': 'pages/approve/approve', 'iconPath': 'assets/approve.png', 'selectedIconPath': 'assets/approve-s.png' }
    ]
  },
  "networkTimeout": {
    "request": 10000,
    "downloadFile": 10000
  },
  "debug": true,
}
