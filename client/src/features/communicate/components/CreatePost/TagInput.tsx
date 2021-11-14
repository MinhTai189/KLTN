import { Box, makeStyles, MenuItem, Select, TextField, Theme, Typography } from '@material-ui/core'
import { ChangeEvent } from 'react'


interface Props {
    placeHolder: string
    input: string
    setInput: (e: ChangeEvent<any>) => void
    suggest: string[]
    setSuggest: (e: ChangeEvent<any>) => void
}

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        padding: theme.spacing(1),
        border: '1px solid rgba(0, 0, 0, 0.23)',
        borderRadius: 4,

        '&:hover': {
            borderColor: '#000'
        },

        '& > .textarea .MuiInputBase-root': {
            padding: theme.spacing(0.5),

            '& > fieldset': {
                border: 'none'
            }
        },

        '& > .recommended-tag-wrapper': {
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',

            '& .list-selected-tag': {
                display: 'flex',
                alignItems: 'flex-end',
                margin: 0,

                '& .tag': {
                    marginRight: theme.spacing(1),

                }
            },

            '& > .MuiInputBase-root': {
                background: theme.palette.primary.main,
                borderRadius: 25,
                transition: '300ms',

                '&:hover': {
                    background: theme.palette.primary.light,
                },

                '& .MuiSelect-root': {
                    paddingTop: theme.spacing(1),
                    paddingBottom: theme.spacing(1),
                    fontSize: '0.85em',
                    color: '#fff',
                },

                '& fieldset': {
                    border: 'none'
                },

                '& .MuiSvgIcon-root': {
                    fill: '#fff'
                }
            }
        },
    }
}))

export const TagInput = ({ placeHolder, input, setInput, suggest, setSuggest }: Props) => {
    const classes = useStyles()

    return (
        <Box className={classes.root}>
            <TextField
                className='textarea'
                name='title'
                placeholder={placeHolder}
                fullWidth
                size='small'
                variant='outlined'
                multiline
                rows={2}
                value={input}
                onChange={setInput}
            />

            <div className="recommended-tag-wrapper">
                <ul className="list-selected-tag">
                    {suggest.map((el, index) => (
                        <li key={index} className="tag">
                            <Typography>
                                {el}
                            </Typography>
                        </li>
                    ))}
                </ul>

                <Select
                    id="tag-post"
                    autoWidth
                    value={suggest}
                    onChange={setSuggest}
                    variant='outlined'
                    margin='dense'
                    name='tag'
                    displayEmpty
                >
                    <MenuItem value="" disabled>
                        Gợi ý
                    </MenuItem>

                    {new Array(8).fill(1).map((option, index) => (
                        <MenuItem
                            key={index}
                            value={index}
                        >
                            Thid is an option
                        </MenuItem>
                    ))}
                </Select>
            </div>
        </Box>
    )
}
