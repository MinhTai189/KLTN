import { Box, Theme, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import ApproveContext from 'contexts/ApproveContext'
import { useContext } from 'react'

interface Props {
    data: {
        title: string
        content: string
    }
}

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        width: '100%',
        maxWidth: 900,
        height: 'calc(100% - 5px)',
        overflow: 'auto',
        margin: 'auto',

        '&::-webkit-scrollbar': {
            width: 0
        },

        '& > .title': {
            fontSize: '2rem',
            fontWeight: 500,
            marginBottom: theme.spacing(4)
        },

        '& .content': {
            '& h1': {
                fontSize: '1.65em',
                marginBottom: theme.spacing(2),
            },
            '& h2': {
                fontSize: '1.6em',
                marginBottom: theme.spacing(2),
            },
            '& h3': {
                fontSize: '1.55em',
                marginBottom: theme.spacing(2),
            },
            '& h4': {
                fontSize: '1.5em',
                marginBottom: theme.spacing(2),
            },
            '& h5': {
                fontSize: '1.45em',
                marginBottom: theme.spacing(2),
            },
            '& h6': {
                fontSize: '1.4em',
                marginBottom: theme.spacing(2),
            },

            '& a': {
                color: theme.palette.primary.main,
            },

            '& img': {
                width: '100%',
                height: 'auto',
                marginBlock: theme.spacing(2),
                borderRadius: 10,
            },

            '& table': {
                marginInline: 'auto',
                marginBlock: theme.spacing(2),
                border: '1px solid #ccc',

                '& td': {
                    padding: theme.spacing(1, 2),
                },

                '& tr': {
                    borderBottom: '1px solid #ccc',
                }
            },

            '& ul, & ol': {
                listStylePosition: 'inside',
                paddingLeft: theme.spacing(1),
                marginBlock: theme.spacing(1),

                "& li": {
                    fontSize: '1.25em'
                }
            },

            '& ul': {
                listStyleType: 'disc',
            },

            '& ol': {
                listStyleType: 'desc',
            },

            '& blockquote': {
                overflow: 'hidden',
                paddingRight: '1.5em',
                paddingLeft: '1.5em',
                margin: theme.spacing(2, 0),
                fontStyle: 'italic',
                borderLeft: '5px solid #ccc',
            },

            '& p': {
                fontSize: '1.3em',
                fontWeight: 400,
                lineHeight: 1,
                marginBlock: theme.spacing(2)
            }
        }
    }
}))

const PreviewingBody = ({ data }: Props) => {
    const classes = useStyles()

    return (
        <Box className={classes.root}>
            <Typography className='title' variant='h2'>
                {data.title}
            </Typography>

            <Box
                className='content'
                dangerouslySetInnerHTML={{ __html: data.content }}
            />
        </Box>
    )
}

export default PreviewingBody
