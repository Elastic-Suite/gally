import { withAuth } from '../../hocs'

function Homepage(): JSX.Element {
  return <div>Homepage</div>
}

export default withAuth(Homepage)
