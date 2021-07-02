import { trigger, state, style, animate, transition, AnimationTriggerMetadata } from '@angular/animations';

export const tooltip: AnimationTriggerMetadata = trigger('tooltip', [
  state('void', style({
    opacity: 0,
    transform: 'translate3d(0, 0, 0)'
  })),
  state('hidden', style({
    opacity: 0,
    transform: 'translate3d(0, 0, 0)'
  })),
  // top
  transition('* => top', [
    style({
      opacity: 0,
      transform: 'translate3d(0, 5px, 0)'
    }),
    animate('350ms ease-in-out', style({
      opacity: 1,
      transform: 'translate3d(0, 0, 0)'
    }))
  ]),
  transition('top => hidden', [
    animate('350ms ease-in-out', style({
      opacity: 0,
      transform: 'translate3d(0, 5px, 0)'
    }))
  ]),
  // right
  transition('* => right', [
    style({
      opacity: 0,
      transform: 'translate3d(-5px, 0, 0)'
    }),
    animate('350ms ease-in-out', style({
      opacity: 1,
      transform: 'translate3d(0, 0, 0)'
    }))
  ]),
  transition('right => hidden', [
    animate('350ms ease-in-out', style({
      opacity: 0,
      transform: 'translate3d(-5px, 0, 0)'
    }))
  ]),
  // bottom
  transition('* => bottom', [
    style({
      opacity: 0,
      transform: 'translate3d(0, -5px, 0)'
    }),
    animate('350ms ease-in-out', style({
      opacity: 1,
      transform: 'translate3d(0, 0, 0)'
    }))
  ]),
  transition('bottom => hidden', [
    animate('0ms ease-in-out', style({
      opacity: 0,
      transform: 'translate3d(0, -5px, 0)'
    }))
  ]),
  // left
  transition('* => left', [
    style({
      opacity: 0,
      transform: 'translate3d(5px, 0, 0)'
    }),
    animate('350ms ease-in-out', style({
      opacity: 1,
      transform: 'translate3d(0, 0, 0)'
    }))
  ]),
  transition('left => hidden', [
    animate('350ms ease-in-out', style({
      opacity: 0,
      transform: 'translate3d(5px, 0, 0)'
    }))
  ]),
]);
