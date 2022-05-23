import React from "react";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup, Tooltip } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import "./Map.css"
import { useParams } from "react-router-dom";
import markerIcon_green from "../../../assets/markers/marker-icon-green.png"
import markerIcon_red from "../../../assets/markers/marker-icon-red.png"
import L, { Icon } from 'leaflet'

const Comp = () => {

    let { owner } = useParams();
    const [hotspots, setHotspots] = React.useState([]);

    React.useEffect(() => {
        axios.get(`https://api.helium.io/v1/accounts/${owner}/hotspots`).then(res => {
            setHotspots(res.data.data);
        })
    }, [])

    const position = [51.219448, 4.402464];

    if (!hotspots) {
        return (<>Loading...</>);
    }

    const hotspotMarkers = hotspots.map((hotspot) => {
        console.log(hotspot);
        console.log(markerIcon_green);
        const markerIcon = (hotspot.status.online === "online") ? markerIcon_green : markerIcon_red;
        return (
            <Marker
                key={hotspot.address}
                position={[hotspot.lat, hotspot.lng]}
                icon={new Icon({ iconUrl: markerIcon, iconSize: [25, 41] })}
            >
                <Popup>
                <a href={`https://explorer.helium.com/hotspots/${hotspot.address}`} rel="noreferrer" target="_blank">
                    {hotspot.name}
                    </a>
                    
                </Popup>
                <Tooltip direction="right" offset={[10, 10]} opacity={1} permanent>
                    
                {hotspot.name}
                    
                    </Tooltip>
            </Marker>
        )
    })


    return (
        <>
            <section className="is-medium has-text-white">
                <MapContainer center={position} zoom={13} scrollWheelZoom={true}>
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {hotspotMarkers}
                </MapContainer>
            </section>
        </>
    )

};

export default Comp;