import type { CSSProperties } from 'react';
import {
  addOutline, arrowBackOutline, arrowForwardOutline, bookOutline, bulbOutline, cartOutline,
  checkmarkOutline, chevronBackOutline, chevronForwardOutline, closeOutline, createOutline,
  documentTextOutline, eyeOutline, folderOpenOutline, gitCompareOutline, heartOutline,
  imageOutline, listOutline, optionsOutline, radioButtonOnOutline, removeOutline, rocketOutline,
  searchOutline, statsChartOutline, timeOutline, walletOutline, warningOutline,
} from 'ionicons/icons';

// The storefront's only icon set: ionicons outline. Each export is an SVG data URI, drawn as a
// mask over currentColor, so an icon takes the colour and the size (1em) of the text around it.
// No hooks: usable from server components too. See specs/feature-ionicons-outline.md.
const ICONS = {
  add: addOutline,
  'arrow-back': arrowBackOutline,
  'arrow-forward': arrowForwardOutline,
  book: bookOutline,
  bulb: bulbOutline,
  cart: cartOutline,
  checkmark: checkmarkOutline,
  'chevron-back': chevronBackOutline,
  'chevron-forward': chevronForwardOutline,
  close: closeOutline,
  create: createOutline,
  'document-text': documentTextOutline,
  eye: eyeOutline,
  'folder-open': folderOpenOutline,
  'git-compare': gitCompareOutline,
  heart: heartOutline,
  image: imageOutline,
  list: listOutline,
  options: optionsOutline,
  'radio-button-on': radioButtonOnOutline,
  remove: removeOutline,
  rocket: rocketOutline,
  search: searchOutline,
  'stats-chart': statsChartOutline,
  time: timeOutline,
  wallet: walletOutline,
  warning: warningOutline,
} as const;

export type IconName = keyof typeof ICONS;

// The outline SVGs carry no fill or stroke attributes: their paths have the classes
// `ionicon-fill-none` and `ionicon-stroke-width`, which only the <ion-icon> web component styles.
// Used as a mask without those rules, every path is filled black and has no stroke, so outlines
// become blobs and stroke-only icons (close, add, remove) vanish. The same rules go into each SVG.
const OUTLINE_RULES = '<style>.ionicon{fill:black;stroke:black}.ionicon-fill-none{fill:none}.ionicon-stroke-width{stroke-width:32px}</style>';
const iconUrl = (name: IconName) => `url("${ICONS[name].replace(/(<svg[^>]*>)/, `$1${OUTLINE_RULES}`)}")`;

// `standalone`: the icon is the whole visible content (a close button), so no gap after it.
export default function Icon({ name, standalone, className }: { name: IconName; standalone?: boolean; className?: string }) {
  const style = { '--icon': iconUrl(name) } as CSSProperties;
  const classes = ['icon', standalone && 'icon-standalone', className].filter(Boolean).join(' ');
  return <span className={classes} style={style} aria-hidden="true" />;
}

// The same icon for code that builds DOM by hand (the story toast).
export function createIconElement(name: IconName): HTMLSpanElement {
  const el = document.createElement('span');
  el.className = 'icon';
  el.setAttribute('aria-hidden', 'true');
  el.style.setProperty('--icon', iconUrl(name));
  return el;
}
