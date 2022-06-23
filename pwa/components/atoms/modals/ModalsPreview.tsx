import AlertInfoMessage from '~/components/atoms/modals/AlertInfoMessage'
import Tooltip from '~/components/atoms/modals/Tooltip'
import PopIn from '~/components/atoms/modals/PopIn'
import PrimaryButton from '~/components/atoms/buttons/PrimaryButton'

const ModalsPreview = () => {
  return (
    <div>
      <h1>Tooltip</h1>
      <Tooltip
        desc="Passez votre souris sur moi"
        placement="right" // show all possibility of placement : https://codesandbox.io/s/43zvk1?file=/demo.tsx
        hoverDesc="Les attributs affichés ont été déclarés comme étant filtrables."
      />
      <br />
      <br />
      <br />
      <br />

      <h1>AlertInfoMessage</h1>
      <AlertInfoMessage
        title="Les attributs affichés ont été déclarés comme étant filtrables."
        dev={true} // for preview make true, for others make false
      />
      <br />
      <br />
      <br />

      <h1>Pop in</h1>

      <PopIn
        title={<PrimaryButton size="large">Click on me !</PrimaryButton>}
        onConfirm={() => alert('salut')}
        cancelName={'Cancel'}
        confirmName={'Confirm'}
        titlePopIn="Hello World"
      />
    </div>
  )
}

export default ModalsPreview
