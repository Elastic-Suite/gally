import { withAuth } from '~/hocs'

function Dashboard(): JSX.Element {
  // todo: temporary page
  return <div>Dashboard</div>
}

export default withAuth(Dashboard)
