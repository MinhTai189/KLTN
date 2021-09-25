import { Box, Theme, Typography } from '@material-ui/core'
import { Home } from '@material-ui/icons'
import { makeStyles } from '@material-ui/styles'

interface Props {
    imgUrls: string[]
    onClickRows: (codeName: string, name: string) => void
    school: string
    district: string
    amountMotel: number
    codeName: string
    classFlip: string
    styleRows?: any
}

const useStyles = makeStyles((theme: Theme) => ({
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
    }, col1: {
        color: theme.palette.text.secondary,
        flexBasis: '40%',

        "& p": {
            fontWeight: 500
        }
    },
    col2: {
        color: theme.palette.text.secondary,
        flexBasis: '30%'
    },
    col3: {
        display: 'flex',
        flexBasis: "30%",
    },
    imgs: {
        display: 'flex',
        flex: 1,

        "& img": {
            width: 45,
            height: 45,
            objectFit: 'cover',
            outline: '1px solid #ccc',

            "&:not(:last-child)": {
                marginRight: 8
            }
        }
    },
    amount: {
        width: 30,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        alignContent: 'center',
        justifyContent: 'center',
        alignSelf: 'center',

        "& svg": {
            fill: theme.palette.secondary.main,
            fontSize: 15
        },

        "& span": {
            color: theme.palette.text.secondary,
            fontSize: 15,
            fontWeight: 700,
            lineHeight: 1
        }
    },
}))

export const SchoolRows = ({ imgUrls, onClickRows, school, district, amountMotel, codeName, classFlip, styleRows }: Props) => {
    const classes = useStyles()

    return (
        <Box className={`${classes.root} ${classFlip} align-center`} style={styleRows} onClick={() => onClickRows(codeName, school)}>
            <Box className={classes.col1}>
                <Typography>
                    {school}
                </Typography>
            </Box>

            <Box className={classes.col2}>
                <Typography align='left'>
                    {district}
                </Typography>
            </Box>


            <Box className={classes.col3}>
                {/* <Box className={classes.imgs}>
                    {imgUrls.map((url, index) => (
                        <img key={index} src={url} alt='motel' />
                    ))}
                </Box> */}

                <Box className={classes.amount}>
                    <Home />

                    <span>{amountMotel}</span>
                </Box>
            </Box>
        </Box>
    )
}
