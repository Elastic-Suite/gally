import { Menu, Sidebar } from 'react-admin'

const CustomSidebar = (props) => {
  return (
    <Sidebar classes={props.className}>
      <Menu hasDashboard={!!props.dashboard} />
    </Sidebar>
  )
}

export default CustomSidebar
