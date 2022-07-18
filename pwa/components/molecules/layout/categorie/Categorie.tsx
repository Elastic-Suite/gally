import Categories from '~/components/atoms/categories/Categories'
import { ICategoriesPropsItem } from '~/components/atoms/categories/CategoriesProps'

interface IProps {
  data: ICategoriesPropsItem[]
}

const Categorie = ({ data }: IProps) => {
  return <Categories data={data} />
}

export default Categorie
