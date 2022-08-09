import { Box, Switch } from '@mui/material'
import Tag from '~/components/atoms/form/Tag'
import Score from '~/components/atoms/score/Score'
import Stock from '~/components/atoms/stock/Stock'
import Price from '~/components/atoms/price/Price'
import {
  DataContentType,
  IScore,
  IStock,
  ITableHeader,
  ITableRow,
} from '~/types'

interface IProps {
  header: ITableHeader
  row: ITableRow
}

function NonEditableContent(props: IProps): JSX.Element {
  const { header, row } = props

  function rowDisplayAccordingToType(
    header: ITableHeader,
    row: ITableRow
  ): JSX.Element | number | boolean | string {
    switch (header.type) {
      case DataContentType.STRING:
        return (
          <Box
            sx={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {row[header.field] as string}
          </Box>
        )
      case DataContentType.BOOLEAN:
        return <Switch disabled defaultChecked={row[header.field] as boolean} />
      case DataContentType.TAG:
        return <Tag color="neutral">{row[header.field] as string}</Tag>
      case DataContentType.IMAGE:
        return (
          <Box
            component="img"
            sx={{
              height: 80,
              width: 80,
            }}
            alt=""
            src={row[header.field] as string}
          />
        )
      case DataContentType.SCORE: {
        const score = row[header.field] as unknown as IScore
        return <Score scoreValue={score.scoreValue} {...score?.boostInfos} />
      }
      case DataContentType.STOCK: {
        const stock = row[header.field] as unknown as IStock
        return <Stock stockStatus={stock.status} />
      }

      case DataContentType.PRICE:
        // todo : how backend will handle currency ?
        return (
          <Price
            price={row[header.field] as number}
            countryCode="fr-FR"
            currency="EUR"
          />
        )
    }
  }

  return <>{rowDisplayAccordingToType(header, row)}</>
}

export default NonEditableContent
