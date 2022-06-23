function AllyProps(ariaName: string, index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `${ariaName + '-' + index}`,
  }
}

export default AllyProps
