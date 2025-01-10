export interface INavbarData {
    routerLink?: string;
    icon?: string;
    Label: string;
    expanded?: boolean;
    color?: string;
    light?: string;
    access: string[];
    items?: INavbarData[];
}