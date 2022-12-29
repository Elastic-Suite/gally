import { useState } from 'react'
import { ButtonGroup, IconButton, styled } from '@mui/material'
import { IProduct } from '../../types/'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import Badge, { BadgeProps } from '@mui/material/Badge'
import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'

const Root = styled('div')({
  color: 'black',
})

const StyledBadge = styled(Badge)<BadgeProps>(({ theme }) => ({
  '& .MuiBadge-badge': {
    right: -3,
    top: 13,
    border: `2px solid ${theme.palette.background.paper}`,
    padding: '0 4px',
  },
}))

interface IProps {
  product: IProduct
}

function ProductCard(props: IProps): JSX.Element {
  const { product } = props

  const [count, setCount] = useState(1)

  return (
    <Root>
      <Card
        sx={{ maxWidth: 350 }}
        style={{ border: '1px solid gray', boxShadow: 'none' }}
      >
        <CardMedia
          component="img"
          height="200px"
          style={{ objectFit: 'contain' }}
          alt="green iguana"
          image={`https://localhost/media/catalog/product/${product.image}`}
        />
        <CardContent>
          <Typography
            style={{ display: 'flex', justifyContent: 'space-between' }}
            gutterBottom
            variant="h6"
            component="div"
          >
            {product.name}{' '}
            <Chip
              style={{
                background: product?.stock?.status ? 'green' : 'red',
                color: 'white',
              }}
              label={product?.stock?.status ? 'Available' : 'Unavailable'}
            />
          </Typography>
          <Typography variant="h4" color="text.secondary">
            $ {product.price * count}
          </Typography>
        </CardContent>
        <CardActions
          style={{
            paddingTop: '0px',
            marginBottom: '16px',
            justifyContent: 'space-around',
            alignItems: 'center',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <ButtonGroup>
              <Button
                aria-label="reduce"
                onClick={(): void => {
                  setCount(count !== 1 ? Math.max(count - 1, 0) : 1)
                }}
              >
                <RemoveIcon fontSize="small" />
              </Button>
              <Button
                aria-label="increase"
                onClick={(): void => {
                  setCount(count + 1)
                }}
              >
                <AddIcon fontSize="small" />
              </Button>
            </ButtonGroup>
            <IconButton aria-label="cart">
              <StyledBadge badgeContent={count} color="secondary">
                <ShoppingCartIcon />
              </StyledBadge>
            </IconButton>
          </div>
          <Button
            style={{
              borderRadius: '8px',
            }}
            variant="contained"
          >
            Add to Cart
          </Button>
        </CardActions>
      </Card>
    </Root>
  )
}

export default ProductCard
