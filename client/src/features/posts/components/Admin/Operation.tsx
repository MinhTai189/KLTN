import { SearchOutlined } from "@ant-design/icons"
import { Grid, makeStyles, Theme } from "@material-ui/core"
import { Input, Tooltip, Select, Button } from "antd"
import { useAppSelector } from "app/hooks"
import { FIND_MOTEL_ID, FIND_ROOMMATE_ID, REVIEW_ID } from "constant/constant"
import { selectFilterPost } from "features/posts/postSlice"
import { Filter } from "models"
import { ChangeEvent, useState } from "react"

interface Props {
    handleSearch: (state: Filter) => void
    handleFilter: (e: any, key: string) => void
    handleClearFilter: () => void
}

const { Option } = Select

const useStyles = makeStyles((theme: Theme) => ({
    margin: {
        margin: `${theme.spacing(1)}px ${theme.spacing(0.5)}px`,
        width: '100%'
    }
}))

export const Operation = ({ handleSearch, handleFilter, handleClearFilter }: Props) => {
    const classes = useStyles()
    const filter = useAppSelector(selectFilterPost)

    const [searchInput, setSearchInput] = useState('')
    const [createdAtSortValue, setCreateAtSelectValue] = useState((filter._order && filter._sort === 'createdat') ? `${filter._sort}.${filter._order}` : undefined)

    const handleChangeInput = (e: ChangeEvent<HTMLInputElement>) => {
        setSearchInput(e.target.value)

        handleSearch({
            ...filter,
            _page: 1,
            _keysearch: e.target.value
        })
    }

    const handleChangeSort = (e: any, key: string) => {
        const [_sort] = e.split('.')

        setCreateAtSelectValue(e)

        handleFilter(e, key)
    }

    const handleClickClearFilter = () => {
        handleClearFilter()

        setSearchInput('')
        setCreateAtSelectValue(undefined)
    }

    return (
        <Grid container spacing={1}>
            <Grid item sm={12} md={4}>
                <Tooltip title="Nhập vào từ khóa để tìm kiếm">
                    <Input
                        className={classes.margin}
                        size='large'
                        placeholder="Nhập từ khóa tìm kiếm"
                        allowClear
                        prefix={<SearchOutlined />}
                        value={searchInput}
                        onChange={handleChangeInput}
                    />
                </Tooltip>
            </Grid>

            <Grid item sm={12} md={6}>
                <Grid container spacing={1}>
                    <Grid item sm={12} md={4}>
                        <Tooltip title="Chọn 1 giá trị để lọc dữ liệu theo chủ đề">
                            <Select allowClear className={classes.margin} onChange={(e: any) => handleFilter(e, '_subject')} value={filter._subject} placeholder="Chủ đề" size='large'>
                                <Option value={FIND_MOTEL_ID}>Tìm nhà trọ</Option>
                                <Option value={FIND_ROOMMATE_ID}>Tìm bạn ở ghép</Option>
                                <Option value={REVIEW_ID}>Đánh giá nhà trọ</Option>
                            </Select>
                        </Tooltip>
                    </Grid>

                    <Grid item sm={12} md={4}>
                        <Tooltip title="Lọc trạng thái bình luận">
                            <Select allowClear className={classes.margin} onChange={(e: any) => handleFilter(e, '_block')} value={filter._block === true ? '1' : filter._block === false ? '0' : undefined} placeholder="Bình luận" size='large'>
                                <Option value='0'>Cho phép bình luận</Option>
                                <Option value='1'>Đóng bình luận</Option>
                            </Select>
                        </Tooltip>
                    </Grid>

                    <Grid item sm={12} md={4}>
                        <Tooltip title="Sắp xếp tăng/giảm dần ngày tạo">
                            <Select allowClear className={classes.margin} onChange={(e: any) => handleChangeSort(e, '_sort')} value={createdAtSortValue} placeholder="Ngày khởi tạo" size='large'>
                                <Option value='createdat.asc'>Sắp xếp tăng dần</Option>
                                <Option value='createdat.desc'>Sắp xếp giảm dần</Option>
                            </Select>
                        </Tooltip>
                    </Grid>
                </Grid>
            </Grid>

            <Grid item sm={12} md={2}>
                <Tooltip title="Xóa tất cả dữ liệu đã chọn">
                    <Button className={classes.margin} type='primary' danger size="large" onClick={handleClickClearFilter}>
                        Xóa
                    </Button>
                </Tooltip>
            </Grid>
        </Grid>
    )
}
