import axios from 'axios';

const axi = axios.create({
    baseURL: `http://127.0.0.1:3003`
});

const categoryAPI = {
    getAll: () => axi.get(`/category`),
}

const trademarkAPI = {
    getAll: () => axi.get(`/trademark`),
}

const productAPI = {
    getAll: () => axi.get(`/product`),
    getById: (id) => axi.get(`/product/${id}`),
    getByCategoryId: (id) => axi.get(`/product/byCategory/${id}`),
}

const provinceAPI = {
    getAll: () => axi.get(`https://provinces.open-api.vn/api/?depth=2`),
    getGeoCodeing: (searchTerm) => axi.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${searchTerm}.json?country=vn&limit=5&types=district%2Ccountry%2Clocality%2Cneighborhood%2Cpoi&access_token=${process.env.REACT_APP_MAPBOX_KEY}`),
    calculateShippingCharges: ({myLng,myLat,cusLng, cusLat}) => axi.get(`https://api.mapbox.com/directions/v5/mapbox/driving/${myLng},${myLat};${cusLng},${cusLat}?alternatives=true&geometries=geojson&language=vn&overview=simplified&steps=true&access_token=${process.env.REACT_APP_MAPBOX_KEY}`)
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

const userAPI = {
    login: (data) => axi.post(`/user/login`,data,{
        headers: {
            'Content-Type': `application/json`
        }
    }),
    register: (data) => axi.post(`/user/register`,data,{
        headers: {
            'Content-Type': `application/json`
        }
    }),
    forgotPassword: (data) => axi.post(`/user/forgot`,data,{
        headers: {
            'Content-Type': `application/json`
        }
    }),
    updateNewPassword: (data) => axi.post(`/user/updateNewPassword`,data,{
        headers: {
            'Content-Type': `application/json`
        }
    }),
}


export default { trademarkAPI, categoryAPI, productAPI, provinceAPI, exportOrderAPI, userAPI };