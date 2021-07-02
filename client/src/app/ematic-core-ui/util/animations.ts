import { trigger, style, animate, transition, AnimationTriggerMetadata } from '@angular/animations';

export const fadeIn: AnimationTriggerMetadata = trigger('fadeIn', [
  transition('void => *', [
    style({ opacity: 0 }),
    animate('500ms ease-in-out', style({ opacity: 1 }))
  ])
]);

export const fadeOut: AnimationTriggerMetadata = trigger('fadeOut', [
  transition('* => void', [
    style({ opacity: 1 }),
    animate('500ms ease-in-out', style({ opacity: 0 }))
  ])
]);

export const slideInRight: AnimationTriggerMetadata = trigger('slideInRight', [
  transition('void => *', [
    style({
      opacity: 0,
      transform: 'translate3d(100%, 0, 0)'
    }),
    animate('500ms ease-in-out', style({
      opacity: 1,
      transform: 'translate3d(0, 0, 0)'
    }))
  ])
]);
