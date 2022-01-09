import { SearchOutlined } from "@ant-design/icons"
import { Grid, makeStyles, Theme } from "@material-ui/core"
import { Input, Tooltip, Select, Button } from "antd"

interface Props {

}

const { Option } = Select

const useStyles = makeStyles((theme: Theme) => ({
    margin: {
        margin: `${theme.spacing(1)}px ${theme.spacing(0.5)}px`,
        width: '100%'
    }
}))

export const Operation = (props: Props) => {
    const classes = useStyles()

    return (
        <Grid container spacing={1}>
            <Grid item sm={12} md={4}>
                <Tooltip title="Nhập vào từ khóa để tìm kiếm">
                    <Input className={classes.margin} size='large' placeholder="Nhập từ khóa tìm kiếm" allowClear prefix={<SearchOutlined />} />
                </Tooltip>
            </Grid>

            <Grid item sm={12} md={6}>
                <Grid container spacing={1}>
                    <Grid item sm={12} md={4}>
                        <Tooltip title="Chọn 1 giá trị để lọc dữ liệu theo chủ đề">
                            <Select allowClear className={classes.margin} placeholder="Chủ đề" size='large'>
                                <Option value='1'>Tìm nhà trọ</Option>
                                <Option value='2'>Tìm bạn ở ghép</Option>
                                <Option value='3'>Đánh giá nhà trọ</Option>
                            </Select>
                        </Tooltip>
                    </Grid>

                    <Grid item sm={12} md={4}>
                        <Tooltip title="Lọc trạng thái bình luận">
                            <Select allowClear className={classes.margin} placeholder="Bình luận" size='large'>
                                <Option value='1'>Cho phép bình luận</Option>
                                <Option value='0'>Đóng bình luận</Option>
                            </Select>
                        </Tooltip>
                    </Grid>

                    <Grid item sm={12} md={4}>
                        <Tooltip title="Sắp xếp tăng/giảm dần ngày tạo">
                            <Select allowClear className={classes.margin} placeholder="Ngày khởi tạo" size='large'>
                                <Option value='createdat.asc'>Sắp xếp tăng dần</Option>
                                <Option value='createdat.desc'>Sắp xếp giảm dần</Option>
                            </Select>
                        </Tooltip>
                    </Grid>
                </Grid>
            </Grid>

            <Grid item sm={12} md={2}>
                <Tooltip title="Xóa tất cả dữ liệu đã chọn">
                    <Button className={classes.margin} type='primary' danger size="large">
                        Xóa
                    </Button>
                </Tooltip>
            </Grid>
        </Grid>
    )
}
