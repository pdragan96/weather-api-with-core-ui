import {
  trigger,
  state,
  style,
  animate,
  transition, AnimationTriggerMetadata
} from '@angular/animations';

export const validationMessage: AnimationTriggerMetadata = trigger('validationMessage', [
  transition('void => *', [
    style({
      opacity: 0,
      transform: 'translate3d(0, 10px, 0)'
    }),
    animate('250ms ease-in-out', style({
      opacity: 1,
      transform: 'translate3d(0, 0, 0)'
    }))
  ]),
  transition('* => void', [
    style({
      opacity: 1
    }),
    animate('250ms ease-in-out', style({
      opacity: 0
    }))
  ])
]);
