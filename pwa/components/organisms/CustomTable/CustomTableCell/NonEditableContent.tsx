import { Switch } from '@mui/material'
import Tag from '~/components/atoms/form/Tag'
import { DataContentType, ITableHeader, ITableRow } from '~/types'

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
        return row[header.field]
      case DataContentType.BOOLEAN:
        return <Switch disabled defaultChecked={row[header.field] as boolean} />
      case DataContentType.TAG:
        return <Tag color="neutral">{row[header.field] as string}</Tag>
    }
  }

  return <>{rowDisplayAccordingToType(header, row)}</>
}

export default NonEditableContent
