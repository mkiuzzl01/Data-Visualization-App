import axios from "axios";
import React, { useEffect, useState } from "react";
import EndYear from "../../components/EndYear/EndYear";
import Loading from "../../components/Loading/Loading";

const Home = () => {
    const [loading,setLoading]=useState(true);
    const [initialData, setData] = useState([]);
  const getData = async () => {
    setLoading(true)
    const { data } = await axios.get("http://localhost:5000/all-data");
    setData(data);
    setLoading(false)
  };
  useEffect(() => {
    getData();
  }, []);

  const endYear = initialData.filter(y=> y.end_year !== "");
  console.log(endYear);
  console.log(initialData);
  
  if(loading) return <Loading></Loading>

  return (
    <div>
        <h1>This is Home Page</h1>
        <EndYear endYear={endYear}></EndYear>
    </div>
  );
};

export default Home;
