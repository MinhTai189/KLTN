import { SearchOutlined } from "@ant-design/icons"
import { Grid, makeStyles, Theme } from "@material-ui/core"
import { Input, Tooltip, Select, Button } from "antd"
import { useAppSelector } from "app/hooks"
import { Filter } from "models"
import { ChangeEvent, useState } from "react"
import { useHistory } from "react-router"
import { removeAccents } from "utils"
import { selectFilterMotel } from "../../motelSlice"

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
            const [_sort] = e.split('.')

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
                        <Tooltip title="Nh???p v??o t??? kh??a ????? t??m ki???m">
                            <Input className={classes.fullWidth} size='large' placeholder="Nh???p t??? kh??a t??m ki???m" value={searchData} onChange={onChangeSearch} allowClear prefix={<SearchOutlined />} />
                        </Tooltip>
                    </Grid>
                    <Grid item sm={12} md={5}>
                        <Tooltip title="L???c nh?? tr??? c??n ph??ng/h???t ph??ng">
                            <Select className={classes.fullWidth} allowClear onChange={(e: any) => handleFilter(e, '_status')} value={filter._status as string} placeholder="C??n ph??ng/H???t ph??ng" size='large'>
                                <Option value='true'>C??n ph??ng</Option>
                                <Option value='false'>H???t ph??ng</Option>
                            </Select>
                        </Tooltip>
                    </Grid>
                </Grid>
            </Grid>

            <Grid item sm={12} md={6}>
                <Grid container spacing={1}>
                    <Grid item sm={12} md={3}>
                        <Tooltip title="S???p x???p t??ng/gi???m d???n s??? ph??ng tr???">
                            <Select className={classes.fullWidth} allowClear onChange={(e: any) => onChangeSortSelect(e, '_sort')} value={roomSortValue} placeholder="S??? l?????ng ph??ng tr???" size='large'>
                                <Option value='room.asc'>S???p x???p t??ng d???n</Option>
                                <Option value='room.desc'>S???p x???p gi???m d???n</Option>
                            </Select>
                        </Tooltip>
                    </Grid>

                    <Grid item sm={12} md={3}>
                        <Tooltip title="S???p x???p t??ng/gi???m d???n ng??y ????ng nh?? tr???">
                            <Select className={classes.fullWidth} allowClear onChange={(e: any) => onChangeSortSelect(e, '_sort')} value={createdAtSortValue} placeholder="Ng??y ????ng tin" size='large'>
                                <Option value='createdat.asc'>S???p x???p t??ng d???n</Option>
                                <Option value='createdat.desc'>S???p x???p gi???m d???n</Option>
                            </Select>
                        </Tooltip>
                    </Grid>

                    <Grid item sm={12} md={3}>
                        <Tooltip title="S???p x???p t??ng/gi???m d???n s??? sao">
                            <Select className={classes.fullWidth} allowClear onChange={(e: any) => onChangeSortSelect(e, '_sort')} value={markSortValue} placeholder="S??? sao" size='large'>
                                <Option value='mark.asc'>S???p x???p t??ng d???n</Option>
                                <Option value='mark.desc'>S???p x???p gi???m d???n</Option>
                            </Select>
                        </Tooltip>
                    </Grid>

                    <Grid item sm={12} md={3}>
                        <Tooltip title="S???p x???p t??ng/gi???m d???n l?????t ????nh gi??">
                            <Select className={classes.fullWidth} allowClear onChange={(e: any) => onChangeSortSelect(e, '_sort')} value={voteSortValue} placeholder="L?????t ????nh gi??" size='large'>
                                <Option value='vote.asc'>S???p x???p t??ng d???n</Option>
                                <Option value='vote.desc'>S???p x???p gi???m d???n</Option>
                            </Select>
                        </Tooltip>
                    </Grid>
                </Grid>
            </Grid>

            <Grid item sm={12} md={2}>
                <Grid container spacing={1}>
                    <Grid item sm={12} md={6}>
                        <Tooltip title="X??a t???t c??? d??? li???u ???? ch???n">
                            <Button className={classes.fullWidth} danger onClick={onClickRemove} type='primary' size="large">X??a</Button>
                        </Tooltip>
                    </Grid>
                    <Grid item sm={12} md={6}>
                        <Tooltip title="Th??m d??? li???u nh?? tr???">
                            <Button className={classes.fullWidth} onClick={onClickAdd} type='primary' size="large">
                                Th??m
                            </Button>
                        </Tooltip>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    )
}
