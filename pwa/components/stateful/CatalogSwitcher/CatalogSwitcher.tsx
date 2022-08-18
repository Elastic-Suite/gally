import { useEffect } from 'react'
import { styled } from '@mui/system'

import { ICatalog, IHydraResponse, IOptions, ITreeItem } from '~/types'
import { useTranslation } from 'next-i18next'

import DropDown from '~/components/atoms/form/DropDown'

const SwitchersContainer = styled('div')({
  display: 'flex',
  columnGap: '8px',
  marginBottom: '8px',
})

interface IProps {
  catalog: string | number
  onCatalog: (ctl: string | number) => void
  localizedCatalog: string | number
  onLocalizedCatalog: (locCtl: string | number) => void
  catalogsData: IHydraResponse<ICatalog>
  error: Error
  defaultCatalogId: string | number
  onCategory: (item: ITreeItem) => void
}

function CatalogSwitcher(props: IProps): JSX.Element {
  const {
    catalog,
    onCatalog,
    localizedCatalog,
    onLocalizedCatalog,
    catalogsData,
    error,
    defaultCatalogId,
    onCategory,
  } = props

  const { t } = useTranslation('categories')

  const defaultCatalog = {
    label: t('defaultCatalog.label'),
    value: defaultCatalogId,
  }

  const catalogs: IOptions<string | number> = catalogsData
    ? catalogsData['hydra:member']
        .map((hydraMember) => ({
          label: hydraMember.name,
          value: hydraMember.id,
        }))
        .concat(defaultCatalog)
    : [defaultCatalog]

  function localizedCatalogs(
    catalogId: string | number
  ): IOptions<string | number> {
    return catalogsData['hydra:member']
      .filter((hydraMembers) => hydraMembers.id === catalogId)
      .map((hydraMember) =>
        hydraMember.localizedCatalogs.map((locCtl) => ({
          label: locCtl.name,
          value: locCtl.id,
        }))
      )
      .flat()
  }

  useEffect(() => {
    onCatalog(defaultCatalogId)
  }, [onCatalog, defaultCatalogId])

  const onCatalogChange = (catalogId: string): void => {
    onCatalog(catalogId)
    onLocalizedCatalog('')
    onCategory(undefined)
  }

  if (error || !catalogsData) {
    return null
  }

  return (
    <SwitchersContainer>
      <DropDown
        style={{ fontSize: '12px' }}
        onChange={onCatalogChange}
        value={catalog}
        options={catalogs}
        label={t('catalog.dropdown.label')}
      />
      {Boolean(catalog) && catalog !== defaultCatalogId && (
        <DropDown
          style={{ fontSize: '12px' }}
          onChange={onLocalizedCatalog}
          value={localizedCatalog}
          options={localizedCatalogs(catalog)}
          label={t('localizedCatalog.dropdown.label')}
        />
      )}
    </SwitchersContainer>
  )
}

export default CatalogSwitcher
