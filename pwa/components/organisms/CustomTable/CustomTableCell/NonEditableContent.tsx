import { Switch } from '@mui/material'
import Tag from '~/components/atoms/form/Tag'
import { DataContentType, ITableHeader, ITableRow } from '~/types'

interface IProps {
  header: ITableHeader
  row: ITableRow
}

const NonEditableContent = (props: IProps) => {
  const { header, row } = props

  const rowDisplayAccordingToType = (header: ITableHeader, row: ITableRow) => {
    switch (header.type) {
      case DataContentType.STRING:
        return row[header.field]
      case DataContentType.BOOLEAN:
        return <Switch defaultChecked={row[header.field] as boolean} />
      case DataContentType.TAG:
        return <Tag color="neutral">{row[header.field] as string}</Tag>
    }
  }

  return <>{rowDisplayAccordingToType(header, row)}</>
}

export default NonEditableContent
