import { yupResolver } from '@hookform/resolvers/yup'
import { Box } from '@material-ui/core'
import { Alert, Form, Modal, Spin } from 'antd'
import districtApi from 'api/district'
import provinceApi from 'api/province'
import schoolApi from 'api/school'
import { useAppSelector } from 'app/hooks'
import { AutoCompleteField, InputField } from 'components/FormFields'
import { RadioBtnField } from 'components/FormFields/RadioBtnField'
import { SelectField } from 'components/FormFields/SelectField'
import { District, ListResponse, Province, FieldOption, School, UserUpdate } from 'models'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { mapOptions, mapProvinces } from 'utils'
import * as yup from 'yup'
import { selectLoading } from '../usersSlice'

interface Props {
    showUpdateForm: boolean;
    setShowUpdateForm: (value: boolean) => void;
    onSubmit: (e: any) => void;
    userUpdating: UserUpdate
}

const radioOptions: FieldOption[] = [
    {
        value: 'admin',
        label: 'Admin'
    },
    {
        value: 'user',
        label: 'Người dùng'
    },
]

const schema = yup.object().shape({
    name: yup
        .string()
        .trim('Không được chứa khoảng trắng ở đầu và cuối')
        .strict()
        .min(1, "Tối thiểu 1 ký tự")
        .max(30, "Tối thiểu 30 ký tự"),
    credit: yup
        .number()
        .min(0, 'Tối thiểu 0 điểm')
        .max(1000, 'Tối đa 99 điểm'),
    province: yup
        .string()
        .required(),
    district: yup
        .string()
        .required(),
    school: yup
        .string()
        .required('Hãy chọn đủ Tỉnh, Quận/Huyện/TP và Trường'),
    email: yup
        .string()
        .email('Hãy kiểm tra lại email'),
})

export const FormUpdate = ({ showUpdateForm, setShowUpdateForm, onSubmit, userUpdating }: Props) => {
    const { handleSubmit, control, setValue } = useForm({
        defaultValues: userUpdating,
        resolver: yupResolver(schema),
    })
    const loading = useAppSelector(selectLoading)
    const [form] = Form.useForm();

    const [province, setProvince] = useState<Province>();
    const [optionsProvince, setOptionsProvince] = useState<Array<Province>>([]);

    const [district, setDistrict] = useState<District | string>();
    const [optionsDistrict, setOptionsDistrict] = useState<Array<District>>([]);
    const [optionsSchool, setOptionsSchool] = useState<Array<FieldOption>>([]);

    const [defaultValueSchool, setDefaultValueSchool] = useState<School>()
    const [formLoading, setFormLoading] = useState(false)
    const [isErrForm, setIsErrForm] = useState(false)

    useEffect(() => {
        setFormLoading(true)

        provinceApi.getAll()
            .then((response: ListResponse<Province>) => {
                const listProvince = mapProvinces(response.data)
                setOptionsProvince(listProvince)

                const defalultProvince = listProvince.find(province => province.codeName === userUpdating.province)
                setProvince(defalultProvince)

                //fetch district list when page is frist render
                districtApi.getByCodeProvince(userUpdating.province).then((response: ListResponse<District>) => {
                    const listDistrict = response.data

                    setOptionsDistrict(listDistrict)

                    const defalultDistrict = listDistrict.find(district => district.codeName === userUpdating.district)
                    setDistrict(defalultDistrict)

                    //fetch school list when page is frist render
                    schoolApi.getByProDis(userUpdating.province, userUpdating.district).then((response: ListResponse<School>) => {
                        const listSchool = response.data
                        const options = mapOptions.school(response.data)

                        setOptionsSchool(options);

                        const defaultSchool = listSchool.find(school => school.codeName === userUpdating.school)
                        setDefaultValueSchool(defaultSchool)
                        setFormLoading(false)
                    }).catch(err => {
                        console.log("Khong the lay du lieu school", err.message)
                        setFormLoading(false)
                        setIsErrForm(true)
                    })
                }).catch(err => {
                    console.log("Khong the lay du lieu districts", err.message)
                    setFormLoading(false)
                    setIsErrForm(true)
                });
            })
            .catch(err => {
                console.log("Khong the lay du lieu provinces", err.message)
                setFormLoading(false)
                setIsErrForm(true)
            });

    }, [userUpdating.district, userUpdating.province, userUpdating.school])

    const handleProvinceSelected = async (e: any, value: Province) => {
        if (value?.codeName) {
            setProvince(value)
            setValue('province', value.codeName)

            //reset district, school field when province filed is changed
            setDistrict('')
            setValue('school', '')
            setOptionsSchool([])

            setFormLoading(true)
            const response: ListResponse<District> = await districtApi.getByCodeProvince(value.codeName);
            setOptionsDistrict(response.data);
            setFormLoading(false)
        }
    }

    const handleDistrictSelected = async (e: any, value: District) => {
        if (value?.codeName) {
            setDistrict(value)
            setValue('district', value.codeName)

            setFormLoading(true)
            const response: ListResponse<School> = await schoolApi.getByProDis(province?.codeName as string, value.codeName)
            const options = mapOptions.school(response.data)

            setOptionsSchool(options);
            setFormLoading(false)
        }
    }

    const handleOkBtn = () => {
        form.submit()
    }

    return (
        <Form onFinish={handleSubmit(onSubmit)} form={form}>
            <Modal title="Chỉnh sửa thông tin tài khoản" visible={showUpdateForm} onCancel={() => setShowUpdateForm(false)} onOk={handleOkBtn} okButtonProps={{ htmlType: 'submit' }}
                confirmLoading={loading} okText='Cập nhật' cancelText='Hủy'>
                <Box>
                    <Spin spinning={formLoading} size='large'>
                        {isErrForm && <Alert message='Đã xảy ra lỗi! Hãy tắt form và mở lại!' type='error' />}

                        <InputField type='text' label='Họ tên*' name='name' control={control} required />

                        <InputField type="email" control={control} name='email' label='Email' required={true} />

                        <InputField type='number' min='0' max='99' label='Điểm tín dụng' name='credit' control={control} required />

                        <RadioBtnField name='isAdmin' label="Quyền*" control={control} options={radioOptions} />

                        {province && <AutoCompleteField label="Tỉnh*" title='name' value={province} onChange={handleProvinceSelected} options={optionsProvince} disabled={optionsProvince.length === 0 ? true : false} />}

                        {(district || district === '') && <AutoCompleteField label="Quận/Huyện/TP*" title='name' value={district} onChange={handleDistrictSelected} options={optionsDistrict} disabled={optionsDistrict.length === 0 ? true : false} />}

                        {defaultValueSchool && <SelectField label='Trường*' name='school' defaultValue={defaultValueSchool} control={control} disabled={optionsSchool.length === 0 ? true : false} options={optionsSchool} mt={16} mb={8} />}
                    </Spin>
                </Box>
            </Modal>
        </Form>
    )
}
