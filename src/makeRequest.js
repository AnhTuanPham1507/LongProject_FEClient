import axios from 'axios';

const axi = axios.create({
    baseURL: `http://127.0.0.1:3003`
});

const categoryAPI = {
    getAll: () => axi.get(`/category`),
    create: (formData) => axi.post(`/category`,
        formData,
        {
            headers: {
                'Content-Type': `multipart/form-data; boundary=${formData._boundary}`
            }
        }),
    update: (id, formData) => axi.put(`/category/${id}`,
        formData,
        {
            headers: {
                'Content-Type': `multipart/form-data; boundary=${formData._boundary}`
            }
        }),
    delete: (id) => axi.delete(`/category/${id}`),

}

const productAPI = {
    getAll: () => axi.get(`/product`),
    getById: (id) => axi.get(`/product/${id}`),
    getByCategoryId: (id) => axi.get(`/product/byCategory/${id}`),
    create: (formData) => axi.post(`/product`,
        formData,
        {
            headers: {
                'Content-Type': `application/json`
            }
        }),
    update: (id, formData) => axi.put(`/product/${id}`,
        formData,
        {
            headers: {
                'Content-Type': `application/json`
            }
        }),
}

const provinceAPI = {
    getAll: () => axi.get(`https://provinces.open-api.vn/api/?depth=2`),
}

const exportOrderAPI = {
    create: (data) => axi.post(`/exportOrder`,
        data,
        {
            headers: {
                'Content-Type': `application/json`
            }
        })

}


export default { categoryAPI, productAPI, provinceAPI, exportOrderAPI };