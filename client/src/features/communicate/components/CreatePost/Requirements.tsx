import { Box, TextField, Theme, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import { useAppSelector } from 'app/hooks'
import { AutoCompleteSchool } from 'features/school/components/AutoCompleteSchool'
import { selectDataSchool, selectLoadingSchool } from 'features/school/schoolSlice'
import { Motel } from 'models'
import { ChangeEvent } from 'react'
import { AutocompleteMotel } from './FindRommate/AutocompleteMotel'
import { DataPost } from './models/create-post'
import { TagInput } from './TagInput'

interface Props {
    dataPost: DataPost
    setDataPost: (state: any) => void
    typePost: 'find-motel' | 'find-roommate'
    listMotel?: Motel[]
}

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        padding: theme.spacing(0, 1.5),
        border: '1px solid rgba(0, 0, 0, 0.23)',
        borderRadius: 10,
        position: 'relative',

        '& > .label': {
            position: 'absolute',
            top: -10,
            left: 8,
            fontSize: '0.9em',
            background: '#fff',
            fontWeight: 500
        }
    },
}))

export const Requirements = ({ dataPost, setDataPost, typePost, listMotel }: Props) => {
    const classes = useStyles()
    const listSchool = useAppSelector(selectDataSchool)
    const loading = useAppSelector(selectLoadingSchool)


    return (
        <Box className={classes.root}>
            <Typography className='label'>
                Thông tin thêm
            </Typography>

            {typePost === 'find-motel' && <Box my={2}>
                <label className='input-label'>Chọn trường mà bạn muốn nhà trọ nằm gần đó</label>

                <AutoCompleteSchool
                    listSchool={listSchool}
                    value={dataPost.schools as any}
                    onChange={(e, value) => setDataPost((prev: DataPost) => ({ ...prev, schools: value }))}
                    loading={loading}
                />
            </Box>}

            {typePost === 'find-roommate' && <Box my={2}>
                <label className='input-label'>Chọn nhà trọ muốn tìm bạn ở ghép</label>

                <AutocompleteMotel listMotel={listMotel || []} />
            </Box>}

            {typePost === 'find-motel' && <Box my={2}>
                <label className='input-label'>Giá thuê</label>

                <TextField
                    type='number'
                    name='price'
                    placeholder='Giá thuê/tháng'
                    fullWidth
                    size='small'
                    variant='outlined'
                    value={dataPost.price}
                    onChange={(e) => setDataPost((prev: DataPost) => ({ ...prev, price: e.target.value }))}
                />
            </Box>}

            <Box my={2}>
                <label className='input-label'>
                    Thông tin khác(ngăn cách bằng dấu phẩy)
                </label>

                <TagInput
                    placeHolder='Nhập thông tin bổ sung(VD: an ninh,yên tĩnh)'
                    input={dataPost.additional.input}
                    setInput={(e: ChangeEvent<any>) => setDataPost((prev: DataPost) => ({ ...prev, additional: { ...prev.additional, input: e.target.value } }))}
                    suggest={dataPost.additional.suggest}
                    setSuggest={(e: ChangeEvent<any>) => setDataPost((prev: DataPost) => ({ ...prev, additional: { ...prev.additional, suggest: e.target.value } }))}
                />
            </Box>
        </Box>
    )
}
