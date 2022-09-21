import { ReactNode, useEffect, useState } from 'react'

interface IProps {
  children?: ReactNode
  id: number
  value: number
}

function SubTabPanel(props: IProps): JSX.Element {
  const { children, id, value } = props
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    if (value === id) {
      setIsLoaded(true)
    }
  }, [value, id])

  return (
    <div
      style={{ width: '100%', display: id === value ? 'block' : 'none' }}
      key={id}
    >
      {(value === id || Boolean(isLoaded)) && children}
    </div>
  )
}

export default SubTabPanel
