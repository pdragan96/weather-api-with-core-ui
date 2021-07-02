import { trigger, style, animate, transition, AnimationTriggerMetadata } from '@angular/animations';

export const subMenu: AnimationTriggerMetadata = trigger('subMenu', [
  transition('void => *', [
    style({
      opacity: 0,
      padding: 0,
      width: '0px',
      overflow: 'hidden'
    }),
    animate('250ms ease-in-out', style({
      opacity: 1,
      padding: '10px',
      width: '*',
      overflow: 'auto'
    }))
  ]),
  transition('* => void', [
    style({
      opacity: 1,
      padding: '10px',
      width: '*',
      overflow: 'auto'
    }),
    animate('250ms ease-in-out', style({
      opacity: 0,
      padding: 0,
      width: '0px',
      overflow: 'hidden'
    }))
  ])
]);

export const subMenuItem: AnimationTriggerMetadata = trigger('subMenuItem', [
  transition('void => *', [
    style({
      opacity: 0,
      transform: 'translate3d(100%, 0, 0)'
    }),
    animate('450ms ease-in-out', style({
      opacity: 1,
      transform: 'translate3d(0, 0, 0)'
    }))
  ]),
  transition('* => void', [
    style({
      opacity: 1
    }),
    animate('350ms ease-in-out', style({
      opacity: 0,
      transform: 'translate3d(-100%, 0, 0)'
    }))
  ])
]);
