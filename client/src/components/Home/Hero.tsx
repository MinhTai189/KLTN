import { Box, makeStyles, Typography, Button } from '@material-ui/core'
import Background from 'assets/images/background.jpg'

const useStyles = makeStyles(theme => ({
    root: {
        minHeight: '100vh',
        width: '100vw',
        position: 'relative',

        "& .MuiTypography-root": {
            textAlign: 'center'
        }
    },
    background: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        position: 'absolute'
    },
    hero: {
        position: 'absolute',
        left: '50%',
        top: '30%',
        transform: 'translateX(-50%)',
        color: '#fff',
        maxWidth: 650
    },
    question: {
        fontSize: 45,
        fontWeight: 400,
    },
    para: {
        fontSize: 17,
        margin: '16px 0'
    },
    btnGroup: {
        display: 'flex',
        width: '100%',
        justifyContent: 'center',

        "& .MuiButton-root": {
            margin: '0 8px',
            borderRadius: 30,
            textTransform: 'initial'
        }
    }
}))

export const Hero = () => {
    const classes = useStyles()

    return (
        <div className={classes.root}>
            <img className={classes.background} src={Background} alt="back ground" />

            <Box className={classes.hero}>
                <Typography className={classes.question} variant='h1' color='inherit'>
                    Bạn đang muốn tìm nhà trọ ?
                </Typography>

                <Typography className={classes.para}>
                    Website hỗ trợ sinh viên tìm kiếm nhà trọ hoặc tìm người ở ghép một cách nhanh chóng, dễ dàng và chính xác
                </Typography>

                <Box className={classes.btnGroup}>
                    <Button variant='contained' color='secondary'>Tìm nhà trọ</Button>
                    <Button variant='contained' color='secondary'>Tìm người ở ghép</Button>
                </Box>
            </Box>
        </div>
    )
}
