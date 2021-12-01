import { Box, Theme, Typography } from "@material-ui/core"
import { makeStyles } from "@material-ui/styles"
import { Post } from "models"
import { useState } from "react"
import { ListTool } from "../Common/ListTool"
import { TotalAction } from "../Common/TotalAction"
import { ModalStaticAction } from "./ModalStaticAction"

interface Props {
    postData: Post
    isOwner: boolean
}

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        '& .total-action-cmt': {
            display: 'flex',
            alignItems: 'center',

            '& .dot': {
                marginInline: 12,
                position: 'relative',

                '&::after': {
                    content: '""',
                    width: 4,
                    height: 4,
                    background: '#000000d9',
                    position: 'absolute',
                    left: '50%',
                    top: '50%',
                    transform: 'translate(-50%, -50%)',
                    borderRadius: '50%'
                }
            },

            '& .total-cmt': {
                display: 'flex',
                alignItems: 'center',

                '& .number, & .text': {
                    fontSize: '1em',
                    marginRight: 4,
                    lineHeight: 1,
                },

                '& .text': {
                    fontSize: '0.85em'
                }
            }
        }
    }
}))

export const StaticAction = ({ postData, isOwner }: Props) => {
    const classes = useStyles()
    const [showModalStatic, setShowModalStatic] = useState(false)

    const { _id, totalLikes, likes, numLikes, numComments } = postData

    return (
        <Box className={classes.root}>
            <span className="total-action-cmt">
                {totalLikes > 0 && <span
                    className="total-action"
                    onClick={() => setShowModalStatic(true)}
                >
                    <TotalAction
                        staticLike={numLikes}
                        quantityLike={totalLikes}
                    />
                </span>}

                {totalLikes > 0 && numComments > 0 && <span className="dot">
                </span>}

                {numComments > 0 && <span className="total-cmt">
                    <Typography className='number'>
                        {numComments}
                    </Typography>

                    <Typography className='text'>
                        bình luận
                    </Typography>
                </span>}

                <span style={{ flex: 1 }} />

                <ListTool
                    isOwner={isOwner}
                    isPost
                    data={postData}
                />
            </span>

            <ModalStaticAction
                open={showModalStatic}
                onCancel={() => { setShowModalStatic(false) }}
                staticLike={numLikes}
                totalQuantity={totalLikes}
                listLike={likes}
            />
        </Box>
    )
}
