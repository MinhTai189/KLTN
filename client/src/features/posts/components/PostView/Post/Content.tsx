import { Box, Theme, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'

interface Props {
    content: string
    type: number
}

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        '& .text': {
            fontSize: '1.3em',
            fontWeight: 300,
            lineHeight: 1.6
        }
    },
    htmlContent: {
        '& h1': {
            fontSize: '1.65em',
            marginBottom: theme.spacing(2),

            [theme.breakpoints.down('xs')]: {
                fontSize: '1.55em'
            }
        },
        '& h2': {
            fontSize: '1.6em',
            marginBottom: theme.spacing(2),

            [theme.breakpoints.down('xs')]: {
                fontSize: '1.5em'
            }
        },
        '& h3': {
            fontSize: '1.55em',
            marginBottom: theme.spacing(2),

            [theme.breakpoints.down('xs')]: {
                fontSize: '1.45em'
            }
        },
        '& h4': {
            fontSize: '1.5em',
            marginBottom: theme.spacing(2),

            [theme.breakpoints.down('xs')]: {
                fontSize: '1.4em'
            }
        },
        '& h5': {
            fontSize: '1.45em',
            marginBottom: theme.spacing(2),

            [theme.breakpoints.down('xs')]: {
                fontSize: '1.35em'
            }
        },
        '& h6': {
            fontSize: '1.4em',
            marginBottom: theme.spacing(2),

            [theme.breakpoints.down('xs')]: {
                fontSize: '1.3em'
            }
        },

        '& a': {
            color: theme.palette.primary.main,

            [theme.breakpoints.down('xs')]: {
                fontSize: '1em'
            }
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
            width: '100%',
            overflow: 'auto',

            [theme.breakpoints.down('xs')]: {
                fontSize: '0.8rem'
            },

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
                fontSize: '1.25em',

                [theme.breakpoints.down('xs')]: {
                    fontSize: '1.15em'
                }
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

            [theme.breakpoints.down('xs')]: {
                fontSize: '0.85em'
            }
        },

        '& p': {
            fontSize: '1.3em',
            fontWeight: 400,
            lineHeight: 1,
            marginBlock: theme.spacing(2),

            [theme.breakpoints.down('xs')]: {
                fontSize: '1.2em'
            }
        },
    }
}))

export const Content = ({ content, type }: Props) => {
    const classes = useStyles()

    return (
        <Box className={classes.root}>
            {type !== 3 && <Typography className='text'>
                {content}
            </Typography>}

            {type === 3 &&
                <Box
                    className={classes.htmlContent}
                    dangerouslySetInnerHTML={{ __html: content }}
                />
            }
        </Box>
    )
}
