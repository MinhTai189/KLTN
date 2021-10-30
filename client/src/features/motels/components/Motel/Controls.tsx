import { Avatar, Box, Chip, TextField, Theme, Tooltip, Typography } from '@material-ui/core'
import { ViewColumn, ViewList } from '@material-ui/icons'
import { Autocomplete } from '@material-ui/lab'
import { makeStyles } from '@material-ui/styles'
import { useSchool } from 'hooks'
import { School } from 'models'
import { ChangeEvent, ComponentType, HTMLAttributes, memo } from 'react'
import ListboxComponent from './ListboxComponent'

interface Props {
    listLayout: 'list' | 'grid'
    setListLayout: (state: 'list' | 'grid') => void
    filterSchool: (string | School)[]
    handleFilterMotel: (e: ChangeEvent<{}>, value: (string | School)[]) => void
}

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: theme.spacing(0.5),

        '& .left': {
            '& .field': {
                width: 400,

                '& .MuiInputBase-root': {
                    paddingTop: 2,
                    paddingBottom: 2,
                    borderRadius: 15,
                    height: 28
                },

                '& .MuiInputBase-input': {
                    height: '1em',
                    fontSize: '0.85em',

                    "&::placeholder": {
                        fontSize: '0.9em',
                        color: '#3d3d3d',
                        opacity: 0.8
                    }
                },

                '& fieldset': {
                    borderRadius: 15,
                },

                '& .MuiChip-root': {
                    background: '#3d3d3d',
                    height: 18,

                    '& .MuiAvatar-root': {
                        height: 13,
                        width: 13
                    },

                    '& .MuiChip-deleteIcon': {
                        color: '#fff',
                        width: 12,
                        height: 12
                    }
                }
            }
        },

        '& .layout-controls': {
            display: 'flex',
            alignItems: 'center',

            '& .control': {
                width: 25,
                height: 25,
                borderRadius: 5,
                display: 'grid',
                placeItems: 'center',
                cursor: 'pointer',

                '&:not(:last-child)': {
                    marginRight: 4,
                },

                '&.active': {
                    background: theme.palette.secondary.light
                },

                '& .icon': {
                    width: '0.9em',
                    height: '0.9em',
                    fill: '#3d3d3d'
                },
            }
        }
    }
}))

const Controls = ({ listLayout, setListLayout, filterSchool, handleFilterMotel }: Props) => {
    const classes = useStyles()
    const { optionsSchool, loading } = useSchool()

    return (
        <Box className={classes.root}>
            <Box className='left'>
                <div className="field">
                    <Autocomplete
                        value={filterSchool}
                        onChange={handleFilterMotel}
                        multiple
                        id="tags-filled"
                        freeSolo
                        limitTags={3}
                        loading={loading}
                        options={optionsSchool}
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
                </div>
            </Box>

            <Box className='layout-controls'>
                <Tooltip title="Hiển thị dạng danh sách">
                    <span
                        className={`control ${listLayout === 'list' ? 'active' : ''}`}
                        onClick={() => setListLayout('list')}
                    >
                        <ViewList className='icon' />
                    </span>
                </Tooltip>

                <Tooltip title='Hiển thị dạng lưới'>
                    <span
                        className={`control ${listLayout === 'grid' ? 'active' : ''}`}
                        onClick={() => setListLayout('grid')}
                    >
                        <ViewColumn className='icon' />
                    </span>
                </Tooltip>
            </Box>
        </Box>
    )
}

export default memo(Controls)
