import {
  trigger,
  state,
  style,
  animate,
  transition, AnimationTriggerMetadata
} from '@angular/animations';

export const slide: AnimationTriggerMetadata = trigger('slide', [
  state('reset', style({
    opacity: 1,
    transform: 'translate3d(0, 0, 0)'
  })),
  transition('reset => in', [
    style({
      opacity: 0,
      transform: 'translate3d(100%, 0, 0)'
    }),
    animate('250ms ease-in-out')
  ]),
  transition('reset => out', [
    style({
      opacity: 0,
      transform: 'translate3d(-100%, 0, 0)'
    }),
    animate('250ms ease-in-out')
  ])
]);
