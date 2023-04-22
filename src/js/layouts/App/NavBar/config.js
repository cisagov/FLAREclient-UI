import {
    PieChart as PieChartIcon,
//    Users as UsersIcon,
//    Settings as SettingsIcon,
} from "react-feather";

import {
  Computer as ComputerIcon,
//  Notifications as NotificationIcon,
  Policy as EventIcon,
//  BlurOn as ContentIcon,
  BatteryUnknown as StatusIcon,
  FormatListBulleted as LogsIcon,
  CheckBox as AuditsIcon
} from '@material-ui/icons';
export const navConfig = [
    {
        subheader: 'Reports',
        items:[
            {
                title: 'Dashboard',
                icon: PieChartIcon,
                href: '/app/reports/dashboard'
            },
            {
                title: 'Events',
                icon: EventIcon,
                href: '/app/reports/events'
            },
            {
                title: 'Status',
                icon: StatusIcon,
                href: '/app/reports/status'
            }
        ]
    },
    {
        subheader: 'Management',
        requireAdmin: true,
        items: [
            {
                title: 'Servers',
                icon: ComputerIcon,
                href: '/app/management/servers',
                requireAdmin: true
            },
//            {
//                title: 'Content',
//                icon: ContentIcon,
//                href: '/app/management/content'
//            },
//            {
//                title: 'Users',
//                icon: UsersIcon,
//                href: '/app/management/users',
//                requireAdmin: true
//            },
//            {
//                title: 'Notifications',
//                icon: NotificationIcon,
//                href: '/app/management/notifications'
//            },
            {
                title: 'Logs',
                icon: LogsIcon,
                href: '/app/management/logs',
                requireAdmin: true
            },
            {
                title: 'Audits',
                icon: AuditsIcon,
                href: '/app/management/audits',
                requireAdmin: true
            }
        ]
    },
//    {
//        subheader: 'Configuration',
//        items: [
//            {
//                title: 'Client Settings',
//                icon: SettingsIcon,
//                href: '/app/management/settings',
//            }
//        ]
//    },
];
