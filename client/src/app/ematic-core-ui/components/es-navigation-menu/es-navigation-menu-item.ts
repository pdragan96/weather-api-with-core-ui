export interface IEsNavigationMenuItem {
  iconCls?: string;
  text?: string;
  tooltip?: string;
  route: string;
  children?: IEsNavigationMenuItem[];
}

export interface IEsNavigationMenuOption {
  iconCls: string;
  tooltip?: string;
  action?: () => void;
}
