import {
  trigger,
  state,
  style,
  animate,
  transition, AnimationTriggerMetadata
} from '@angular/animations';

export const dropdownContainer: AnimationTriggerMetadata = trigger('dropdownContainer', [
  transition('void => *', [
    style({
      opacity: 0
    }),
    animate('250ms ease-in-out', style({
      opacity: 1
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
