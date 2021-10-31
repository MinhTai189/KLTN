import { Box, Divider, Grid, Theme } from '@material-ui/core'
import { Pagination } from '@material-ui/lab'
import { makeStyles } from '@material-ui/styles'
import { useAppSelector } from 'app/hooks'
import { Loading } from 'components/Common/Loading'
import { NoData } from 'components/Common/NoData'
import { selectDataMotel, selectLoadingMotel, selectPaginationMotel } from 'features/motels/motelSlice'
import { School } from 'models'
import { ChangeEvent, useState } from 'react'
import { FilterSider, MotelItem } from '..'
import Controls from './Controls'

interface Props {
    handleSelectPagination: (e: ChangeEvent<unknown>, page: number) => void
    filterSchool: (string | School)[]
    handleFilterMotel: (e: ChangeEvent<{}>, value: (string | School)[]) => void
}

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        paddingTop: 80,

        '& .loading': {
            width: '100%',
            height: 300,
            display: 'grid',
            placeItems: 'center'
        }
    },
    listItem: {
        display: 'flex',
        flexDirection: 'column',

        '& .item': {
            marginBottom: 32
        }
    },
    pagination: {
        width: '100%',

        '& .MuiPagination-ul': {
            justifyContent: 'flex-end'
        }
    }
}))

export const ListMotelSection = ({ handleSelectPagination, filterSchool, handleFilterMotel }: Props) => {
    const classes = useStyles()
    const loading = useAppSelector(selectLoadingMotel)

    const pagination = useAppSelector(selectPaginationMotel)
    const listMotel = useAppSelector(selectDataMotel)
    const [listLayout, setListLayout] = useState<"grid" | "list">('list')

    return (
        <Box className={classes.root} component='section'>
            <Grid container spacing={2}>
                <Grid item sm={3}>
                    <FilterSider />
                </Grid>

                <Grid item sm={8}>
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
                            count={Math.ceil(pagination._totalRows / pagination._limit)}
                            color="secondary"
                            onChange={handleSelectPagination}
                        />
                    </Box>}

                    <br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
                </Grid>
                <Grid item sm={1}></Grid>
            </Grid>
        </Box>
    )
}
