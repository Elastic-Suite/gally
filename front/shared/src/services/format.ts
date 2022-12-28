import inflection from 'inflection'

export function firstLetterUppercase(item: string): string {
  return item[0].toUpperCase() + item.slice(1)
}

export function firstLetterLowercase(item: string): string {
  return item[0].toLowerCase() + item.slice(1)
}

export function getNameFromDefault(name: string): string {
  return firstLetterLowercase(name.substring(7))
}

export function humanize(label: string): string {
  return inflection.transform(label, ['underscore', 'humanize'])
}

export function getHeadTitle(title: string): string {
  return `${title} - Gally`
}

export function joinUrlPath(...parts: string[]): string {
  return parts
    .map((part) =>
      part.slice(
        Number(part.at(0) === '/'),
        part.at(-1) === '/' ? -1 : undefined
      )
    )
    .join('/')
}

export function getFieldLabelTranslationArgs(
  source: string,
  resource?: string
): [string, string] {
  const { sourceWithoutDigits, sourceSuffix } = getSourceParts(source)
  const defaultLabel = humanize(sourceSuffix.replace(/\./g, ' '))

  if (resource) {
    return [`resources.${resource}.fields.${sourceWithoutDigits}`, defaultLabel]
  }

  return [`fields.${sourceWithoutDigits}`, defaultLabel]
}

// Taken from https://github.com/marmelab/react-admin/blob/master/packages/ra-core/src/util/getFieldLabelTranslationArgs.ts
function getSourceParts(source: string): {
  sourceWithoutDigits: string
  sourceSuffix: string
} {
  const sourceWithoutDigits = source.replace(/\.\d+\./g, '.')
  const parts = source.split('.')
  let lastPartWithDigits
  parts.forEach((part, index) => {
    if (onlyDigits(part)) {
      lastPartWithDigits = index
    }
  })
  const sourceSuffix =
    lastPartWithDigits !== null && typeof lastPartWithDigits !== 'undefined'
      ? parts.slice(lastPartWithDigits + 1).join('.')
      : source

  return { sourceWithoutDigits, sourceSuffix }
}

// Taken from https://github.com/marmelab/react-admin/blob/master/packages/ra-core/src/util/getFieldLabelTranslationArgs.ts
function onlyDigits(s: string): boolean {
  for (let i = s.length - 1; i >= 0; i--) {
    const d = s.charCodeAt(i)
    if (d < 48 || d > 57) return false
  }
  return true
}

export function formatPrice(
  price: number,
  currency: string,
  countryCode: string
): string {
  return new Intl.NumberFormat(countryCode, {
    style: 'currency',
    currency: `${currency}`,
  }).format(price)
}
