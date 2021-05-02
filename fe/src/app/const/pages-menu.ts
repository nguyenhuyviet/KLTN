import { NbMenuItem } from '@nebular/theme';

export const MENU_ITEMS: NbMenuItem[] = [
  {
    title: 'Chạy quy trình',
    icon: 'play-circle-outline',
    link: '/pages/process-execution',
    home: true,
  },
  {
    title: 'Quy trình cần tôi duyệt',
    icon: 'repeat-outline',
    link: '/pages/process-related',
  }, 
  {
    title: 'Quy trình đã hoàn thành',
    icon: 'checkmark-square-outline',
    link: '/pages/process-done',
  }, 
  {
    title: 'Quản lý quy trình',
    group: true,
  },
  {
    title: 'Tạo quy trình mới',
    icon: 'options-2-outline',
    link: '/pages/process/create',
  },
  {
    title: 'Danh sách quy trình',
    icon: 'list-outline',
    link: '/pages/process',
  },
  {
    title: 'Nhóm quy trình',
    icon: 'briefcase-outline',
    link: '/pages/process-group',
  },
  {
    title: 'Người dùng',
    group: true,
  },
  {
    title: 'Nhóm người dùng',
    icon: 'people-outline',
    link: '/pages/user-group',
  },
  {
    title: 'Thiết lập người dùng',
    icon: 'person-add-outline',
    link: '/pages/user-setting',
  },
];
