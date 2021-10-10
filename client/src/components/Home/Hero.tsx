import { SearchOutlined } from '@ant-design/icons'
import { Box, makeStyles, Typography } from '@material-ui/core'
import { useAppDispatch, useAppSelector } from 'app/hooks'
import Background from 'assets/images/background.jpg'
import { schoolActions, selectFilterSchool } from 'features/school/schoolSlice'
import { ChangeEvent, useEffect, useState } from 'react'
import { DropDown } from './DropDown'

const useStyles = makeStyles(theme => ({
    root: {
        height: '100vh',
        minHeight: 750,
        width: '100%',
        position: 'relative',
        overflow: "hidden"
    },
    background: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
    },
    hero: {
        position: 'absolute',
        left: '50%',
        top: '25%',
        transform: 'translateX(-50%)',
        color: '#fff',
        width: 650,
        perspective: 500
    },
    question: {
        fontSize: 40,
        fontWeight: 500,
    },
    para: {
        fontSize: 15,
        margin: '4px auto 32px',
        width: '100%',
        maxWidth: 600
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
            height: 45,
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
        width: 45,
        height: 45,
        display: 'grid',
        placeItems: 'center',

        "& svg": {
            fill: theme.palette.primary.main,
            width: 24,
            height: 24
        }
    },
    scrollDown: {
        position: 'absolute',
        width: 25,
        height: 25,
        background: 'transparent',
        borderStyle: 'solid',
        borderColor: theme.palette.primary.main,
        borderWidth: '0 0.2em 0.2em 0',
        cursor: 'pointer',
        borderRadius: 2,
        left: '50%',
        transform: 'translate(-50%, 0) rotate(45deg)',
        animation: '$scrollDown 1.5s ease-in-out infinite',

        '&.scroll-1': {
            bottom: 10,
            animationDelay: '0.2s',
        },

        '&.scroll-2': {
            bottom: 20,
            animationDelay: '0.1s',
        },
        '&.scroll-3': {
            bottom: 30,
        },
    },
    "@keyframes scrollDown": {
        "0%": {
            transform: 'translate(-50% ,20%) rotate(45deg)',
            opacity: 0.7,
        },
        '50%': {
            transform: 'translate(-50% ,0%) rotate(45deg)',
            opacity: 0.2,
        },
        '100%': {
            transform: 'translate(-50%, 20%) rotate(45deg)',
            opacity: 0.7,
        }
    }
}))

export const Hero = () => {
    const classes = useStyles()
    const [openDropdown, setOpenDropdrow] = useState<boolean | undefined>()
    const [searchValue, setSearchValue] = useState('')

    const [isFlip, setIsFlip] = useState<boolean | undefined>()
    const dispatch = useAppDispatch()
    const filter = useAppSelector(selectFilterSchool)


    const handleFilterSearch = (value: string) => {
        dispatch(schoolActions.searchWithDebounce({
            _namelike: value.trim()
        }))
    }

    useEffect(() => {
        dispatch(schoolActions.getSchool(filter))
    }, [filter])

    const onClickSearch = () => {
        setOpenDropdrow(current => {
            if (current === undefined)
                return !current
            else {
                if (current === true && isFlip === true && searchValue) {
                    setIsFlip(false)
                    return current
                } else if (current === true) {
                    setSearchValue('')
                    return false
                } else return true
            }
        })
    }

    const onChangeSearch = (e: ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target

        handleFilterSearch(value)

        setSearchValue(value)
        setOpenDropdrow(true)
    }

    const handleScrollDown = () => {
        window.scrollTo({
            left: 0,
            top: 600,
        })
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

                        <input type="text" name='search' value={searchValue} onChange={onChangeSearch} placeholder='Chọn một trường mà bạn muốn tìm nhà trọ gần đó' autoComplete='off' />
                    </Box>
                </Box>

                <DropDown openDropdown={openDropdown} isFlip={isFlip} setIsFlip={setIsFlip} />
            </Box>

            <span className={`${classes.scrollDown} scroll-1`} onClick={handleScrollDown}></span>
            <span className={`${classes.scrollDown} scroll-2`} onClick={handleScrollDown}></span>
            <span className={`${classes.scrollDown} scroll-3`} onClick={handleScrollDown}></span>
        </div>
    )
}
