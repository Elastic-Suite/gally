import { styled } from '@mui/system'

import { useTranslation } from 'next-i18next'
import { ICatalog, IHydraResponse, IOptions, ITreeItem } from '~/types'

import DropDown from '~/components/atoms/form/DropDown'

const SwitchersContainer = styled('div')({
  display: 'flex',
  columnGap: '8px',
  marginBottom: '8px',
})

interface IProps {
  catalog: number
  onCatalog: (ctl: number) => void
  localizedCatalog: number
  onLocalizedCatalog: (locCtl: number) => void
  catalogsData: IHydraResponse<ICatalog>
  error: Error
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
    onCategory,
  } = props

  const { t } = useTranslation('categories')

  const catalogs: IOptions<number> = catalogsData
    ? catalogsData['hydra:member']
        .map((hydraMember) => ({
          label: hydraMember.name,
          value: hydraMember.id,
        }))
        .concat({
          label: t('allCatalogs'),
          value: -1,
        })
    : [null]

  function localizedCatalogs(catalogId: number): IOptions<number> {
    return catalogsData['hydra:member']
      .filter((hydraMembers) => hydraMembers.id === catalogId)
      .map((hydraMember) =>
        hydraMember.localizedCatalogs.map((locCtl) => ({
          label: locCtl.localName,
          value: locCtl.id,
        }))
      )
      .flat()
      .concat({
        label: t('allLocales'),
        value: -1,
      })
  }

  function onCatalogChange(catalogId: number): void {
    onCatalog(catalogId)
    onLocalizedCatalog(-1)
    onCategory({})
  }

  function onLocalizedCatalogChange(localizedCatalogId: number): void {
    onLocalizedCatalog(localizedCatalogId)
    onCategory({})
  }

  if (error || !catalogsData) {
    return null
  }

  return (
    <SwitchersContainer>
      <DropDown
        required
        defaultValue={-1}
        style={{ fontSize: '12px' }}
        onChange={onCatalogChange}
        value={catalog}
        options={catalogs}
        label={t('catalog.dropdown.label')}
      />
      {Boolean(catalog) && catalog !== -1 && (
        <DropDown
          required
          defaultValue={-1}
          style={{ fontSize: '12px' }}
          onChange={onLocalizedCatalogChange}
          value={localizedCatalog}
          options={localizedCatalogs(catalog)}
          label={t('localizedCatalog.dropdown.label')}
        />
      )}
    </SwitchersContainer>
  )
}

export default CatalogSwitcher
