import { useParams } from 'react-router-dom'

import Title from '../../components/Title/Title'

function Category(): JSX.Element {
  const { id } = useParams()
  return (
    <div style={{ padding: 4 }}>
      <Title title={`Category (${id})`} />
    </div>
  )
}

export default Category
