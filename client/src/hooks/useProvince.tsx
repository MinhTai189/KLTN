import provinceApi from "api/province"
import { FieldOption, ListResponse, Province } from "models"
import { useEffect, useState } from "react"
import { mapProvinces } from "utils"

export const useProvince = () => {
    const [optionsProvince, setOptionsProvince] = useState<Array<Province>>([])
    const [autoCompProvince, setAutoCompProvince] = useState<Array<FieldOption>>([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        setLoading(true)
        provinceApi.getAll()
            .then((response: ListResponse<Province>) => {
                const listProvince = mapProvinces(response.data)

                //use for auto autocompleted field
                const autoCompData = listProvince.map(data => ({
                    value: data.codeName,
                    label: data.name
                }))

                setOptionsProvince(listProvince)
                setAutoCompProvince(autoCompData)
                setLoading(false)
            })
            .catch((err: any) => {
                console.log("Khong the lay du lieu provinces", err.message)
                setLoading(false)
            })
    }, [])

    return { optionsProvince, loading, autoCompProvince }
}
