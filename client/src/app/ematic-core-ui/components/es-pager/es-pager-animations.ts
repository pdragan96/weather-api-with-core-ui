import {
  trigger,
  state,
  style,
  animate,
  transition, AnimationTriggerMetadata
} from '@angular/animations';

export const fadeInOut: AnimationTriggerMetadata = trigger('fadeInOut', [
  transition('void => *', [
    style({
      opacity: .5
    }),
    animate('500ms ease-in-out', style({
      opacity: 1
    }))
  ])
]);

export const firstLastPage: AnimationTriggerMetadata = trigger('firstLastPage', [
  transition('void => *', [
    style({
      opacity: 0,
      width: '0px'
    }),
    animate('250ms ease-in-out', style({
      opacity: 1,
      width: '*'
    }))
  ]),
  transition('* => void', [
    style({
      opacity: 1,
      width: '*'
    }),
    animate('350ms ease-in-out', style({
      opacity: 0,
      width: '0px'
    }))
  ])
]);
