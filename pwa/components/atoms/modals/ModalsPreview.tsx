import AlertInfoMessage from '~/components/atoms/modals/AlertInfoMessage'
import Tooltip from '~/components/atoms/modals/Tooltip'
import PopIn from '~/components/atoms/modals/PopIn'
import PrimaryButton from '~/components/atoms/buttons/PrimaryButton'

import { useState } from 'react'

const maFunction = () => {
  return alert('Produit ajouté au panier !')
}

const ModalsPreview = () => {
  const [visiblePopIn, setVisiblePopIn] = useState(false)
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

      <div onClick={() => setVisiblePopIn(true)}>
        <PrimaryButton size="large">
          Ajouter au panier (test popIn)
        </PrimaryButton>
      </div>
      {visiblePopIn && (
        <PopIn
          title="Êtes-vous sûr de vouloir désactiver toutes les règles associées à l’attribut virtuel ?"
          func={() => maFunction()}
          btnCancel={'Annuler'}
          btnConfirm={'Confirmer'}
          close={() => setVisiblePopIn(false)}
        />
      )}
    </div>
  )
}

export default ModalsPreview
