import { Box, Switch } from '@mui/material'

import { DataContentType, IFieldGuesserProps, IScore, IStock } from '~/types'

import Tag from '~/components/atoms/form/Tag'
import Score from '~/components/atoms/score/Score'
import Stock from '~/components/atoms/stock/Stock'
import Price from '~/components/atoms/price/Price'

function ReadableFieldGuesser(props: IFieldGuesserProps): JSX.Element {
  const { type, value } = props

  switch (type) {
    case DataContentType.BOOLEAN: {
      return <Switch disabled defaultChecked={value as boolean} />
    }

    case DataContentType.TAG: {
      return <Tag color="neutral">{value as string}</Tag>
    }

    case DataContentType.IMAGE: {
      return (
        <Box
          component="img"
          sx={{
            height: 80,
            width: 80,
          }}
          alt=""
          src={value as string}
        />
      )
    }

    case DataContentType.SCORE: {
      const score = { scoreValue: value } as IScore
      return <Score scoreValue={score.scoreValue} />
    }

    case DataContentType.STOCK: {
      const stock = value as IStock
      return <Stock stockStatus={stock.status} />
    }

    case DataContentType.PRICE: {
      // todo : how backend will handle currency ?
      return (
        <Price price={value as number} countryCode="fr-FR" currency="EUR" />
      )
    }

    default: {
      return (
        <Box
          sx={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {value as string}
        </Box>
      )
    }
  }
}

export default ReadableFieldGuesser
