import { SearchOutlined } from "@ant-design/icons"
import { Grid, makeStyles, Theme } from "@material-ui/core"
import { Input, Tooltip, Select, Button } from "antd"
import { useAppSelector } from "app/hooks"
import { Filter } from "models"
import { ChangeEvent, useState } from "react"
import { useHistory } from "react-router"
import { removeAccents } from "utils"
import { selectFilterMotel } from "../motelSlice"

interface Props {
    handleSearch: (filter: Filter) => void;
    handleFilter: (e: any, key: string) => void;
    handleClearFilter: () => void;
}

const { Option } = Select

const useStyles = makeStyles((theme: Theme) => ({
    fullWidth: {
        width: '100%'
    }
}))

export const Operation = ({ handleSearch, handleFilter, handleClearFilter }: Props) => {
    const classes = useStyles()
    const history = useHistory()
    const filter = useAppSelector(selectFilterMotel);
    const [searchData, setSearchData] = useState(filter._keysearch)

    const [createdAtSortValue, setCreatedAtSortValue] = useState((filter._order && filter._sort === 'createdat') ? `${filter._sort}.${filter._order}` : undefined)
    const [markSortValue, setMarkSortValue] = useState((filter._order && filter._sort === 'mark') ? `${filter._sort}.${filter._order}` : undefined)
    const [voteSortValue, setVoteSortValue] = useState((filter._order && filter._sort === 'vote') ? `${filter._sort}.${filter._order}` : undefined)
    const [roomSortValue, setRoomSortValue] = useState((filter._order && filter._sort === 'room') ? `${filter._sort}.${filter._order}` : undefined)

    const onChangeSearch = (e: ChangeEvent<HTMLInputElement>) => {
        setSearchData(e.target.value)
        const newFilter: Filter = {
            ...filter,
            _keysearch: removeAccents(e.target.value),
            _page: 1
        }

        handleSearch(newFilter)
    }

    const onClickRemove = () => {
        handleClearFilter()

        setSearchData('')
        setCreatedAtSortValue(undefined)
        setMarkSortValue(undefined)
        setVoteSortValue(undefined)
        setRoomSortValue(undefined)
    }

    const onClickAdd = () => {
        history.push('/admin/motels/add')
    }

    const onChangeSortSelect = (e: any, key: string) => {
        if (e) {
            const [_sort, _order] = e.split('.')

            switch (_sort) {
                case 'createdat':
                    setCreatedAtSortValue(e)
                    setMarkSortValue(undefined)
                    setVoteSortValue(undefined)
                    setRoomSortValue(undefined)
                    break;
                case 'mark':
                    setMarkSortValue(e)
                    setCreatedAtSortValue(undefined)
                    setVoteSortValue(undefined)
                    setRoomSortValue(undefined)
                    break;
                case 'vote':
                    setVoteSortValue(e)
                    setCreatedAtSortValue(undefined)
                    setMarkSortValue(undefined)
                    setRoomSortValue(undefined)
                    break;
                case 'room':
                    setRoomSortValue(e)
                    setVoteSortValue(undefined)
                    setCreatedAtSortValue(undefined)
                    setMarkSortValue(undefined)
            }
        } else {
            setCreatedAtSortValue(e)
            setMarkSortValue(e)
            setVoteSortValue(e)
        }

        handleFilter(e, key)
    }

    return (
        <Grid container spacing={1}>
            <Grid item sm={12} md={4}>
                <Grid container spacing={1}>
                    <Grid item sm={12} md={7}>
                        <Tooltip title="Nhập vào từ khóa để tìm kiếm">
                            <Input className={classes.fullWidth} size='large' placeholder="Nhập từ khóa tìm kiếm" value={searchData} onChange={onChangeSearch} allowClear prefix={<SearchOutlined />} />
                        </Tooltip>
                    </Grid>
                    <Grid item sm={12} md={5}>
                        <Tooltip title="Lọc nhà trọ còn phòng/hết phòng">
                            <Select className={classes.fullWidth} allowClear onChange={(e: any) => handleFilter(e, '_status')} value={filter._status as string} placeholder="Còn phòng/Hết phòng" size='large'>
                                <Option value='true'>Còn phòng</Option>
                                <Option value='false'>Hết phòng</Option>
                            </Select>
                        </Tooltip>
                    </Grid>
                </Grid>
            </Grid>

            <Grid item sm={12} md={6}>
                <Grid container spacing={1}>
                    <Grid item sm={12} md={3}>
                        <Tooltip title="Sắp xếp tăng/giảm dần số phòng trọ">
                            <Select className={classes.fullWidth} allowClear onChange={(e: any) => onChangeSortSelect(e, '_sort')} value={roomSortValue} placeholder="Số lượng phòng trọ" size='large'>
                                <Option value='room.asc'>Sắp xếp tăng dần</Option>
                                <Option value='room.desc'>Sắp xếp giảm dần</Option>
                            </Select>
                        </Tooltip>
                    </Grid>

                    <Grid item sm={12} md={3}>
                        <Tooltip title="Sắp xếp tăng/giảm dần ngày đăng nhà trọ">
                            <Select className={classes.fullWidth} allowClear onChange={(e: any) => onChangeSortSelect(e, '_sort')} value={createdAtSortValue} placeholder="Ngày đăng tin" size='large'>
                                <Option value='createdat.asc'>Sắp xếp tăng dần</Option>
                                <Option value='createdat.desc'>Sắp xếp giảm dần</Option>
                            </Select>
                        </Tooltip>
                    </Grid>

                    <Grid item sm={12} md={3}>
                        <Tooltip title="Sắp xếp tăng/giảm dần số sao">
                            <Select className={classes.fullWidth} allowClear onChange={(e: any) => onChangeSortSelect(e, '_sort')} value={markSortValue} placeholder="Số sao" size='large'>
                                <Option value='mark.asc'>Sắp xếp tăng dần</Option>
                                <Option value='mark.desc'>Sắp xếp giảm dần</Option>
                            </Select>
                        </Tooltip>
                    </Grid>

                    <Grid item sm={12} md={3}>
                        <Tooltip title="Sắp xếp tăng/giảm dần lượt đánh giá">
                            <Select className={classes.fullWidth} allowClear onChange={(e: any) => onChangeSortSelect(e, '_sort')} value={voteSortValue} placeholder="Lượt đánh giá" size='large'>
                                <Option value='vote.asc'>Sắp xếp tăng dần</Option>
                                <Option value='vote.desc'>Sắp xếp giảm dần</Option>
                            </Select>
                        </Tooltip>
                    </Grid>
                </Grid>
            </Grid>

            <Grid item sm={12} md={2}>
                <Grid container spacing={1}>
                    <Grid item sm={12} md={6}>
                        <Tooltip title="Xóa tất cả dữ liệu đã chọn">
                            <Button className={classes.fullWidth} danger onClick={onClickRemove} type='primary' size="large">Xóa</Button>
                        </Tooltip>
                    </Grid>
                    <Grid item sm={12} md={6}>
                        <Tooltip title="Thêm dữ liệu nhà trọ">
                            <Button className={classes.fullWidth} onClick={onClickAdd} type='primary' size="large">
                                Thêm
                            </Button>
                        </Tooltip>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    )
}
