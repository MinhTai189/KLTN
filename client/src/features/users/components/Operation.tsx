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

    const { autoCompProvince } = useProvince()
    const { autoCompDistrict } = useDistrict()
    const { autoCompSchool } = useSchool()

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
            const [_sort] = e.split('.')

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
                <Tooltip title="Nh???p v??o t??? kh??a ????? t??m ki???m">
                    <Input className={classes.margin} size='large' placeholder="Nh???p t??? kh??a t??m ki???m" value={searchData} onChange={onChangeSearch} allowClear prefix={<SearchOutlined />} />
                </Tooltip>
            </Grid>

            <Grid item sm={12} md={4}>
                <Grid container spacing={1}>
                    <Grid item sm={12} md={4}>
                        <Tooltip title="Ch???n 1 gi?? tr??? ????? l???c d??? li???u quy???n truy c???p">
                            <Select allowClear onChange={(e: any) => handleFilter(e, '_role')} value={filter._role} className={classes.margin} placeholder="Admin/User" size='large'>
                                <Option value='admin'>Admin</Option>
                                <Option value='user'>Ng?????i d??ng</Option>
                            </Select>
                        </Tooltip>
                    </Grid>

                    <Grid item sm={12} md={4}>
                        <Tooltip title="S???p x???p t??ng/gi???m d???n uy t??n">
                            <Select allowClear onChange={(e: any) => onChangeSortSelect(e, '_sort')} value={creditSortValue} className={classes.margin} placeholder="T??n d???ng" size='large'>
                                <Option value='credit.asc'>S???p x???p t??ng d???n</Option>
                                <Option value='credit.desc'>S???p x???p gi???m d???n</Option>
                            </Select>
                        </Tooltip>
                    </Grid>

                    <Grid item sm={12} md={4}>
                        <Tooltip title="S???p x???p t??ng/gi???m d???n ng??y t???o t??i kho???n">
                            <Select allowClear onChange={(e: any) => onChangeSortSelect(e, '_sort')} value={createdAtSortValue} className={classes.margin} placeholder="Ng??y kh???i t???o" size='large'>
                                <Option value='createdat.asc'>S???p x???p t??ng d???n</Option>
                                <Option value='createdat.desc'>S???p x???p gi???m d???n</Option>
                            </Select>
                        </Tooltip>
                    </Grid>
                </Grid>
            </Grid>

            <Grid item sm={12} md={6}>
                <Grid container spacing={1}>
                    <Grid item sm={12} md={4}>
                        <Tooltip title="Ch???n 1 gi?? tr??? ????? l???c d??? li???u t??n t???nh">
                            <AutoComplete
                                onChange={(e: any) => onChangeAutoComp(e, '_province')}
                                value={provinceData}
                                className={classes.margin}
                                size='large'
                                options={autoCompProvince}
                                placeholder="Nh???p v??o m???t t???nh"
                                filterOption={(inputValue, option: any) =>
                                    removeAccents(option!.label).toUpperCase().indexOf(removeAccents(inputValue.toUpperCase())) !== -1
                                }
                                allowClear
                            />
                        </Tooltip>
                    </Grid>

                    <Grid item sm={12} md={3}>
                        <Tooltip title="Ch???n 1 gi?? tr??? ????? l???c d??? li???u qu???n/huy???n/tp">
                            <AutoComplete
                                onChange={(e: any) => onChangeAutoComp(e, '_district')}
                                className={classes.margin}
                                value={districtData}
                                size='large'
                                options={autoCompDistrict}
                                placeholder="Nh???p v??o m???t qu???n/huy???n/tp"
                                filterOption={(inputValue, option: any) =>
                                    removeAccents(option!.label).toUpperCase().indexOf(removeAccents(inputValue.toUpperCase())) !== -1
                                }
                                allowClear
                            />
                        </Tooltip>
                    </Grid>

                    <Grid item sm={12} md={3}>
                        <Tooltip title="Ch???n 1 gi?? tr??? ????? l???c d??? li???u t??n tr?????ng">
                            <AutoComplete
                                onChange={(e: any) => onChangeAutoComp(e, '_school')}
                                className={classes.margin}
                                value={schoolData as string}
                                size='large'
                                options={autoCompSchool}
                                placeholder="Nh???p v??o m???t tr?????ng"
                                filterOption={(inputValue, option: any) =>
                                    removeAccents(option!.label).toUpperCase().indexOf(removeAccents(inputValue.toUpperCase())) !== -1
                                }
                                allowClear
                            />
                        </Tooltip>
                    </Grid>

                    <Grid item sm={12} md={2}>
                        <Tooltip title="X??a t???t c??? d??? li???u ???? ch???n">
                            <Button className={classes.margin} onClick={onClickClearFilter} type='primary' danger size="large">
                                X??a
                            </Button>
                        </Tooltip>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    )
}
