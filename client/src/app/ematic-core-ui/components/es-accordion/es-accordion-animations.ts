import { trigger, style, animate, transition, AnimationTriggerMetadata } from '@angular/animations';

export const accordionContent: AnimationTriggerMetadata = trigger('accordionContent', [
  transition('void => *', [
    style({
      opacity: 0,
      paddingTop: 0,
      height: '0px'
    }),
    animate('250ms ease-in-out', style({
      opacity: 1,
      paddingTop: '{{paddingTop}}',
      height: '*'
    }))
  ]),
  transition('* => void', [
    style({
      opacity: 1,
      paddingTop: '{{paddingTop}}',
      height: '*'
    }),
    animate('250ms ease-in-out', style({
      opacity: 0,
      paddingTop: 0,
      height: '0px'
    }))
  ])
]);

export const expander: AnimationTriggerMetadata = trigger('expander', [
  transition('collapsed => expanded', [
    style({
      transform: 'rotate(0deg)'
    }),
    animate('250ms ease-in-out', style({
      transform: 'rotate(90deg)'
    }))
  ]),
  transition('expanded => collapsed', [
    style({
      transform: 'rotate(90deg)'
    }),
    animate('250ms ease-in-out', style({
      transform: 'rotate(0deg)'
    }))
  ])
]);
