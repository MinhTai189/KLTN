import { Box, Theme, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'

interface Props {

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

const PreviewingBody = (props: Props) => {
    const classes = useStyles()
    const temp = '<p>sapiente ipsam alias quam perspiciatis est ratione id quibusdam laborum ex quo accusamus?</p><h2>sapiente ipsam alias quam perspiciatis est ratione id quibusdam laborum ex quo accusamus?</h2><h3>sapiente ipsam alias quam perspiciatis est ratione id quibusdam laborum ex quo accusamus?</h3><h4>sapiente ipsam alias quam perspiciatis est ratione id quibusdam laborum ex quo accusamus?</h4><p><strong>sapiente ipsam alias quam perspiciatis est ratione id quibusdam laborum ex quo accusamus?</strong></p><p><i>sapiente ipsam alias quam perspiciatis est ratione id quibusdam laborum ex quo accusamus?</i></p><p><a href="http://localhost:3000/create-post/review">http://localhost:3000/create-post/review</a></p><ul><li>adfadfadsf</li><li>adsfa</li><li>adsfa</li></ul><ol><li>ádfá</li><li>adsfads</li><li>ádfa</li><li>adf</li><li>adsf</li><li>ádfadaadfád</li></ol><ul><li>adsfadsfads</li><li>adsfad</li><li>adfad</li></ul><figure class="media"><oembed url="https://www.youtube.com/watch?v=817GLMC9Jxc"></oembed></figure><figure class="table"><table><tbody><tr><td><strong>ádfa</strong></td><td><strong>adsfa</strong></td><td><strong>adsfa</strong></td><td><strong>adsfad</strong></td><td><strong>adfa</strong></td><td><strong>adsfa</strong></td><td><strong>adsf</strong></td></tr><tr><td>đa</td><td>à</td><td>adfa</td><td><figure class="media"><oembed url="https://www.youtube.com/watch?v=817GLMC9Jxc"></oembed></figure></td><td>af</td><td>adfa</td><td>adfa</td></tr><tr><td>adf</td><td>a</td><td>àd</td><td>ad</td><td>adff</td><td>a</td><td>âd</td></tr><tr><td>a</td><td>d</td><td>a</td><td>f</td><td>fda</td><td>d</td><td>fa</td></tr></tbody></table></figure><blockquote><p>ádfadsfads</p></blockquote><blockquote><p>ádfads</p></blockquote>'

    return (
        <Box className={classes.root}>
            <Typography className='title' variant='h2'>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Sunt, officiis. Odit odio porro iste? Quasi accusamus ipsum harum
            </Typography>

            <Box
                className='content'
                dangerouslySetInnerHTML={{ __html: temp }}
            />
        </Box>
    )
}

export default PreviewingBody
