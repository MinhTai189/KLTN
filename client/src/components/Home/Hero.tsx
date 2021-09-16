import { SearchOutlined } from '@ant-design/icons'
import { Box, makeStyles, Typography } from '@material-ui/core'
import Background from 'assets/images/background.jpg'
import { useRef } from 'react'
import { DropDownSchool } from './DropDownSchool'
import { gsap } from "gsap";

const useStyles = makeStyles(theme => ({
    root: {
        minHeight: '100vh',
        width: '100vw',
        position: 'relative',
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
        top: '25%',
        transform: 'translateX(-50%)',
        color: '#fff',
        maxWidth: 750
    },
    question: {
        fontSize: 45,
        fontWeight: 500,
    },
    para: {
        fontSize: 20,
        margin: '16px 0',
    },
    search: {
        width: '100%',
        padding: theme.spacing(.5),
        background: theme.palette.primary.main,
        boxShadow: theme.shadows[10],
        zIndex: 1000,
        position: 'relative'
    },
    inputField: {
        width: "100%",
        position: 'relative',
        "& > input": {
            width: '100%',
            height: 50,
            border: 'none',
            outline: 'none',
            paddingLeft: 50,
            color: theme.palette.text.secondary,
            fontSize: 18,

            "&::placeholder": {
                opacity: .8,
                fontSize: 17
            }
        }
    },
    icon: {
        position: 'absolute',
        left: 0,
        width: 50,
        height: 50,
        display: 'grid',
        placeItems: 'center',

        "& svg": {
            fill: theme.palette.primary.main,
            width: 30,
            height: 30
        }
    }
}))

export const Hero = () => {
    const classes = useStyles()

    const onClickSearch = () => {

    }

    return (
        <div className={classes.root}>
            <img className={classes.background} src={Background} alt="back ground" />

            <Box className={classes.hero}>
                <Typography className={classes.question} align='center' variant='h1' color='inherit'>
                    Bạn đang muốn tìm nhà trọ ?
                </Typography>

                <Typography className={classes.para} align='center'>
                    Website hỗ trợ sinh viên tìm kiếm nhà trọ hoặc tìm người ở ghép một cách nhanh chóng, dễ dàng và chính xác
                </Typography>

                <Box className={classes.search} onClick={onClickSearch}>
                    <Box className={classes.inputField}>
                        <span className={classes.icon}><SearchOutlined /></span>

                        <input type="text" name='search' placeholder='Chọn một trường mà bạn muốn tìm nhà trọ gần đó' autoComplete='off' />
                    </Box>
                </Box>

                <DropDownSchool />
            </Box>
        </div>
    )
}
