export function a11yProps(
  ariaName: string,
  index: number
): { id: string; 'aria-controls': string } {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `${`${ariaName}-${index}`}`,
  }
}
