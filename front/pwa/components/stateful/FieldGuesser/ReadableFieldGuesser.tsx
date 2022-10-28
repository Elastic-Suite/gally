import { Switch } from '@mui/material'
import { styled } from '@mui/system'
import { useTranslation } from 'next-i18next'
import {
  DataContentType,
  IFieldGuesserProps,
  IPrice,
  IScore,
  IStock,
} from 'shared'

import Chip from '~/components/atoms/Chip/Chip'
import Score from '~/components/atoms/score/Score'
import Stock from '~/components/atoms/stock/Stock'
import Price from '~/components/atoms/price/Price'

const Image = styled('img')({
  height: 80,
  width: 80,
})

const Box = styled('div')({
  height: 40,
  display: 'flex',
  alignItems: 'center',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
})

function ReadableFieldGuesser(props: IFieldGuesserProps): JSX.Element {
  const { input, value } = props
  const { t } = useTranslation('common')

  if (value === undefined || value === null) {
    return null
  }

  switch (input) {
    case DataContentType.BOOLEAN: {
      return <Switch disabled defaultChecked={value as boolean} />
    }

    case DataContentType.TAG: {
      return <Chip label={value as string} />
    }

    case DataContentType.IMAGE: {
      return <Image alt={t('field.productImage')} src={value as string} />
    }

    case DataContentType.SCORE: {
      const score = { scoreValue: value } as IScore
      return <Score scoreValue={score.scoreValue} />
    }

    case DataContentType.STOCK: {
      return <Stock stockStatus={(value as IStock).status} />
    }

    case DataContentType.PRICE: {
      if (!value) {
        return null
      }
      const [{ price }] = value as IPrice[]
      // todo : how backend will handle currency ?
      return <Price price={price} countryCode="fr-FR" currency="EUR" />
    }

    default: {
      return <Box>{value as string}</Box>
    }
  }
}

export default ReadableFieldGuesser
