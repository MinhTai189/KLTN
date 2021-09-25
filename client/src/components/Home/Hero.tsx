import { SearchOutlined } from '@ant-design/icons'
import { Box, makeStyles, Typography } from '@material-ui/core'
import { motelApi } from 'api/motel'
import Background from 'assets/images/background.jpg'
import { SchoolDropdown } from 'models'
import { ChangeEvent, useEffect, useState } from 'react'
import { removeAccents } from 'utils'
import { DropDown } from './DropDown'

const useStyles = makeStyles(theme => ({
    root: {
        minHeight: '100vh',
        width: '100vw',
        position: 'relative',
        overflow: "hidden"
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
        maxWidth: 750,
        perspective: 500
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
    const [openDropdown, setOpenDropdrow] = useState<boolean | undefined>()
    const [searchValue, setSearchValue] = useState('')

    const [isFlip, setIsFlip] = useState<boolean | undefined>()
    const [schoolList, setSchoolList] = useState<Array<SchoolDropdown>>([])
    const [dataResponse, setDataReponse] = useState<Array<SchoolDropdown>>([])

    const handleFilterSearch = (value: string) => {
        if (schoolList.length > 0) {
            const filter = removeAccents(value).toUpperCase()

            const filteredData = dataResponse.filter(school => {
                const name = removeAccents(school.name).toUpperCase()

                return name.includes(filter)
            })

            setSchoolList(filteredData)
        }
    }

    useEffect(() => {
        motelApi.getDropdownList()
            .then(res => {
                setSchoolList(res.data)
                setDataReponse(res.data)
            })
            .catch((err) => {
                throw err
            })
    }, [])

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

        setSearchValue(value)
        setOpenDropdrow(true)
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

                <DropDown openDropdown={openDropdown} isFlip={isFlip} setIsFlip={setIsFlip} schoolList={schoolList} />
            </Box>
        </div>
    )
}
