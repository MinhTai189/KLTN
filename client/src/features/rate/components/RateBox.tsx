import { Box, makeStyles, Theme, Typography } from "@material-ui/core"
import { ArrowDropDown, ArrowDropUp, Star } from "@material-ui/icons"
import RateImg from 'assets/images/rate-illustration.jpg'
import { NoData } from "components/Common/NoData"
import { Rate } from "models"
import { useEffect, useState } from "react"
import { RateItem } from "."

interface Props {
    handleOpenRateForm: () => void
    rateList: Rate[]
    handleReport: (id: string) => void
}

interface FilterRoom {
    star: number
    dateOrder: string
}

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        width: '100%',
        display: 'flex',
        marginTop: theme.spacing(10),

        [theme.breakpoints.down('xs')]: {
            marginTop: theme.spacing(4),
        },
    },
    colLeft: {
        flex: 1,
        boxShadow: `1px 1px 5px #ccc`,
        padding: theme.spacing(3),
        borderRadius: 20,

        [theme.breakpoints.down('sm')]: {
            padding: theme.spacing(2.5, 1.2),
            borderRadius: 10,
        },

        '& .controls': {
            width: '100%',
            display: 'flex',
            justifyContent: 'flex-end',
            marginBottom: theme.spacing(2),

            '& .filter-controls': {
                display: 'flex',
                flexWrap: 'wrap',
                gap: theme.spacing(1.5)
            },

            '& .btn': {
                background: '#fff',
                outline: 'none',
                height: '2.5em',
                padding: theme.spacing(0, 2.5),
                borderRadius: 20,
                cursor: 'pointer',
                display: 'grid',
                placeItems: 'center',
                border: 'none',
                boxShadow: '2px 2px 5px #aaa',
                transition: '300ms',

                [theme.breakpoints.down('sm')]: {
                    height: '2.2em',
                    padding: theme.spacing(0, 1.8),
                },

                '& .text': {
                    display: 'flex',
                    alignItems: 'center',
                    whiteSpace: 'nowrap',

                    [theme.breakpoints.down('sm')]: {
                        fontSize: '0.85rem',
                    },

                    "& > .MuiSvgIcon-root": {
                        width: 17,
                        height: 17,
                        marginLeft: 2,
                    }
                },

                '&:hover, &.active': {
                    background: '#000',
                    color: '#fff'
                },

                '&.rattingBtn': {
                    background: '#000',
                    color: '#fff',

                    "&:hover": {
                        background: '#eee',
                        color: theme.palette.text.primary
                    }
                },
            },

            '& .dropdown-container': {
                position: 'relative',

                '& .dropdown': {
                    position: 'absolute',
                    top: 'calc(100% + 10px)',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    boxShadow: theme.shadows[8],
                    width: 190,
                    padding: theme.spacing(1.5),
                    textAlign: 'center',
                    background: '#fff',
                    display: 'none',
                    zIndex: 10,

                    '& .items': {
                        padding: theme.spacing(0.7, 0),
                        width: '100%',
                        cursor: 'pointer',
                        transition: '300ms',

                        '&:hover, &.active': {
                            background: '#ebebeb'
                        },

                        '&:nth-child(2) .MuiSvgIcon-root': {
                            fill: '#f44336',
                        },

                        '&:nth-child(3) .MuiSvgIcon-root': {
                            fill: '#f44336',
                        },

                        '&:nth-child(4) .MuiSvgIcon-root': {
                            fill: '#ff9800',
                        },

                        '&:nth-child(5) .MuiSvgIcon-root': {
                            fill: '#2196f3',
                        },

                        '&:nth-child(6) .MuiSvgIcon-root': {
                            fill: '#4caf50',
                        },
                    }
                }
            }
        },

        '& .rateWrapper': {
            width: '100%',
            maxHeight: 500,
            minHeight: 300,
            display: 'flex',
            justifyContent: 'space-around',
            flexWrap: 'wrap',
            overflowX: 'auto',
            overflowY: 'auto',
            gap: theme.spacing(1),
            paddingTop: theme.spacing(2),

            '& .items': {
                maxWidth: '50%',
            },

            '&::-webkit-scrollbar': {
                width: 8,
            },

            '&::-webkit-scrollbar-track': {
                background: 'trasparent'
            },

            '&::-webkit-scrollbar-thumb': {
                background: '#000',
                borderRadius: 5,
                border: '3px solid #ffffff',
            }
        }
    },
    colRight: {
        width: 350,
        display: 'grid',
        placeItems: 'center',
        marginLeft: 16,

        [theme.breakpoints.down('lg')]: {
            display: 'none'
        },

        '& img': {
            width: '100%',
            objectFit: 'cover'
        }
    }
}))

