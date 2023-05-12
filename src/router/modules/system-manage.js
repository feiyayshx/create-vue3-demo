/*系统管理路由配置*/
import EmployeeManage from '@/views/system-manage/employee-manage/employee-manage.vue'
import RoleManage from '@/views/system-manage/role-manage/role-manage.vue'
export const systemManageRouter = [
  /* 员工管理 */
  {
    path: 'system-manage/employee-manage',
    name: 'employeeManage',
    component: EmployeeManage,
    meta: {
      title: '员工管理'
    }
  },
  /* 角色管理 */
  {
    path: 'system-manage/role-manage',
    name: 'roleManage',
    component: RoleManage,
    meta: {
      title: '角色管理'
    }
  }
]
export default systemManageRouter
