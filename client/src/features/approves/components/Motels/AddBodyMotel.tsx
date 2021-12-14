import { Box, Theme } from "@material-ui/core"
import { makeStyles } from "@material-ui/styles"
import Carousel from 'react-elastic-carousel'
import AddRowContent from "../common/AddRowContent"
import TableRoom from "./TableRoom"
interface Props {

}

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        '& .carousel': {
            '& .rec-carousel': {
                position: 'relative',
            },

            '& .rec-slider-container': {
                margin: 0
            },

            '& .rec-arrow': {
                position: 'absolute',
                width: 25,
                height: 40,
                lineHeight: 'unset',
                fontSize: 17,
                background: 'rgba(0, 0, 0, 0.4)',
                minWidth: 'unset',
                borderRadius: 0,
                border: "none",
                outline: 'none',
                boxShadow: 'none',
                color: '#fff',

                '&:disabled': {
                    cursor: 'pointer'
                },

                '&:hover:enabled': {
                    background: 'rgba(0, 0, 0, 0.4)',
                },

                '&.rec-arrow-right': {
                    right: 0
                },

                '&.rec-arrow-left': {
                    left: 0,
                    zIndex: 5
                }
            },

            '& .images': {
                width: '100%',
                height: 65,
                objectFit: 'cover'
            }
        }
    }
}))

const AddBodyMotel = (props: Props) => {
    const classes = useStyles()

    return (
        <Box className={classes.root}>
            <AddRowContent />
            <AddRowContent />
            <AddRowContent />

            <TableRoom />

            <Box mt={2} mb={1}>
                <Carousel
                    className='carousel'
                    itemsToShow={5}
                    isRTL={false}
                    pagination={false}
                    itemPosition='START'
                    enableSwipe={false}
                    enableMouseSwipe={false}
                    itemPadding={[0, 4, 0, 4]}
                    showEmptySlots={true}
                >
                    {new Array(8).fill(1).map((_, index) => {

                        return (
                            <img
                                key={index.toString()}
                                className="images"
                                src={'https://static.vecteezy.com/packs/media/components/global/search-explore-nav/img/vectors/term-bg-1-666de2d941529c25aa511dc18d727160.jpg'}
                                alt="Tìm nhà trọ sinh viên"
                            // onMouseOver={() => { setCurrentImg(index); serCurrentPreviewImg(index) }}
                            // onClick={() => setOpenPreviewModal(true)}
                            />
                        )
                    })}
                </Carousel>
            </Box>
        </Box>
    )
}

export default AddBodyMotel
