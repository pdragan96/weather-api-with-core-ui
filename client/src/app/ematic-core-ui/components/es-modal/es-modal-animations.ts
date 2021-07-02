import { trigger, style, animate, transition, AnimationTriggerMetadata } from '@angular/animations';

export const modal: AnimationTriggerMetadata = trigger('modal', [
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

export const mask: AnimationTriggerMetadata = trigger('mask', [
  transition('void => *', [
    style({
      opacity: 0
    }),
    animate('250ms ease-in-out', style({
      opacity: 0.4
    }))
  ]),
  transition('* => void', [
    style({
      opacity: 0.4
    }),
    animate('250ms ease-in-out', style({
      opacity: 0
    }))
  ])
]);
