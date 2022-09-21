export function a11yProps(
  ariaName: string,
  id: string | number
): { id: string; 'aria-controls': string } {
  return {
    id: `simple-tab-${id}`,
    'aria-controls': `${`${ariaName}-${id}`}`,
  }
}
