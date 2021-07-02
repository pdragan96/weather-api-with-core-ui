import { ElementRef, Renderer2 } from '@angular/core';

export class EsScrollHandler {
  scrollableParents: any[];
  scrollEvent: (event: Event) => void;

  element: ElementRef;
  renderer: Renderer2;

  constructor(element: ElementRef, renderer: Renderer2) {
    this.element = element;
    this.renderer = renderer;
  }

  clearScrollEvents() {
    // remove scroll events from parents
    this.scrollableParents.forEach(el => {
      el.removeEventListener('scroll', this.scrollEvent, false);
    });
  }

  attachScrollEvents() {
    this.scrollableParents = [window, document];

    this.scrollEvent = (event: Event) => {
      this.onScroll();
    };

    // add scroll event on parents traversing the dom tree
    let el = this.element.nativeElement.parentElement;

    while (el) {
      this.scrollableParents.push(el);
      el = el.parentElement;
    }

    this.scrollableParents.forEach(sp => {
      sp.addEventListener('scroll', this.scrollEvent, false);
    });
  }

  // override in child class
  onScroll() {
  }
}
