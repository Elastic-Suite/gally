import { Dispatch, SetStateAction, useId, useMemo } from 'react'
import {
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TablePagination,
} from '@mui/material'
import {
  ICmsPage,
  IFetch,
  IGraphqlSearchDocuments,
  IOptions,
  // LoadStatus,
  SortOrder,
} from '@elastic-suite/gally-admin-shared'
import { Box } from '@mui/system'

import {
  Container,
  CustomResultPagination,
  SelectFormControl,
} from '../Search/Search.styled'

interface IProps {
  page: number
  pageSize: number
  documents: IFetch<IGraphqlSearchDocuments>
  setPage: Dispatch<SetStateAction<number>>
  setPageSize: Dispatch<SetStateAction<number>>
  setSort: Dispatch<SetStateAction<string>>
  setSortOrder: Dispatch<SetStateAction<SortOrder>>
  sort: string
  sortOptions: IOptions<string>
  sortOrder: SortOrder
}

function CmsPages(props: IProps): JSX.Element {
  const {
    page,
    pageSize,
    documents,
    setPage,
    setPageSize,
    setSort,
    setSortOrder,
    sort,
    sortOptions,
    sortOrder,
  } = props
  const total = documents.data?.documents.paginationInfo.totalCount
  const sortLabelId = useId()
  const sortSelectId = useId()
  const sortOrderLabelId = useId()
  const sortOrderSelectId = useId()
  const cmsPages: ICmsPage[] = useMemo(
    () =>
      documents.data?.documents.collection.map((document) => ({
        ...document,
        title: document.source?.title,
        content: document.source?.content,
        contentHeading: document.source?.content_heading,
      })) ?? [],
    [documents]
  )

  function handleSortChange(event: SelectChangeEvent): void {
    setSort(event.target.value)
  }

  function handleSortOrderChange(event: SelectChangeEvent): void {
    setSortOrder(event.target.value as SortOrder)
  }

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ): void => {
    event.preventDefault()
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    event.preventDefault()
    setPageSize(parseInt(event.target.value, 10))
    setPage(0)
  }

  return (
    <>
      <Container>
        <div>
          <SelectFormControl margin="normal" variant="outlined">
            <InputLabel id={sortLabelId}>Sort by</InputLabel>
            <Select
              id={sortSelectId}
              label="Sort by"
              labelId={sortLabelId}
              onChange={handleSortChange}
              value={sort}
            >
              {sortOptions.map((sortOption) => (
                <MenuItem key={sortOption.value} value={sortOption.value}>
                  {sortOption.label}
                </MenuItem>
              ))}
            </Select>
          </SelectFormControl>
          <SelectFormControl margin="normal" variant="outlined">
            <InputLabel id={sortOrderLabelId}>Sort order</InputLabel>
            <Select
              id={sortOrderSelectId}
              label="Sort order"
              labelId={sortOrderLabelId}
              onChange={handleSortOrderChange}
              value={sortOrder}
            >
              {Object.values(SortOrder).map((value) => {
                return (
                  <MenuItem key={value} value={value}>
                    {value}
                  </MenuItem>
                )
              })}
            </Select>
          </SelectFormControl>
        </div>
      </Container>
      <CustomResultPagination>
        <div>{total !== undefined && `${total} Result(s)`}</div>

        <TablePagination
          labelRowsPerPage="Rows per page"
          component="div"
          count={documents.data?.documents.paginationInfo.totalCount || 0}
          rowsPerPageOptions={[10, 30, 50]}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={pageSize}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </CustomResultPagination>
      <Box sx={{ display: 'flex', gap: 2, flexDirection: 'column' }}>
        {cmsPages.map((cmsPage) => {
          const tags = cmsPage.source?.tags
            ?.map((tag: { label: string; value: string }) => tag.label)
            .join(' | ')
          return (
            <Box
              key={cmsPage.id}
              sx={{
                padding: 1,
                display: 'flex',
                gap: 1,
                flexDirection: 'column',
                position: 'relative',
                borderRadius: 1,
                color: '#70757a',
              }}
            >
              <Box
                sx={{
                  textDecoration: 'underline',
                  color: '#151A47',
                  fontSize: 18,
                }}
              >
                {cmsPage.title}
              </Box>
              <Box>{cmsPage.contentHeading}</Box>
              {Boolean(tags) && <Box>Tags: {tags}</Box>}
            </Box>
          )
        })}
      </Box>
    </>
  )
}

export default CmsPages
