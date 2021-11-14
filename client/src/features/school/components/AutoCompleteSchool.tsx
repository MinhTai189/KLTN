import { Avatar, Chip, TextField, Tooltip, Typography } from '@material-ui/core'
import { Autocomplete } from '@material-ui/lab'
import { School } from 'models'
import { ChangeEvent, ComponentType, HTMLAttributes } from 'react'
import ListboxComponent from './ListboxComponent'


interface Props {
    value: (string | School)[]
    onChange: (e: ChangeEvent<{}>, value: (string | School)[]) => void
    loading: boolean
    listSchool: School[]
}

export const AutoCompleteSchool = ({ value, onChange, loading, listSchool }: Props) => {
    return (
        <Autocomplete
            value={value}
            onChange={onChange}
            multiple
            id="tags-filled"
            freeSolo
            limitTags={3}
            loading={loading}
            options={listSchool}
            ListboxComponent={ListboxComponent as ComponentType<HTMLAttributes<HTMLElement>>}
            getOptionLabel={(option) => option.name}
            renderOption={(option: School) => (
                <>
                    <Avatar src={option.logo} style={{ width: 20, height: 'auto', marginRight: 8, borderRadius: 0 }} >U</Avatar>
                    <Typography style={{ fontSize: '0.8em' }}>{option.name}</Typography>
                </>
            )}
            renderTags={(value: School[], getTagProps) =>
                value.map((option: School, index: number) => (
                    <Tooltip title={option.name}>
                        <Chip
                            color='secondary'
                            size='small'
                            avatar={<Avatar src={option.logo} />}
                            {...getTagProps({ index })}
                        />
                    </Tooltip>
                ))
            }
            renderInput={(params) => (
                <TextField
                    {...params}
                    size='small'
                    placeholder="Nhập một trường học..."
                    variant='outlined'
                    color='secondary'
                />
            )}
        />
    )
}
