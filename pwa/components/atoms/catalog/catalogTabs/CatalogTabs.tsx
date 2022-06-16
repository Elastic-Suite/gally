import React, { useState } from 'react'
import { makeStyles } from '@mui/styles'
import { Theme } from '@mui/material'
import Scope from '../scope/scope'
import SearchableAndFiltrableAttr from '../searchableAndFiltrateAttr/searchableAndFiltrateAttr'

const useStylesCatalog = makeStyles((theme: Theme) => ({
  root: {
    display: 'flex',
    borderBottom: '1px solid #E2E6F3',
    marginBottom: theme.spacing(4),
  },

  tabs: {
    fontSize: '16px',
    lineHeight: '24px',
    fontWeight: '500',
    color: theme.palette.colors.neutral[600],
    padding: theme.spacing(2),
    borderRadius: theme.spacing(1),
    transition: 'all 500ms',
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: theme.palette.colors.secondary[100],
    },
  },

  tabsActive: {
    position: 'relative',
    color: theme.palette.colors.secondary[600],
    '&::after': {
      content: '""',
      position: 'absolute',
      bottom: '0',
      left: '0',
      width: '-moz-available',
      borderRadius: theme.spacing(1),
      borderBottom: '2px solid #2C19CD',
      animation: '$opacity 1500ms forwards',
    },
  },
  '@keyframes opacity': {
    from: {
      opacity: 0,
    },
    to: {
      opacity: 1,
    },
  },
}))

const CatalogTabs = () => {
  const stylecatalog = useStylesCatalog()

  const [tabsAct, setTabsAct] = useState(true)

  return (
    <>
      <div className={stylecatalog.root}>
        <div
          className={
            stylecatalog.tabs + ' ' + (tabsAct && stylecatalog.tabsActive)
          }
          onClick={() => setTabsAct(!tabsAct)}
        >
          Scope
        </div>
        <div
          className={
            stylecatalog.tabs + ' ' + (!tabsAct && stylecatalog.tabsActive)
          }
          onClick={() => setTabsAct(!tabsAct)}
        >
          Searchable and filtrable attributes
        </div>
      </div>
      {tabsAct ? <Scope /> : <SearchableAndFiltrableAttr />}
    </>
  )
}

export default CatalogTabs
