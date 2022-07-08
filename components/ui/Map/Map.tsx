import 'mapbox-gl/dist/mapbox-gl.css';

import { FC } from 'react';
import Map, { Marker } from 'react-map-gl';

type CustomMapProps = {
  latitude?: number;
  longitude?: number;
  zoom?: number;
  height?: number | string;
};

const CustomMap: FC<CustomMapProps> = ({
  children,
  latitude = 50.831583,
  longitude = 4.234742,
  zoom = 14,
  height = 400,
}) => {
  return (
    <Map
      initialViewState={{
        latitude,
        longitude,
        zoom,
      }}
      style={{ width: '100%', height }}
      mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
      mapStyle="mapbox://styles/mapbox/streets-v11"
      // Disable this if maps aren't reloading
      scrollZoom={false}
      interactive={false}
      reuseMaps
    >
      <Marker latitude={latitude} longitude={longitude} anchor="bottom">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="48"
          viewBox="0 0 82.472 105.758"
        >
          <g id="kaartprikker" transform="translate(-334 -1601.907)">
            <path
              id="Path_17807"
              data-name="Path 17807"
              d="M332.062,427.467c0,22.774-41.236,64.522-41.236,64.522s-41.236-41.748-41.236-64.522a41.236,41.236,0,0,1,82.472,0Z"
              transform="translate(84.41 1215.676)"
              fill="#d03030"
            />
            <g id="logo-zz-S" transform="translate(-4853.928 1308.39)">
              <g
                id="Layer_8_copy"
                data-name="Layer 8 copy"
                transform="translate(5215.716 309.61)"
              >
                <path
                  id="Path_6647"
                  data-name="Path 6647"
                  d="M5241,420.748c1.911,8.891-1.706,16.031-2.642,23.786-.128,1.057.174,2.349,0,3.4-.5,3.012-1.7,7.6-2.266,11.7-.2,1.426-1.989,4.493.756,4.908,1.9-.113.884-3.145,1.133-4.908a30.351,30.351,0,0,1,3.775-.378,63.322,63.322,0,0,1,.377,11.327c-2.926.85-7.4.15-10.949.377-.854-15.9,4.149-29.026,5.285-44.174-1.067.313-.977-.533-1.887-.377-1.654.916.415,3.869-.755,5.663h-3.776c-1.22-2.809-.611-7.442-.754-11.327,2.547-1.231,8.272-.276,11.7,0"
                  transform="translate(-5215.33 -419.595)"
                  fill="#fff"
                />
                <path
                  id="Path_6648"
                  data-name="Path 6648"
                  d="M5226.777,420.008c1.1,9.325-.363,18.549-2.266,26.429-.38,1.578-1.355,7.713-1.51,9.439-.124,1.4-.7,3.2-.755,4.908-.034,1.091-1.276,3.489,1.133,3.4,1.631-.257.347-3.428.754-4.908a9.4,9.4,0,0,1,3.775-.377,67.165,67.165,0,0,1,.756,10.948c-3.25.774-7.963.095-11.327.756-1.343-7.808.809-14.664,1.889-23.409.865-7.011,2.82-13.914,3.4-20.767h-2.644c-1.008.933.891,3.663-.377,4.909-.267.481-.7.356-1.16.184-.557-.208-1.173.17-1.625.05s-.806-1.8-.971-3.195a38.475,38.475,0,0,1,.358-8.744c3.795.449,6.982-.521,10.573.377"
                  transform="translate(-5215.717 -419.61)"
                  fill="#fff"
                />
              </g>
            </g>
          </g>
        </svg>
      </Marker>
      {children}
    </Map>
  );
};

export default CustomMap;
