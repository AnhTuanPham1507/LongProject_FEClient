import React, { useEffect, useState } from 'react'
import Contact from '../../components/Contact/Contact'
import FeaturedProducts from '../../components/FeaturedProducts/FeaturedProducts'
import Slider from '../../components/Slider/Slider'
import useFetch from '../../hooks/useFetch'
import FeaturedProductContent from '../../enums/FeaturedProductContent'
import "./Home.scss"

const Home = () => {
  const { data, loading, error } = useFetch("productAPI", "getAll");
  const [newestProducts, setNewestProducts] = useState([])
  const [topSoldProducts, setTopSoldProducts] = useState([])

  useEffect(() => {
    if(data){
      const tempNewest = [...data.docs]
      const tempSold = [...data.docs]
      tempNewest.sort((a,b) => new Date (b.createdAt) - new Date (a.createdAt))
      tempSold.sort((a,b) => b.price - a.price)
      setNewestProducts(tempNewest)
      setTopSoldProducts(tempSold)
    }
  },[data])

  return (
    loading?
    "loading...":
    <div className='home'>
      <Slider/>
      <FeaturedProducts type="Mới" data={newestProducts} content={FeaturedProductContent.newest}/>
      <FeaturedProducts type="Bán chạy" data={topSoldProducts} content={FeaturedProductContent.topSold}/>
      <Contact/>
    </div>
  )
}

export default Home