import { SearchOutlined } from '@ant-design/icons'
import { Box, makeStyles, Paper, TextField, Typography } from '@material-ui/core'
import { Autocomplete } from '@material-ui/lab'
import Background from 'assets/images/background.jpg'
import { DropdownList } from 'models'
import { ChangeEvent, ComponentType, HTMLAttributes, useState } from 'react'
import { useHistory } from 'react-router'
import { DropdownRows } from './DropdownRows'
import ListboxComponent from './ListboxComponent'

interface Props {
    hiddenScrollDown: boolean
    listSchool: DropdownList[]
    loading: boolean
}

const useStyles = makeStyles(theme => ({
    root: {
        height: '100vh',
        minHeight: 500,
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
        width: '100%',
        maxWidth: 670,
        padding: theme.spacing(0, 0.5),
    },
    question: {
        fontSize: 45,
        fontWeight: 500,
        position: 'relative',
        paddingBottom: theme.spacing(1),
        marginBottom: theme.spacing(1),

        '&::after': {
            content: "''",
            position: 'absolute',
            bottom: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 80,
            height: 5,
            background: theme.palette.primary.light,
            borderRadius: 10,
            boxShadow: theme.shadows[2]
        },

        [theme.breakpoints.down('sm')]: {
            fontSize: 40
        },

        [theme.breakpoints.down('xs')]: {
            fontSize: 30
        },
    },
    para: {
        fontSize: 15,
        margin: '4px auto 32px',
        width: '100%',
        maxWidth: 600,

        [theme.breakpoints.down('xs')]: {
            fontSize: 13
        },
    },
    search: {
        width: '100%',
        zIndex: 1000,
        position: 'relative',
    },
    inputField: {
        width: "100%",
        position: 'relative',
        border: `7px solid ${theme.palette.primary.main}`,
        borderRadius: 50,
        background: '#fff',

        '& > .MuiAutocomplete-root': {
            '& .MuiAutocomplete-input': {
                paddingLeft: "40px !important"
            },

            '& fieldset': {
                border: 'none',
                outline: 'none'
            }
        },

        '& .dropdown': {
            border: `3px solid ${theme.palette.primary.main}`
        }
    },
    icon: {
        position: 'absolute',
        left: 2,
        top: -2,
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

export const Hero = ({ hiddenScrollDown, listSchool, loading }: Props) => {
    const classes = useStyles()
    const history = useHistory()

    const [findValue, setFindValue] = useState<DropdownList | null>(null)

    const handleScrollDown = () => {
        window.scrollTo({
            left: 0,
            top: 600,
        })
    }

    const handleChangeInput = (e: ChangeEvent<{}>, value: DropdownList | null, reason: string) => {
        setFindValue(value)

        if (reason === 'select-option')
            handleNavigateFindMotel(value)
    }

    const handleNavigateFindMotel = (value: DropdownList | null) => {
        if (value === null) return
        const { motels, ...school } = value

        history.push({
            pathname: '/motels',
            state: {
                school
            }
        })
    }

    return (
        <div className={classes.root}>
            <img className={classes.background} src={Background} alt="back ground" />

            <Box className={classes.hero}>
                <Typography className={classes.question} align='center' variant='h1' color='inherit'>
                    Bạn đang cần tìm một nhà trọ?
                </Typography>

                <Typography className={classes.para} align='center'>
                    Website hỗ trợ sinh viên tìm kiếm nhà trọ hoặc tìm người ở ghép một cách nhanh chóng, dễ dàng và chính xác
                </Typography>

                <Box className={classes.search}>
                    <Box className={classes.inputField}>
                        <span className={classes.icon}><SearchOutlined /></span>

                        <Autocomplete
                            id="combo-box-demo"
                            loading={loading}
                            options={listSchool}
                            getOptionLabel={(option) => option.name}
                            fullWidth
                            renderInput={(params) => <TextField {...params} placeholder="Nhập Trường mà bạn muốn tìm nhà trọ gần đó..." variant="outlined" />}
                            size='small'
                            popupIcon={null}
                            ListboxComponent={ListboxComponent as ComponentType<HTMLAttributes<HTMLElement>>}
                            onChange={handleChangeInput}
                            renderOption={option => (
                                <DropdownRows option={option} />
                            )}
                            PaperComponent={({ children }) => (
                                <Paper className='dropdown' style={{
                                    border: '5px solid #2196f3',
                                    borderRadius: 15,
                                    marginTop: 15,
                                    marginBottom: 15,
                                    overflow: 'hidden'
                                }}>{children}</Paper>
                            )}
                            noOptionsText={
                                <Typography style={{ textAlign: 'center' }}>
                                    Không tìm thấy dữ liệu!!!
                                </Typography>
                            }
                        />
                    </Box>
                </Box>

            </Box>

            <span className={`${classes.scrollDown} scroll-1`} style={{ display: hiddenScrollDown ? 'none' : 'inline-block' }} onClick={handleScrollDown}></span>
            <span className={`${classes.scrollDown} scroll-2`} style={{ display: hiddenScrollDown ? 'none' : 'inline-block' }} onClick={handleScrollDown}></span>
            <span className={`${classes.scrollDown} scroll-3`} style={{ display: hiddenScrollDown ? 'none' : 'inline-block' }} onClick={handleScrollDown}></span>
        </div>
    )
}
