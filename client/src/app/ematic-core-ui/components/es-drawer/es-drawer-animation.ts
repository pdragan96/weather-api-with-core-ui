import {
  trigger,
  style,
  animate,
  transition, AnimationTriggerMetadata
} from '@angular/animations';

export const drawer: AnimationTriggerMetadata = trigger('drawer', [
  transition('void => *', [
    style({
      opacity: 0,
      transform: 'translate3d(100%, 0, 0)'
    }),
    animate('250ms', style({
      opacity: 1,
      transform: 'translate3d(0%, 0, 0)'
    }))
  ]),
  transition('* => void', [
    style({
      opacity: 1,
      transform: 'translate3d(0%, 0, 0)'
    }),
    animate('250ms', style({
      opacity: 0,
      transform: 'translate3d(100%, 0, 0)'
    }))
  ])
]);
