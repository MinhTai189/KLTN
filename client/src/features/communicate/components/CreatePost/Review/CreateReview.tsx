import { Box, Button, makeStyles, Theme } from '@material-ui/core'
import { BalloonCKEditor } from 'components/Common'
import { TagInput } from '../TagInput'

interface Props {
}

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        marginTop: theme.spacing(12),
        width: '100%',
        maxWidth: 800,
        margin: 'auto',

        '& > .title-input': {
            width: '100%',
            resize: 'none',
            padding: theme.spacing(1),
            fontSize: '1.6rem',
            border: 'none',
            outline: 'none',
            borderLeft: '1.5px solid transparent',
            fontWeight: 500,

            '&:focus': {
                borderLeft: '1.5px solid',
            }
        },

        '& .tags-wrapper': {
            marginBlock: theme.spacing(1.5),

            '& > .label': {
                fontSize: '1rem',
                marginBottom: theme.spacing(0.7),
            }
        },

        '& .ck-content': {
            padding: 0,
            minHeight: 400,

            '& p': {
                fontSize: 17,
                lineHeight: '25px'
            }
        },

        '& .ck.ck-editor__editable:not(.ck-editor__nested-editable).ck-focused': {
            borderColor: 'transparent',
            boxShadow: 'none'
        }
    }
}))

export const CreateReview = () => {
    const classes = useStyles()

    return (
        <Box className={classes.root}>
            <textarea
                className='title-input'
                placeholder='Nhập tiêu đề vào đây...'
            />

            <BalloonCKEditor />

            <Box className='tags-wrapper'>
                <label className='label'>
                    Tag cho bài để người khác biết bài viết về gì (ngăn cách bằng dấu phẩy):
                </label>

                <TagInput
                    placeHolder=''
                    input=''
                    setInput={() => { }}
                    suggest={[]}
                    setSuggest={() => { }}
                />
            </Box>

            <Button
                color='primary'
                variant='contained'
                fullWidth
                size='large'
            >
                Lưu
            </Button>
        </Box>
    )
}
