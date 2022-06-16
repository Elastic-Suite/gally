import React, { useState } from 'react'
import { makeStyles } from '@mui/styles'
import { Theme } from '@mui/material'

const useStylesSearchableAndFiltrableAttr = makeStyles((theme: Theme) => ({
  texte: {
    color: 'red',
  },
}))

const SearchableAndFiltrableAttr = () => {
  const stylesearchableandfiltrableattr = useStylesSearchableAndFiltrableAttr()

  return (
    <>
      <div className={stylesearchableandfiltrableattr.texte}>
        Searchable and filtrable attributes
      </div>
    </>
  )
}

export default SearchableAndFiltrableAttr
