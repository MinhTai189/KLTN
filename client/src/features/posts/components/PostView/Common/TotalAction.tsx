import { Box, Theme, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import { useAction } from 'hooks'

interface Props {
    size?: 'large' | 'small'
    staticLike: number[]
    quantityLike: number
}

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        display: 'flex',
        alignItems: 'center',
        cursor: 'pointer',

        '&.small': {
            '& .icon svg': {
                width: 14,
                height: 14,
            },

            '& .number': {
                fontSize: '0.8em'
            }
        },

        '& .list-icon': {
            display: 'flex',
            alignItems: 'center',

            '& .icon': {
                position: 'relative',
                margin: 0,
                display: 'grid',
                placeItems: 'center',

                '&:not(:first-child)': {
                    marginLeft: -8
                },

                '& svg': {
                    width: 22,
                    height: 22,
                }
            }
        },

        '& .number': {
            marginLeft: 4,
            fontSize: '1em',
            fontWeiht: 500,
            lineHeight: 1.2,
            color: theme.palette.text.primary
        }
    }
}))

export const TotalAction = ({ size = 'large', staticLike, quantityLike }: Props) => {
    const classes = useStyles()
    const listAction = useAction()

    return (
        <Box
            className={`${classes.root} ${size}`}
            component='span'
        >
            <span className="list-icon">
                {staticLike.map((item, index, arr) => {
                    const zIndex = arr.length - index

                    if (item <= 0) return null

                    return (
                        <span
                            key={index}
                            className="icon"
                            style={{ zIndex }}
                        >
                            {listAction[index]}
                        </span>
                    )
                })}
            </span>

            <Typography
                className="number"
                component='span'
            >
                {quantityLike}
            </Typography>
        </Box >
    )
}
