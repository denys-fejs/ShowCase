import React from 'react';
import styles from './Map.module.scss';

interface IProps {
  lat: number;
  lon: number;
}

const Map = ({ lat, lon }: IProps) => {
  return (
    <div>
      <iframe
        frameBorder='0'
        scrolling='no'
        marginWidth={0}
        marginHeight={0}
        src={`https://www.openstreetmap.org/export/embed.html?bbox=${lon - 0.23}%2C${lat - 0.23}%2C${lon + 0.24}%2C${
          lat + 0.23
        }&amp;layer=mapnik&amp;marker=${lat}%2C${lon}`}
        className={styles.map}
      />
      <br />
      <small>
        <a href={`https://www.openstreetmap.org/?mlat=${lat}&amp;mlon=${lon}#map=11/${lat}/${lon}`}>View Larger Map</a>
      </small>
    </div>
  );
};

export default Map;
