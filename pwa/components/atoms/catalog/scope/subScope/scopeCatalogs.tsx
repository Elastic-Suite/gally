import React, { useState } from 'react'
import { makeStyles } from '@mui/styles'
import { Theme } from '@mui/material'

const useStylesCatalogs = makeStyles((theme: Theme) => ({
  texte: {
    color: 'red',
  },
}))

const ScopeCatalogs = () => {
  const stylescatalogs = useStylesCatalogs()

  return (
    <>
      <div className={stylescatalogs.texte}>Catalogs</div>
    </>
  )
}

export default ScopeCatalogs
