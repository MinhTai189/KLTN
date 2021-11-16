import { Box, Theme, Typography } from "@material-ui/core"
import { makeStyles } from "@material-ui/styles"
import { Modal } from "components/Common"
import { useState } from "react"
import { ListTool } from "../Common/ListTool"
import { TotalAction } from "../Common/TotalAction"
import { ModalStaticAction } from "./ModalStaticAction"

interface Props {

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

export const StaticAction = (props: Props) => {
    const classes = useStyles()
    const [showModalStatic, setShowModalStatic] = useState(false)

    return (
        <Box className={classes.root}>
            <span className="total-action-cmt">
                <span
                    className="total-action"
                    onClick={() => setShowModalStatic(true)}
                >
                    <TotalAction />
                </span>

                <span className="dot">
                </span>

                <span className="total-cmt">
                    <Typography className='number'>
                        48
                    </Typography>

                    <Typography className='text'>
                        bình luận
                    </Typography>
                </span>

                <span style={{ flex: 1 }} />

                <ListTool />
            </span>

            <ModalStaticAction
                open={showModalStatic}
                onCancel={() => { setShowModalStatic(false) }}
            />
        </Box>
    )
}
