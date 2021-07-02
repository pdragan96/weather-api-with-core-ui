import { trigger, state, style, animate, transition, AnimationTriggerMetadata } from '@angular/animations';

export const group: AnimationTriggerMetadata = trigger('group', [
  transition('void => *', [
    style({ opacity: 0, width: 0 }),
    animate('350ms ease-in-out', style({ opacity: 1, width: '*' }))
  ]),
  transition('* => void', [
    style({ opacity: 1, width: '*' }),
    animate('250ms ease-in-out', style({ opacity: 0, width: 0 }))
  ])
]);

export const list: AnimationTriggerMetadata = trigger('list', [
  state('reset', style({
    opacity: 1,
    transform: 'translate3d(0, 0, 0)'
  })),
  transition('reset => in', [
    style({
      opacity: 0,
      transform: 'translate3d(100%, 0, 0)'
    }),
    animate('350ms ease-in-out')
  ]),
  transition('reset => out', [
    style({
      opacity: 0,
      transform: 'translate3d(-100%, 0, 0)'
    }),
    animate('250ms ease-in-out')
  ])
]);
