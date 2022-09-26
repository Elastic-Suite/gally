import { ReactNode, useContext, useEffect, useMemo } from 'react'
import { IGraphqlCategories } from 'shared'

import { getCategoryTreeQuery } from '../../../constants'
import { catalogContext, categoryContext } from '../../../contexts'
import { useGraphqlApi } from '../../../hooks'

interface IProps {
  children: ReactNode
}

function CategoryProvider(props: IProps): JSX.Element {
  const { children } = props
  const { localizedCatalogId } = useContext(catalogContext)
  const variables = useMemo(
    () => ({ localizedCatalogId: Number(localizedCatalogId) }),
    [localizedCatalogId]
  )
  const [categories, setCategories, load] = useGraphqlApi<IGraphqlCategories>(
    getCategoryTreeQuery,
    variables
  )

  useEffect(() => {
    if (localizedCatalogId) {
      load()
    } else {
      setCategories(null)
    }
  }, [load, localizedCatalogId, setCategories])

  const categoryList = useMemo(
    () => categories.data?.getCategoryTree.categories ?? [],
    [categories]
  )

  return (
    <categoryContext.Provider value={categoryList}>
      {children}
    </categoryContext.Provider>
  )
}

export default CategoryProvider
