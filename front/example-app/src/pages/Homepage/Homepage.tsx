import PageLayout from '../../components/PageLayout/PageLayout'
import { Navigate } from 'react-router-dom'
import { useContext } from 'react'
import { categoryContext } from 'src/contexts'

function Homepage(): JSX.Element {
  const categories = useContext(categoryContext)

  if (categories.length === 0) {
    return <PageLayout title="Homepage" />
  }

  return <Navigate to={`/category/${categories[0].id}`} />
}

export default Homepage
