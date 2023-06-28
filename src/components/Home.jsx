
import "./home.css";
import "mapbox-gl/dist/mapbox-gl.css";
import { Room,Star } from "@material-ui/icons";
import Map, { Popup,
  Marker,NavigationControl,FullscreenControl, GeolocateControl
} from "react-map-gl";
import {format} from "timeago.js";
import { useEffect, useState } from "react";
 import axios from "axios";
 import Register from "./Register";
 import Login from "./Login";

function Home() {
    
  const[viewport,setViewport]=useState({
    latitude: 32.4279,
    longitude: 53.6880,
    zoom: 3,
  });
 const myStorage = window.localStorage;
  const [currentUsername, setCurrentUsername] =  useState(myStorage.getItem("user"));
   const[currentPlaceId,setCurrentPlaceId]=useState(null)
   const[newPlace,setNewPlace]=useState(null)
   const [pins,setPins] = useState([])
   const [title, setTitle] = useState(null);
   const [desc, setDesc] = useState(null);
   const [star, setStar] = useState(0);
   const [showPopup, setShowPopup] = useState(true);
   const [showRegister, setShowRegister] = useState(false);
   const [showLogin, setShowLogin] = useState(false);
   
   useEffect(()=>{
    const getPins = async ()=>{
      try{
const res = await axios.get("https://map-pinning-app-api.onrender.com/pins")
setPins(res.data)
      } catch(err){
        console.log(err)
      }
    };
    getPins()
   },[]);

   const handleMarkerClick = (id,lat,long)=>{
    if(currentUsername!=null){
    setCurrentPlaceId(id);

    setViewport({ ...viewport, latitude:lat, longitude:long });
   }
  };
  
   const handleAddClick = (e) => {
    try {
        if(currentUsername!=null){
      const { lng, lat } = e.lngLat;
      setNewPlace({
        lat,
        long: lng,
       
      });
    }
    } catch (err) {
      console.log(`This is the error: ${err}`);
      console.log(newPlace);
      console.log(e.lngLat);
    }
  };
  
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newPin = {
      username: currentUsername,
      title,
      desc,
      rating: star,
      lat: newPlace.lat,
      long: newPlace.long,
    };

    try {
      const res = await axios.post("https://map-pinning-app-api.onrender.com/pins", newPin);
      setPins([...pins, res.data]);
      setNewPlace(null);
    } catch (err) {
      console.log(err);
    }
  };
  const handleLogout = () => {
    setCurrentUsername(null);
    myStorage.removeItem("user");
  };

  return (
    <div className="App">
      <Map
   
     
        mapboxAccessToken={process.env.REACT_APP_MAPBOX}
        style={{
          width: "100vw",
          height: "100vh",
          borderRadius: "15px",
          border: "2px solid green",
          
          
        }}
        initialViewState={{
          longitude:viewport.longitude,
          latitude: viewport.latitude,
          zoom:viewport.zoom
        }}

      

        mapStyle="mapbox://styles/mapbox/streets-v9"
      onDblClick={ handleAddClick}
      
      >
        {pins.map(p=>(
    <>
        <Marker 
        longitude={p.long}   
        latitude={p.lat}
        offsetLeft={-3.5 * viewport.zoom}
         offsetTop={-7 * viewport.zoom}
        >
        <Room style={{ fontSize:viewport.zoom*10,color:p.username === currentUsername ?"red":"slateblue",cursor:"pointer"}}
        onClick={()=>handleMarkerClick(p._id,p.lat,p.long)} />
        </Marker>
      {
      p._id === currentPlaceId &&(
      <Popup 
       key={p._id}
      longitude={p.long}
       latitude={p.lat}
        anchor="left"
        closeButton={true}
        closeOnClick={false}
        onClose={()=>setCurrentPlaceId(null)}
        >
       <div className="card">
        <label>Place</label>
        <h4 className="place">{p.title}</h4>
       <label>Review</label>
        <p className="desc">{p.desc}</p>
        <label>Rating</label>
        <div className="stars">
        {Array(p.rating).fill(<Star className="star" />)}
        </div>
        <label>Information</label>
        <span className="username">Created by <b>{p.username}</b></span>
        <span className="date"> {format(p.createdAt)}</span>
       </div>
      </Popup>
)}
      </>
        ))}
       {newPlace &&(

      
        <>
        <Marker
              latitude={newPlace.lat}
              longitude={newPlace.long}
              offsetLeft={-3.5 * viewport.zoom}
              offsetTop={-7 * viewport.zoom}
            >
              <Room
                style={{
                  fontSize: 7 * viewport.zoom,
                  color: "tomato",
                  cursor: "pointer",
                }}
              />
            </Marker>




        <Popup
        latitude={newPlace.lat} 
        longitude={newPlace.long}
        anchor="left"
        closeButton={true}
        closeOnClick={false}
        onClose={()=>setNewPlace(null)}
        >
            <div>
                <form onSubmit={handleSubmit}>
                  <label>Title</label>
                  <input
                    placeholder="Enter a title"
                    onChange={(e) => setTitle(e.target.value)}
                  />
                  <label>Description</label>
                  <textarea
                    placeholder="Say us something about this place."
                    onChange={(e) => setDesc(e.target.value)}
                  />
                  <label>Rating</label>
                  <select onChange={(e) => setStar(e.target.value)}>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                  </select>
                  <button type="submit" className="submitButton">
                    Add Pin
                  </button>
                </form>
              </div>
       </Popup> 
       </>
       )}

{currentUsername ? (
          <button className="button logout"onClick={handleLogout}>
            Log out
          </button>
        ) : (
          <div className="buttons">
            <button className="button login" onClick={() => setShowLogin(true)}>
              Log in
            </button>
            <button
              className="button register"
              onClick={() => setShowRegister(true)}
            >
              Register
            </button>
          </div>
        )}
         {showRegister && <Register 
           setShowRegister={setShowRegister}
          />}
         {showLogin && (
          <Login
            setShowLogin={setShowLogin}
             myStorage={myStorage}
             setCurrentUsername={setCurrentUsername}
          />
        )}
       <NavigationControl position="bottom-right" />
        <FullscreenControl position="bottom-left"/>
        <GeolocateControl  position="top-left"/>
      </Map>
    </div>
  );
}

export default Home;