export const RateBox = ({ handleOpenRateForm, rateList, handleReport }: Props) => {
    const classes = useStyles()

    const [data, setData] = useState<Rate[]>([])
    const [openDropdown, setOpenDropdown] = useState(false)
    const [filter, setFilter] = useState<FilterRoom>({
        star: 0,
        dateOrder: ''
    })

    const options = [
        { value: 0, label: <Typography>Tất cả</Typography> },
        { value: 1, label: <span className='stars'><Star /></span> },
        { value: 2, label: <span className='stars'><Star /><Star /></span> },
        { value: 3, label: <span className='stars'><Star /><Star /><Star /></span> },
        { value: 4, label: <span className='stars'><Star /><Star /><Star /><Star /></span> },
        { value: 5, label: <span className='stars'><Star /><Star /><Star /><Star /><Star /></span> },
    ]

    useEffect(() => {
        const filterData = () => {
            let filteredData = rateList

            switch (filter.star) {
                case 1:
                    filteredData = rateList.filter(rate => rate.star <= 1)
                    break
                case 2:
                    filteredData = rateList.filter(rate => rate.star > 1 && rate.star <= 2)
                    break
                case 3:
                    filteredData = rateList.filter(rate => rate.star > 2 && rate.star <= 3)
                    break
                case 4:
                    filteredData = rateList.filter(rate => rate.star > 3 && rate.star <= 4)
                    break
                case 5:
                    filteredData = rateList.filter(rate => rate.star > 4 && rate.star <= 5)
                    break
            }

            switch (filter.dateOrder) {
                case 'newest':
                    filteredData = filteredData.sort((a, b) => {
                        const date1: any = new Date(a.createAt as string)
                        const date2: any = new Date(b.createAt as string)

                        return date2 - date1
                    })
                    break;
                case 'oldest':
                    filteredData = filteredData.sort((a, b) => {
                        const date1: any = new Date(a.createAt as string)
                        const date2: any = new Date(b.createAt as string)

                        return date1 - date2
                    })
                    break;
            }

            return filteredData
        }

        setData(filterData())

    }, [filter, rateList])

    const handleSelectStar = (value: number) => {
        setFilter({ ...filter, star: value })

        setOpenDropdown(false)
    }

    const handleClickSortDate = (order: string) => {
        setFilter((prev: FilterRoom) => {
            if (prev.dateOrder === order)
                return { ...prev, dateOrder: '' }
            return { ...prev, dateOrder: order }
        })
    }

    return (
        <Box className={classes.root}>
            <div className={classes.colLeft}>
                <div className="controls">
                    <span className='filter-controls'>
                        <button
                            className={`btn ${filter.dateOrder === 'newest' ? 'active' : ''}`}
                            onClick={() => handleClickSortDate('newest')}
                        >
                            <Typography className='text'>Mới nhất</Typography>
                        </button>

                        <button
                            className={`btn ${filter.dateOrder === 'oldest' ? 'active' : ''}`}
                            onClick={() => handleClickSortDate('oldest')}
                        >
                            <Typography className='text'>Cũ nhất</Typography>
                        </button>

                        <div className='dropdown-container'>
                            <button
                                className={`btn ${filter.star !== 0 ? 'active' : ''}`}
                                onClick={() => setOpenDropdown(!openDropdown)}
                            >
                                <Typography className='text'>
                                    Số sao

                                    {openDropdown ? <ArrowDropUp /> : <ArrowDropDown />}
                                </Typography>
                            </button>

                            <div
                                className="dropdown"
                                style={{ display: openDropdown ? 'block' : 'none' }}
                            >
                                {options.map((item, index) => (
                                    <div
                                        key={index}
                                        className={`items ${filter.star === item.value ? 'active' : ''}`}
                                        onClick={() => handleSelectStar(item.value)}
                                    >
                                        {item.label}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </span>

                    <div style={{ flex: 1 }}></div>

                    <button className="rattingBtn btn" onClick={handleOpenRateForm}>
                        <Typography className='text'>Đánh giá</Typography>
                    </button>
                </div>

                <div className="rateWrapper" style={{ height: rateList.length > 0 ? 'unset' : '100%' }}>
                    {data.length > 0 ? data.map(rate => (
                        <span key={rate._id} className="items">
                            <RateItem data={rate} handleReport={handleReport} />
                        </span>
                    ))
                        : <NoData content='Không có đánh giá' />
                    }
                </div>
            </div>

            <div className={classes.colRight}>
                <img src={RateImg} alt="rate illustration" />
            </div>
        </Box>
    )
}