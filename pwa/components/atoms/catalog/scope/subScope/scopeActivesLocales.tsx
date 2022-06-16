import React, { useState } from 'react'
import { makeStyles } from '@mui/styles'
import { Theme } from '@mui/material'

const useStylesScopeActivesLocales = makeStyles((theme: Theme) => ({
  texte: {
    color: 'red',
  },
}))

const ScopeActivesLocales = () => {
  const stylescopectiveslocales = useStylesScopeActivesLocales()

  return (
    <>
      <div className={stylescopectiveslocales.texte}>
        Scopes actives locales
      </div>
    </>
  )
}

export default ScopeActivesLocales
