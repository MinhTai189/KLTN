import { Box, makeStyles, Theme, Typography } from '@material-ui/core'
import { Star } from '@material-ui/icons'

interface Props {
    stars: number
    handleSelectRate: (value: number) => void
}

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        marginTop: 8,

        '& .wrapper': {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))',
            gridGap: 16,

            '& .items': {
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
                height: 42,
                padding: theme.spacing(0.2),
                boxShadow: theme.shadows[1],
                cursor: 'pointer',
                transition: '300ms',

                '&:hover, &.active': {
                    border: `2px solid ${theme.palette.secondary.main}`
                },

                '& .stars': {
                    width: 30,
                    height: 20,
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                    alignItems: 'center',

                    '& .MuiSvgIcon-root': {
                        width: 10,
                        height: 10,
                        fill: theme.palette.secondary.main
                    }
                },

                '& .text': {
                    fontSize: '0.8em',
                }
            }
        }
    }
}))

export const RateSelector = ({ stars, handleSelectRate }: Props) => {
    const classes = useStyles()

    return (
        <Box className={classes.root}>
            <ul className="wrapper">
                <li
                    className={`items ${stars === 5 ? 'active' : ''}`}
                    onClick={() => handleSelectRate(5)}
                >
                    <span className="stars">
                        <Star /><Star /><Star /><Star /><Star />
                    </span>

                    <Typography className='text' component='span'>
                        5 sao
                    </Typography>
                </li>

                <li
                    className={`items ${stars === 4 ? 'active' : ''}`}
                    onClick={() => handleSelectRate(4)}
                >
                    <span className="stars">
                        <Star /><Star />
                        <span style={{ flexBasis: 0.5 }}></span>
                        <Star /><Star />
                    </span>

                    <Typography className='text' component='span'>
                        Từ 4 sao
                    </Typography>
                </li>

                <li
                    className={`items ${stars === 3 ? 'active' : ''}`}
                    onClick={() => handleSelectRate(3)}
                >
                    <span className="stars">
                        <Star /><span style={{ flexBasis: 0.5 }}></span><Star /><Star />
                    </span>

                    <Typography className='text' component='span'>
                        Từ 3 sao
                    </Typography>
                </li>

                <li
                    className={`items ${stars === 2 ? 'active' : ''}`}
                    onClick={() => handleSelectRate(2)}
                >
                    <span className="stars">
                        <Star /><Star />
                    </span>

                    <Typography className='text' component='span'>
                        Từ 2 sao
                    </Typography>
                </li>

                <li
                    className={`items ${stars === 1 ? 'active' : ''}`}
                    onClick={() => handleSelectRate(1)}
                >
                    <span className="stars">
                        <Star />
                    </span>

                    <Typography className='text' component='span'>
                        Từ 1 sao
                    </Typography>
                </li>
            </ul>
        </Box>
    )
}
