import { Box, Divider, Fab, Grid, Theme, Tooltip } from '@material-ui/core'
import { FilterList } from '@material-ui/icons'
import { Pagination } from '@material-ui/lab'
import { makeStyles } from '@material-ui/styles'
import { useAppSelector } from 'app/hooks'
import { Loading } from 'components/Common/Loading'
import { NoData } from 'components/Common/NoData'
import { selectDataMotel, selectLoadingMotel, selectPaginationMotel } from 'features/motels/motelSlice'
import { School } from 'models'
import { ChangeEvent, useEffect, useState } from 'react'
import { FilterSider, MotelItem } from '..'
import Controls from './Controls'

interface Props {
    handleSelectPagination: (e: ChangeEvent<unknown>, page: number) => void
    filterSchool: (string | School)[]
    handleFilterMotel: (e: ChangeEvent<{}>, value: (string | School)[]) => void
}

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        '& .loading': {
            width: '100%',
            height: 300,
            display: 'grid',
            placeItems: 'center'
        }
    },
    filterSidebar: {
        display: 'block',
        height: '85vh',
        minHeight: 500,

        [theme.breakpoints.down('sm')]: {
            height: '100vh',
            position: 'fixed',
            right: 0,
            top: 0,
            zIndex: 10000000000000000,
            width: '95%',
            maxWidth: 350,
            transform: 'translateX(100%)',
            opacity: 0,
            transition: '300ms',

            '&.active': {
                transform: 'translateX(0)',
                opacity: 1
            }
        },
    },
    listItem: {
        display: 'flex',
        flexDirection: 'column',

        '& .item': {
            marginBottom: 32,

            [theme.breakpoints.down('xs')]: {
                marginBottom: 8
            }
        },

        [theme.breakpoints.down('xs')]: {
            gridTemplateColumns: '1fr !important',
        }
    },
    pagination: {
        width: '100%',

        '& .MuiPagination-ul': {
            justifyContent: 'flex-end',

            [theme.breakpoints.down('sm')]: {
                justifyContent: 'center'
            }
        },
    },
    btnShowFilter: {
        display: 'none',

        [theme.breakpoints.down('sm')]: {
            display: 'flex',
            position: 'fixed',
            right: 15,
            bottom: 15,
        }
    },
    overlay: {
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.5)',
        zIndex: 1000000000,
        transform: 'translateX(100%)',
        opacity: 0,
        transition: '100ms',

        '&.active': {
            transform: 'translateX(0)',
            opacity: 1
        }
    }
}))

export const ListMotelSection = ({ handleSelectPagination, filterSchool, handleFilterMotel }: Props) => {
    const classes = useStyles()
    const loading = useAppSelector(selectLoadingMotel)
    const [isOpenFilter, setIsOpenFilter] = useState(false)

    const pagination = useAppSelector(selectPaginationMotel)
    const listMotel = useAppSelector(selectDataMotel)
    const [listLayout, setListLayout] = useState<"grid" | "list">('list')

    useEffect(() => {
        if (window.innerWidth <= 768)
            setListLayout('grid')
        else setListLayout('list')

        window.onresize = () => {
            if (window.innerWidth <= 768)
                setListLayout('grid')
            else setListLayout('list')
        }

        return () => {
            window.onresize = () => { }
        }
    }, [])

    return (
        <Box className={classes.root} component='section'>
            <Grid container spacing={2}>
                <Grid item sm={undefined} md={4} lg={3}>
                    <Box className={`${classes.filterSidebar} ${isOpenFilter ? 'active' : ''}`}>
                        <FilterSider setIsOpenFilter={setIsOpenFilter} />
                    </Box>
                </Grid>

                <Grid item md={8} lg={8}>
                    <Controls
                        listLayout={listLayout}
                        setListLayout={setListLayout}
                        filterSchool={filterSchool}
                        handleFilterMotel={handleFilterMotel}
                    />

                    <Divider />

                    {loading ?
                        <Box className="loading">
                            <Loading />
                        </Box>
                        : listMotel && listMotel.length > 0 ? <Box
                            className={classes.listItem}
                            style={listLayout === 'grid' ?
                                {
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(auto-fill, minMax(250px ,1fr))',
                                    gridGap: '1.5em',
                                }
                                : {}}
                            mt={2}
                        >
                            {listMotel.map((data, index) => (
                                <div key={data._id} className="item">
                                    <MotelItem dataMotel={data} listLayout={listLayout} />
                                </div>
                            ))}
                        </Box>

                            : <NoData content='Không tìm thấy danh sách nhà trọ!!!' />}

                    {listMotel.length > 0 && <Box className={classes.pagination} mt={1.5}>
                        <Pagination
                            page={pagination._page}
                            count={Math.ceil(pagination._totalRows / pagination._limit)}
                            color="secondary"
                            onChange={handleSelectPagination}
                        />
                    </Box>}
                </Grid>
                <Grid item sm={undefined} md={undefined} lg={1}></Grid>
            </Grid>

            <Tooltip title='Bộ lọc'>
                <Fab
                    className={classes.btnShowFilter}
                    color="primary"
                    size='small'
                    onClick={() => setIsOpenFilter(true)}
                >
                    <FilterList />
                </Fab>
            </Tooltip>

            <Box
                className={`${classes.overlay} ${isOpenFilter ? 'active' : ''}`}
                onClick={() => setIsOpenFilter(false)}
            ></Box>
        </Box>
    )
}
