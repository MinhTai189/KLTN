import { Box, makeStyles, Typography, Button } from '@material-ui/core'
import { HomeOutlined, LocalOfferOutlined, LocationOnOutlined } from '@material-ui/icons'

interface Props {
    thumbnail: string
    name: string
    addr: string
    amount: number
    price: string
}

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
        padding: 8,
        transition: theme.transitions.easing.sharp,
        cursor: 'pointer',

        "&:hover": {
            background: '#d7d7d7'
        },

        "&:not(:last-child)": {
            borderBottom: '1px solid #ccc',
        },

        "&.align-center": {
            alignItems: 'center'
        }
    },
    left: {
        flex: 1,

        "& img": {
            width: '100%',
            height: 150,
            objectFit: 'cover',
            outline: '1px solid #ccc',
        }
    },
    right: {
        flex: 2,
        padding: '0 8px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',

        "& .name": {
            fontSize: 17,
            fontWeigth: 500,
            lineHeight: 1.3
        },

        "& .details span": {
            display: 'flex',
            alignItems: 'center',
            color: theme.palette.text.secondary,
            marginRight: 4,
            fontSize: 14,

            "& svg": {
                width: 18,
                height: 18,
                marginRight: 4,
                fill: theme.palette.secondary.main
            },
        },

        "& .optional": {
            height: 18,

            "& .material-icons": {
                color: theme.palette.primary.main,
                margin: 0,
                fontSize: 19,

                "&:not(:last-child)": {
                    marginRight: 4
                }
            }
        }
    },
    buttons: {
        borderTop: '1px dashed #ccc',

        "& .MuiButton-text": {
            width: '50%',
            textTransform: 'initial',
            fontWeight: 400
        }
    }
}))

export const MotelRows = ({ thumbnail, name, addr, amount, price }: Props) => {
    const classes = useStyles()

    return (
        <Box className={classes.root}>
            <Box className={classes.left}>
                <img src={thumbnail} alt="Motel" />
            </Box>

            <Box className={classes.right}>
                <Box className='infor'>
                    <Box>
                        <Typography className='name' variant='h6'>
                            {name}
                        </Typography>
                    </Box>

                    <Box className='optional' mb={0.5}>
                        <span className="material-icons">
                            hvac
                        </span>

                        <span className="material-icons">
                            stairs
                        </span>

                        <span className="material-icons">
                            bed
                        </span>

                        <span className="material-icons">
                            camera_outdoor
                        </span>

                        <span className="material-icons">
                            contactless
                        </span>
                    </Box>

                    <Box className='details'>
                        <Box component='span'>
                            <LocationOnOutlined />
                            {addr}
                        </Box>

                        <Box component='span'>
                            <LocalOfferOutlined />
                            {`${price}đ/tháng`}
                        </Box>

                        <Box component='span'>
                            <HomeOutlined />
                            {amount}
                        </Box>
                    </Box>
                </Box>

                <Box className={classes.buttons}>
                    <Button>Xem chi tiết</Button>
                    <Button>Tìm bạn ở ghép</Button>
                </Box>
            </Box>
        </Box>
    )
}
