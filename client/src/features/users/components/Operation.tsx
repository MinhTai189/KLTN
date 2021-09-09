import { SearchOutlined } from '@ant-design/icons'
import { Box, Grid } from '@material-ui/core'
import { Input } from 'antd'
import { useAppSelector } from 'app/hooks'
import { Filter } from 'models'
import { ChangeEvent } from 'react'
import { removeAccents } from 'utils'
import { selectFilter } from '../usersSlice'

interface Props {
    handleSearch: (filter: Filter) => void
}

export const Operation = ({ handleSearch }: Props) => {
    const filter: Filter = useAppSelector(selectFilter)

    const onChangeSearch = (e: ChangeEvent<HTMLInputElement>) => {
        const newFilter: Filter = {
            ...filter,
            _keysearch: removeAccents(e.target.value),
            _page: 1
        }

        handleSearch(newFilter)
    }

    return (
        <Grid container>
            <Grid item sm={12} md={3}>
                <Input size='large' placeholder="Nhập từ khóa tìm kiếm" defaultValue={filter._keysearch} onChange={onChangeSearch} allowClear prefix={<SearchOutlined />} />
            </Grid>
            <Grid item sm={12} md={9}></Grid>
        </Grid>
    )
}
