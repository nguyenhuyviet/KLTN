import { NbMenuItem } from '@nebular/theme';
import { Role } from '../enums/role.enum';

export const MENU_ITEMS: NbMenuItem[] = [
  {
    title: 'Chạy quy trình',
    icon: 'play-circle-outline',
    link: '/pages/process-execution',
    home: true,
    data: { roles: [Role.Employee, Role.CBQL, Role.QTHT] }
  },
  {
    title: 'Quy trình cần tôi duyệt',
    icon: 'repeat-outline',
    link: '/pages/process-related',
    data: { roles: [Role.Employee, Role.CBQL, Role.QTHT] }
  },
  {
    title: 'Quy trình đã hoàn thành',
    icon: 'checkmark-square-outline',
    link: '/pages/process-done',
    data: { roles: [Role.Employee, Role.CBQL, Role.QTHT] }
  },
  {
    title: 'Quản lý quy trình',
    group: true,
    data: { roles: [ Role.CBQL] }
  },
  {
    title: 'Tạo quy trình mới',
    icon: 'options-2-outline',
    link: '/pages/process/create',
    data: { roles: [ Role.CBQL] }
  },
  {
    title: 'Danh sách quy trình',
    icon: 'list-outline',
    link: '/pages/process',
    data: { roles: [ Role.CBQL] }
  },
  {
    title: 'Nhóm quy trình',
    icon: 'briefcase-outline',
    link: '/pages/process-group',
    data: { roles: [ Role.CBQL] }
  },
  {
    title: 'Người dùng',
    group: true,
    data: { roles: [ Role.CBQL, Role.QTHT] }
  },
  {
    title: 'Nhóm người dùng',
    icon: 'people-outline',
    link: '/pages/user-group',
    data: { roles: [ Role.CBQL, Role.QTHT] }
  },
  {
    title: 'Thiết lập người dùng',
    icon: 'person-add-outline',
    link: '/pages/user-setting',
    data: { roles: [ Role.QTHT] }
  },
];

