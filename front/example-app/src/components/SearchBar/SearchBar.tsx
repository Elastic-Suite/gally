import {
  ChangeEvent,
  FormEvent,
  useContext,
  useEffect,
  useId,
  useState,
} from 'react'
import {
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
} from '@mui/material'
import Search from '@mui/icons-material/Search'

import { searchContext } from '../../contexts'

interface IProps {
  shrink?: boolean
}

function SearchBar(props: IProps): JSX.Element {
  const { shrink } = props
  const searchId = useId()
  const { onSearch, search: searchedText } = useContext(searchContext)
  const [search, setSearch] = useState('')

  useEffect(() => setSearch(searchedText), [searchedText])

  function handleSearchChange(event: ChangeEvent<HTMLInputElement>): void {
    setSearch(event.target.value)
  }

  function handleSubmit(event: FormEvent): void {
    event.preventDefault()
    onSearch(search)
  }

  return (
    <form onSubmit={handleSubmit}>
      <InputLabel shrink={shrink}>Search</InputLabel>
      <OutlinedInput
        endAdornment={
          <InputAdornment position="end">
            <IconButton aria-label="search" edge="end" type="submit">
              <Search />
            </IconButton>
          </InputAdornment>
        }
        id={searchId}
        value={search}
        label="Search"
        onChange={handleSearchChange}
      />
    </form>
  )
}

export default SearchBar
