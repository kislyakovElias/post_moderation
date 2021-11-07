import logo from './logo.svg';
import './App.css';
import Card from "./Card";
import React, {useEffect, useRef, useState} from "react";
import 'bootstrap/dist/css/bootstrap.min.css';

import axios from "axios";


function App() {

  const stockArr =[{}]

  const [array, setArray] = useState(stockArr);
  const [moderated, setModerated] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [index, setIndex] = useState(0);
  const [page, setPage] = useState(0);
  const myRef = useRef([])

  console.log(index,'indeXXX')
  useEffect(()=>{
    fetchData()
    if (myRef.current) {
    myRef.current = myRef.current.slice(0, array.length)
    }

  },[])

  function postData(params) {
    axios({
      method: 'PATCH',
      url: 'http://localhost:5000/response/',
      data: params
      })
       .then((res) => {
    }).catch((err) => console.log(err))
  }

  function fetchData() {
    setPage(p=>p+1)
    axios({
      method: 'GET',
      url: 'http://localhost:5000/cards',
      params: {
        header: "Access-Control-Allow-Origin",
        page: page+1,
      }
    }).then((res) => {
      setArray([...res.data])
      window.scrollTo({top: myRef?.current[0]?.offsetTop, behavior: "smooth"})
    }).catch((err) => console.log(err))
  }

window.addEventListener('keydown',(e)=>{
if (e.key === 'Enter'){
  setIsLoading(true)
}
})

  return (
    <div className="App"
        >
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Enter to <code>load data</code> and a,d,e to change status, F7 to submit.
        </p>
      </header>
        {isLoading && array.map((post,i) =>
          <div ref={el=> myRef.current[i] = el}  className={"App"} key={post.id} tabIndex={0}>
             <Card key={post.id} el={post} {...post}
             index={index} setIndex={setIndex} moderated={moderated} setModerated={setModerated} postData={postData} array={array} setPage={setPage} page={page} fetchData={fetchData} myRef={myRef}
             />
          </div> )}

    </div>
  );
}

export default App;
