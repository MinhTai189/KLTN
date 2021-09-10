import { SearchOutlined } from '@ant-design/icons'
import { Grid, Theme } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import { AutoComplete, Button, Input, Select, Tooltip } from 'antd'
import { useAppSelector } from 'app/hooks'
import { useDistrict, useProvince, useSchool } from 'hooks'
import { Filter } from 'models'
import { ChangeEvent, useState } from 'react'
import { removeAccents } from 'utils'
import { selectFilter } from '../usersSlice'

interface Props {
    handleSearch: (filter: Filter) => void
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
    const filter: Filter = useAppSelector(selectFilter)
    const classes = useStyles()
    const [searchData, setSearchData] = useState(filter._keysearch)

    const [provinceData, setProvinceData] = useState(filter._province)
    const [districtData, setDistrictData] = useState(filter._district)
    const [schoolData, setSchoolData] = useState(filter._school)

    const [creditSortValue, setCreditSelectValue] = useState((filter._order && filter._sort === 'credit') ? `${filter._sort}.${filter._order}` : undefined)
    const [createdAtSortValue, setCreateAtSelectValue] = useState((filter._order && filter._sort === 'createdat') ? `${filter._sort}.${filter._order}` : undefined)

    const { autoCompProvince, loading: loadingProvince } = useProvince()
    const { autoCompDistrict, loading: loadingDistrict } = useDistrict()
    const { autoCompSchool, loading: loadingSchool } = useSchool()

    const onChangeSearch = (e: ChangeEvent<HTMLInputElement>) => {
        setSearchData(e.target.value)
        const newFilter: Filter = {
            ...filter,
            _keysearch: removeAccents(e.target.value),
            _page: 1
        }

        handleSearch(newFilter)
    }

    const onClickClearFilter = (e: any) => {
        handleClearFilter()
        setSearchData('')

        setProvinceData('')
        setDistrictData('')
        setSchoolData('')
        setCreditSelectValue(undefined);
        setCreateAtSelectValue(undefined);
    }

    const onChangeAutoComp = (e: any, key: string) => {
        switch (key) {
            case '_province':
                setProvinceData(e)
                break;
            case '_district':
                setDistrictData(e)
                break;
            case '_school':
                setSchoolData(e)
                break;
        }

        handleFilter(e, key)
    }

    const onChangeSortSelect = (e: any, key: string) => {
        if (e) {
            const [_sort, _order] = e.split('.')

            if (_sort === 'credit') {
                setCreditSelectValue(e)
                setCreateAtSelectValue(undefined)
            } else {
                setCreateAtSelectValue(e)
                setCreditSelectValue(undefined)
            }
        } else {
            setCreditSelectValue(e)
            setCreateAtSelectValue(e)
        }

        handleFilter(e, key)
    }

    return (
        <Grid container spacing={1}>
            <Grid item sm={12} md={2}>
                <Tooltip title="Nhập vào từ khóa để tìm kiếm">
                    <Input className={classes.margin} size='large' placeholder="Nhập từ khóa tìm kiếm" value={searchData} onChange={onChangeSearch} allowClear prefix={<SearchOutlined />} />
                </Tooltip>
            </Grid>

            <Grid item sm={12} md={4}>
                <Grid container spacing={1}>
                    <Grid item sm={12} md={4}>
                        <Tooltip title="Chọn 1 giá trị để lọc dữ liệu quyền truy cập">
                            <Select allowClear onChange={(e: any) => handleFilter(e, '_role')} value={filter._role} className={classes.margin} placeholder="Admin/User" size='large'>
                                <Option value='admin'>Admin</Option>
                                <Option value='user'>Người dùng</Option>
                            </Select>
                        </Tooltip>
                    </Grid>

                    <Grid item sm={12} md={4}>
                        <Tooltip title="Sắp xếp tăng/giảm dần uy tín">
                            <Select allowClear onChange={(e: any) => onChangeSortSelect(e, '_sort')} value={creditSortValue} className={classes.margin} placeholder="Tín dụng" size='large'>
                                <Option value='credit.asc'>Sắp xếp tăng dần</Option>
                                <Option value='credit.desc'>Sắp xếp giảm dần</Option>
                            </Select>
                        </Tooltip>
                    </Grid>

                    <Grid item sm={12} md={4}>
                        <Tooltip title="Sắp xếp tăng/giảm dần ngày tạo tài khoản">
                            <Select allowClear onChange={(e: any) => onChangeSortSelect(e, '_sort')} value={createdAtSortValue} className={classes.margin} placeholder="Ngày khởi tạo" size='large'>
                                <Option value='createdat.asc'>Sắp xếp tăng dần</Option>
                                <Option value='createdat.desc'>Sắp xếp giảm dần</Option>
                            </Select>
                        </Tooltip>
                    </Grid>
                </Grid>
            </Grid>

            <Grid item sm={12} md={6}>
                <Grid container spacing={1}>
                    <Grid item sm={12} md={4}>
                        <Tooltip title="Chọn 1 giá trị để lọc dữ liệu tên tỉnh">
                            <AutoComplete
                                onChange={(e: any) => onChangeAutoComp(e, '_province')}
                                value={provinceData}
                                className={classes.margin}
                                size='large'
                                options={autoCompProvince}
                                placeholder="Nhập vào một tỉnh"
                                filterOption={(inputValue, option: any) =>
                                    removeAccents(option!.label).toUpperCase().indexOf(removeAccents(inputValue.toUpperCase())) !== -1
                                }
                                allowClear
                            />
                        </Tooltip>
                    </Grid>

                    <Grid item sm={12} md={3}>
                        <Tooltip title="Chọn 1 giá trị để lọc dữ liệu quận/huyện/tp">
                            <AutoComplete
                                onChange={(e: any) => onChangeAutoComp(e, '_district')}
                                className={classes.margin}
                                value={districtData}
                                size='large'
                                options={autoCompDistrict}
                                placeholder="Nhập vào một quận/huyện/tp"
                                filterOption={(inputValue, option: any) =>
                                    removeAccents(option!.label).toUpperCase().indexOf(removeAccents(inputValue.toUpperCase())) !== -1
                                }
                                allowClear
                            />
                        </Tooltip>
                    </Grid>

                    <Grid item sm={12} md={3}>
                        <Tooltip title="Chọn 1 giá trị để lọc dữ liệu tên trường">
                            <AutoComplete
                                onChange={(e: any) => onChangeAutoComp(e, '_school')}
                                className={classes.margin}
                                value={schoolData}
                                size='large'
                                options={autoCompSchool}
                                placeholder="Nhập vào một trường"
                                filterOption={(inputValue, option: any) =>
                                    removeAccents(option!.label).toUpperCase().indexOf(removeAccents(inputValue.toUpperCase())) !== -1
                                }
                                allowClear
                            />
                        </Tooltip>
                    </Grid>

                    <Grid item sm={12} md={2}>
                        <Tooltip title="Xóa tất cả dữ liệu đã chọn">
                            <Button className={classes.margin} onClick={onClickClearFilter} type='primary' danger size="large">
                                Xóa
                            </Button>
                        </Tooltip>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    )
}
