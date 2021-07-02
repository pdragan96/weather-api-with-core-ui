import { Component, Input, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

import { cloneDeep } from 'lodash-es';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

import { IEsNavigationMenuItem, IEsNavigationMenuOption } from './es-navigation-menu-item';
import { subMenu, subMenuItem } from './es-navigation-menu-animations';

export interface IEsNavigationMenuNode {
  id: string;
  item: IEsNavigationMenuItem;
  level: number;
  parent?: IEsNavigationMenuNode;
  parents: IEsNavigationMenuNode[];
  hasChildren: boolean;
}

@Component({
  selector: 'es-navigation-menu',
  templateUrl: './es-navigation-menu.component.html',
  styleUrls: ['./es-navigation-menu.component.scss'],
  animations: [
    subMenu,
    subMenuItem
  ]
})
export class EsNavigationMenuComponent implements OnInit, OnChanges, OnDestroy {
  @Input() items: IEsNavigationMenuItem[];
  @Input() options: IEsNavigationMenuOption[];

  _init: boolean;

  routeChangeSubscription: Subscription;
  internalRouting: boolean;
  _activeRoute: string;

  flattenedItems: IEsNavigationMenuNode[];

  selectedItem: IEsNavigationMenuNode;
  mainItem: IEsNavigationMenuNode;

  previousAnimationState: string;

  mainItems: IEsNavigationMenuNode[];
  subItems: IEsNavigationMenuNode[];
  breadCrumbs: IEsNavigationMenuNode[];
  selectedBreadCrumb: IEsNavigationMenuNode;
  showSubMenu: boolean;

  constructor(private router: Router) {
    this._init = false;

    this.routeChangeSubscription = null;
    this.internalRouting = false;
    this._activeRoute = null;

    this.previousAnimationState = null;

    this.mainItems = [];
    this.subItems = [];
    this.breadCrumbs = [];
    this.selectedBreadCrumb = null;
    this.showSubMenu = false;

    this.items = [];
    this.options = [];
    this.flattenedItems = [];
  }

  static getFullRoute(node: IEsNavigationMenuNode): string {
    return node.parents.reduce((acc, current) => `/${ current.item.route }${ acc }`, '') + '/' + node.item.route;
  }

  ngOnInit() {
    this._init = true;

    const urlTree = this.router.parseUrl(this.router.url);
    this._activeRoute = '/' + urlTree.root.children['primary'].segments.map(urlSegment => urlSegment.path).join('/');

    this.init();
    this.selectActiveRoute();
  }

  ngOnChanges() {
    if (this._init) {
      this.init();
    }
  }

  init() {
    if (!this.routeChangeSubscription) {
      this.routeChangeSubscription = this.router.events
        .pipe(filter(event => event instanceof NavigationEnd))
        .subscribe(this.onNavigationEnd.bind(this));
    }

    this.flattenedItems = this.flatten(this.items, 1, null);

    this.mainItems = this.flattenedItems.filter(item => item.level === 1);
  }

  flatten(items: IEsNavigationMenuItem[], level: number, parent?: IEsNavigationMenuNode): IEsNavigationMenuNode[] {
    let flat = [];
    items.forEach((item, i) => {
      const node = <IEsNavigationMenuNode>{
        id: `${ level }.${ i + 1 }`,
        item: cloneDeep(item),
        level: level,
        parent: parent,
        parents: []
      };

      if (parent) {
        node.parents.push(parent);
        if (parent.parents) {
          node.parents = node.parents.concat(parent.parents);
        }
      }

      flat.push(node);

      if (item.children && item.children.length > 0) {
        node.hasChildren = true;
        flat = flat.concat(this.flatten(item.children, level + 1, node));
      } else {
        node.hasChildren = false;
      }
    });

    return flat;
  }

  breadCrumbOffset(index: number): string {
    return `${ 10 + index * 26 }px`;
  }

  itemOffset(index: number): string {
    return `${ 10 + this.breadCrumbs.length * 26 + index * 46 }px`;
  }

  async onItemSelect(item: IEsNavigationMenuNode) {
    if (this.selectedItem && this.selectedItem.id === item.id) {
      return;
    }

    if (this.selectedBreadCrumb && this.selectedBreadCrumb.id === item.id) {
      return;
    }

    this.internalRouting = true;

    if (item.level === 1) {
      this.breadCrumbs = [];
      this.mainItem = item;
      this.showSubMenu = item.hasChildren;
      this.selectedItem = null;

      this.selectedBreadCrumb = null;
      this.subItems = [];
    }

    if (item.hasChildren) {
      this.subItems = this.flattenedItems.filter(a => a.parent ? a.parent.id === item.id : false);

      this.selectedBreadCrumb = item;

      if (item.level > 1) {
        this.breadCrumbs.push(item);
      }

      if (this.subItems.length > 0) {
        const notGroups = this.subItems.filter(a => !a.item.children);

        this.selectedItem = notGroups[0];
        this._activeRoute = EsNavigationMenuComponent.getFullRoute(this.selectedItem);
      } else {
        this.selectedItem = item;
      }
    } else {
      this.selectedItem = item;
      this._activeRoute = EsNavigationMenuComponent.getFullRoute(item);
    }
  }

  onOptionSelect(option: IEsNavigationMenuOption) {
    if (option.action) {
      option.action();
    }
  }

  onNavigationEnd(event: NavigationEnd) {
    this._activeRoute = event.urlAfterRedirects;
    if (this._init) {
      if (this.internalRouting) {
        this.internalRouting = false;
      } else {
        this.selectActiveRoute();
      }
    }
  }

  selectActiveRoute() {
    const foundItemIndex = this.flattenedItems.map(flattened => EsNavigationMenuComponent.getFullRoute(flattened))
      .findIndex(fullRoute => fullRoute === this._activeRoute);

    if (foundItemIndex !== -1) {
      const foundItem = this.flattenedItems[foundItemIndex];
      this._activeRoute = EsNavigationMenuComponent.getFullRoute(foundItem);

      this.mainItem = null;
      this.breadCrumbs = [];
      this.selectedBreadCrumb = null;
      this.subItems = [];

      if (foundItem.parents) {
        if (foundItem.parents.length > 0) {
          this.mainItem = foundItem.parents.find(a => a.level === 1);
          this.breadCrumbs = foundItem.parents.filter(a => a.level > 1).reverse();
        } else {
          this.mainItem = foundItem;
        }

        if (this.breadCrumbs.length > 0) {
          this.selectedBreadCrumb = this.breadCrumbs[this.breadCrumbs.length - 1];
        }
      }

      this.subItems = this.flattenedItems.filter(a => {
        const id = this.selectedBreadCrumb ? this.selectedBreadCrumb.id : this.mainItem.id;
        return a.parent ? a.parent.id === id : false;
      });

      this.selectedItem = foundItem || this.mainItem;
      this.showSubMenu = foundItem.level === 1 ? false : !!foundItem.parent;
    } else {
      this.showSubMenu = false;
    }
  }

  ngOnDestroy() {
    if (this.routeChangeSubscription) {
      this.routeChangeSubscription.unsubscribe();
    }
  }

  getBreadCrumbsLink(node: IEsNavigationMenuNode) {
    return [EsNavigationMenuComponent.getFullRoute(node)];
  }
}
