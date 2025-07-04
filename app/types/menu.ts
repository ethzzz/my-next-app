export interface MenuItem {
    key: string;
    label: string;
    name?: string;
    icon?: React.ReactNode;
    children?: MenuItem[];
    path?: string;
    component?: React.ComponentType<any>;
    isExternal?: boolean; // Indicates if the link is external
}