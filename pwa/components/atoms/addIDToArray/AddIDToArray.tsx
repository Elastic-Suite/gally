import { useState } from 'react'

interface IProps {
  data: any | any[]
}
let i = 0

function AddIDToArray(props: IProps) {
  console.log('a')

  const { data } = props
  const [newObject, setNewObject] = useState(data)

  return <div>A</div>
}

export default AddIDToArray
