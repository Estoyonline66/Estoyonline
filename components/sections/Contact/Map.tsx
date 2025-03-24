/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react'
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api'

const containerStyle = {
  width: '100%',
  height: '400px',
}

const center = {
  lat: -3.745,
  lng: -38.523,
}

const key = process.env.GOOGLE_MAP_KEY as string
function ContactMap() {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey:key,
  })

  const [map, setMap] = React.useState<google.maps.Map|null>(null)

  interface MapProps {
    map: google.maps.Map
  }

  const onLoad = React.useCallback(function callback(map: google.maps.Map) {
    // This is just an example of getting and using the map instance!!! don't just blindly copy!
    const bounds = new window.google.maps.LatLngBounds(center)
    map.fitBounds(bounds)

    setMap(map)
  }, [])

  const onUnmount = React.useCallback(function callback() {
    setMap(null)
  }, [])

  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={10}
      onLoad={onLoad}
      onUnmount={onUnmount}
    >
      {/* Child components, such as markers, info windows, etc. */}
      <></>
    </GoogleMap>
  ) : (
    <></>
  )
}

export default React.memo(ContactMap)