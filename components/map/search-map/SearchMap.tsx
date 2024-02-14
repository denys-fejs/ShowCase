import React, { useEffect, useMemo, useRef, useState } from 'react';
import { LatLng, LatLngLiteral } from 'leaflet';
import { Map, Marker, TileLayer } from 'react-leaflet';
import styles from './SearchMap.module.scss';
import Search from 'react-leaflet-search';
import { getCountryFromEndOfString } from 'utils';
import { useTranslation } from 'react-i18next';

interface IProps {
  setProjectCoords: (_: LatLng) => void;
  setCountry: (_: string) => void;
  lat: number | undefined;
  lon: number | undefined;
}
const SearchMap = ({ setProjectCoords, lat, lon, setCountry }: IProps) => {
  const { t } = useTranslation('views/project');
  const center =
    lat && lon
      ? {
          lat: lat,
          lng: lon,
        }
      : {
          lat: 51.505,
          lng: -0.09,
        };

  const [position, setPosition] = useState<LatLngLiteral>(center);

  const markerRef = useRef<any>(null);
  const eventHandlers = useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current;
        marker && setPosition(marker.getLatLng());
        marker && setProjectCoords(marker.getLatLng());
      },
    }),
    [markerRef],
  );

  useEffect(() => {
    lat &&
      lon &&
      setPosition({
        lat: lat,
        lng: lon,
      });
  }, [lat, lon]);

  return (
    <div className={styles.mapWrapper}>
      <span className={styles.title}>{t('projectInfo.mapSearchTitle')}</span>
      <Map center={position} zoom={13} scrollWheelZoom={false} className={styles.searchMap}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        />
        <Marker draggable={true} eventHandlers={eventHandlers} position={position} ref={markerRef} />
        <Search
          position='topright'
          inputPlaceholder={t('projectInfo.search')}
          showMarker={true}
          zoom={13}
          closeResultsOnClick={true}
          openSearchOnLoad={true}
        >
          {(info) => {
            setPosition(info?.latLng);
            setProjectCoords(info?.latLng);
            setCountry(getCountryFromEndOfString(info));
            return null;
          }}
        </Search>
      </Map>
    </div>
  );
};

export default SearchMap;
