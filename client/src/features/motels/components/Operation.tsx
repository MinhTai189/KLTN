import { SearchOutlined } from "@ant-design/icons"
import { Grid } from "@material-ui/core"
import { Input, Tooltip, Select } from "antd"
import { useAppSelector } from "app/hooks"
import { Filter } from "models"
import { ChangeEvent, useState } from "react"
import { removeAccents } from "utils"
import { selectFilterMotel } from "../motelSlice"

interface Props {
    handleSearch: (filter: Filter) => void;
    handleFilter: (e: any, key: string) => void
}

const { Option } = Select

export const Operation = ({ handleSearch, handleFilter }: Props) => {
    const filter = useAppSelector(selectFilterMotel);
    const [searchData, setSearchData] = useState(filter._keysearch)
    const [createdAtSortValue, setCreatedAtSortValue] = useState((filter._order && filter._sort === 'createdat') ? `${filter._sort}.${filter._order}` : undefined)

    const onChangeSearch = (e: ChangeEvent<HTMLInputElement>) => {
        setSearchData(e.target.value)
        const newFilter: Filter = {
            ...filter,
            _keysearch: removeAccents(e.target.value),
            _page: 1
        }

        handleSearch(newFilter)
    }

    const onChangeSortSelect = (e: any, key: string) => {
        if (e) {
            const [_sort, _order] = e.split('.')

            if (_sort === 'createat') {
                setCreatedAtSortValue(e)
            }
        } else {
            setCreatedAtSortValue(e)
        }

        handleFilter(e, key)
    }

    return (
        <Grid container spacing={1}>
            <Grid item sm={12} md={2}>
                <Tooltip title="Nhập vào từ khóa để tìm kiếm">
                    <Input size='large' placeholder="Nhập từ khóa tìm kiếm" value={searchData} onChange={onChangeSearch} allowClear prefix={<SearchOutlined />} />
                </Tooltip>
            </Grid>

            <Grid item sm={12} md={10}>
                <Grid container>
                    <Grid item sm={12} md={4}>
                        <Tooltip title="Lọc nhà trọ còn phòng/hết phòng">
                            <Select allowClear onChange={(e: any) => handleFilter(e, '_status')} value={createdAtSortValue} placeholder="Còn phòng/Hết phòng" size='large'>
                                <Option value='true'>Còn phòng</Option>
                                <Option value='false'>Hết phòng</Option>
                            </Select>
                        </Tooltip>
                    </Grid>

                    <Grid item sm={12} md={4}>
                        <Tooltip title="Sắp xếp tăng/giảm dần ngày đăng nhà trọ">
                            <Select allowClear onChange={(e: any) => onChangeSortSelect(e, '_sort')} value={createdAtSortValue} placeholder="Ngày đăng tin" size='large'>
                                <Option value='createdat.asc'>Sắp xếp tăng dần</Option>
                                <Option value='createdat.desc'>Sắp xếp giảm dần</Option>
                            </Select>
                        </Tooltip>
                    </Grid>

                    <Grid item sm={12} md={4}>
                        <Tooltip title="Sắp xếp tăng/giảm dần số sao">
                            <Select allowClear onChange={(e: any) => onChangeSortSelect(e, '_sort')} value={createdAtSortValue} placeholder="Số sao" size='large'>
                                <Option value='mark.asc'>Sắp xếp tăng dần</Option>
                                <Option value='mark.desc'>Sắp xếp giảm dần</Option>
                            </Select>
                        </Tooltip>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    )
}
