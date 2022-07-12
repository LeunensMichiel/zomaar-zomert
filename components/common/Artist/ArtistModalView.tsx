import Image, { StaticImageData } from 'next/future/image';
import { VFC } from 'react';

import styles from './ArtistModalView.module.scss';

// const data = {
//   friday: {
//     date: '29 July 2022',
//     artists: [
//       {
//         src: forTheRecord,
//         title: 'For The Record',
//         day: '21:30-22:30',
//       },
//       {
//         src: kaaprisun,
//         title: 'Kaaprisun',
//         day: '22:30-00:00',
//       },
//       {
//         src: avalonn,
//         title: 'Avalonn',
//         day: '00:00-04:00',
//       },
//       {
//         src: tear,
//         title: 'Activities',
//         day: '🌞🌞🌞',
//       },
//       {
//         src: bike,
//         title: 'Zomaar Bike',
//         day: '16:00-22:00',
//       },
//       {
//         src: terras,
//         title: 'Zomaar Café',
//         day: 'All Day',
//       },
//     ],
//   },
//   saturday: {
//     date: '30 July 2022',
//     artists: [
//       {
//         src: romeos,
//         title: "De Romeo's",
//         day: '20:00:21:00',
//       },
//       {
//         src: wimSoutaer,
//         title: 'Wim Soutaer',
//         day: '21:00-22:00',
//       },
//       {
//         src: unclePhil,
//         title: 'Uncle Phil',
//         day: '22:00-23:30',
//       },
//       {
//         src: dimitriWouters,
//         title: 'Dimitri Wouters',
//         day: '23:30-01:00',
//       },
//       {
//         src: creator,
//         title: 'DJ Creator',
//         day: '01:00-02:30',
//       },
//       {
//         src: twallie,
//         title: 'Twallie',
//         day: '02:30-04:00',
//       },
//       {
//         src: tear,
//         title: 'Activities',
//         day: '🌞🌞🌞',
//       },
//       {
//         src: petanque,
//         title: 'Petanque',
//         day: '12:30-17:00',
//       },
//       {
//         src: terras,
//         title: 'Zomaar Café',
//         day: 'All Day',
//       },
//     ],
//   },
//   sunday: {
//     date: '31 July 2022',
//     artists: [
//       {
//         src: mrCreezy,
//         title: 'Mr. Creezy',
//         day: '13:00-16:00',
//       },
//       {
//         src: run,
//         title: 'Zomaar Run',
//         day: '10:00-11:00',
//       },
//       {
//         src: paella,
//         title: 'Paella',
//         day: '12:00-15:00',
//       },
//       {
//         src: quiz,
//         title: 'Zomaar Quiz',
//         day: '19:30-22:00',
//       },
//       {
//         src: kinderanimatie,
//         title: 'Kids Park',
//         day: 'All Day',
//       },
//       {
//         src: terras,
//         title: 'Zomaar Café',
//         day: 'All Day',
//       },
//     ],
//   },
// };

const data = {
  avalonn: {
    text: 'Ullamco voluptate excepteur proident est esse ipsum anim.\n\nLaboris non consequat sit cupidatat nostrud eiusmod exercitation reprehenderit amet dolor reprehenderit dolor mollit. Consequat nostrud commodo ipsum in nostrud duis anim eiusmod. Enim eu irure mollit eiusmod aliqua quis elit consectetur sit mollit sunt et. Cupidatat ex magna non culpa sunt sunt non velit aute magna. Aute voluptate esse ad laborum proident excepteur dolor minim. Tempor cillum dolore aliqua do eiusmod ipsum culpa deserunt ipsum.',
    day: 'Friday 29 July',
    subtitle: '20:00-23:00',
  },
  // avalonn: {
  //   text: 'Ullamco voluptate excepteur proident est esse ipsum anim.\n\nLaboris non consequat sit cupidatat nostrud eiusmod exercitation reprehenderit amet dolor reprehenderit dolor mollit. Consequat nostrud commodo ipsum in nostrud duis anim eiusmod. Enim eu irure mollit eiusmod aliqua quis elit consectetur sit mollit sunt et. Cupidatat ex magna non culpa sunt sunt non velit aute magna. Aute voluptate esse ad laborum proident excepteur dolor minim. Tempor cillum dolore aliqua do eiusmod ipsum culpa deserunt ipsum.',
  //   day: 'Friday 29 July',
  //   subtitle: '20:00-23:00',
  // },
  // avalonn: {
  //   text: 'Ullamco voluptate excepteur proident est esse ipsum anim.\n\nLaboris non consequat sit cupidatat nostrud eiusmod exercitation reprehenderit amet dolor reprehenderit dolor mollit. Consequat nostrud commodo ipsum in nostrud duis anim eiusmod. Enim eu irure mollit eiusmod aliqua quis elit consectetur sit mollit sunt et. Cupidatat ex magna non culpa sunt sunt non velit aute magna. Aute voluptate esse ad laborum proident excepteur dolor minim. Tempor cillum dolore aliqua do eiusmod ipsum culpa deserunt ipsum.',
  //   day: 'Friday 29 July',
  //   subtitle: '20:00-23:00',
  // },
  // avalonn: {
  //   text: 'Ullamco voluptate excepteur proident est esse ipsum anim.\n\nLaboris non consequat sit cupidatat nostrud eiusmod exercitation reprehenderit amet dolor reprehenderit dolor mollit. Consequat nostrud commodo ipsum in nostrud duis anim eiusmod. Enim eu irure mollit eiusmod aliqua quis elit consectetur sit mollit sunt et. Cupidatat ex magna non culpa sunt sunt non velit aute magna. Aute voluptate esse ad laborum proident excepteur dolor minim. Tempor cillum dolore aliqua do eiusmod ipsum culpa deserunt ipsum.',
  //   day: 'Friday 29 July',
  //   subtitle: '20:00-23:00',
  // },
  // avalonn: {
  //   text: 'Ullamco voluptate excepteur proident est esse ipsum anim.\n\nLaboris non consequat sit cupidatat nostrud eiusmod exercitation reprehenderit amet dolor reprehenderit dolor mollit. Consequat nostrud commodo ipsum in nostrud duis anim eiusmod. Enim eu irure mollit eiusmod aliqua quis elit consectetur sit mollit sunt et. Cupidatat ex magna non culpa sunt sunt non velit aute magna. Aute voluptate esse ad laborum proident excepteur dolor minim. Tempor cillum dolore aliqua do eiusmod ipsum culpa deserunt ipsum.',
  //   day: 'Friday 29 July',
  //   subtitle: '20:00-23:00',
  // },
  // avalonn: {
  //   text: 'Ullamco voluptate excepteur proident est esse ipsum anim.\n\nLaboris non consequat sit cupidatat nostrud eiusmod exercitation reprehenderit amet dolor reprehenderit dolor mollit. Consequat nostrud commodo ipsum in nostrud duis anim eiusmod. Enim eu irure mollit eiusmod aliqua quis elit consectetur sit mollit sunt et. Cupidatat ex magna non culpa sunt sunt non velit aute magna. Aute voluptate esse ad laborum proident excepteur dolor minim. Tempor cillum dolore aliqua do eiusmod ipsum culpa deserunt ipsum.',
  //   day: 'Friday 29 July',
  //   subtitle: '20:00-23:00',
  // },
  // avalonn: {
  //   text: 'Ullamco voluptate excepteur proident est esse ipsum anim.\n\nLaboris non consequat sit cupidatat nostrud eiusmod exercitation reprehenderit amet dolor reprehenderit dolor mollit. Consequat nostrud commodo ipsum in nostrud duis anim eiusmod. Enim eu irure mollit eiusmod aliqua quis elit consectetur sit mollit sunt et. Cupidatat ex magna non culpa sunt sunt non velit aute magna. Aute voluptate esse ad laborum proident excepteur dolor minim. Tempor cillum dolore aliqua do eiusmod ipsum culpa deserunt ipsum.',
  //   day: 'Friday 29 July',
  //   subtitle: '20:00-23:00',
  // },
  // avalonn: {
  //   text: 'Ullamco voluptate excepteur proident est esse ipsum anim.\n\nLaboris non consequat sit cupidatat nostrud eiusmod exercitation reprehenderit amet dolor reprehenderit dolor mollit. Consequat nostrud commodo ipsum in nostrud duis anim eiusmod. Enim eu irure mollit eiusmod aliqua quis elit consectetur sit mollit sunt et. Cupidatat ex magna non culpa sunt sunt non velit aute magna. Aute voluptate esse ad laborum proident excepteur dolor minim. Tempor cillum dolore aliqua do eiusmod ipsum culpa deserunt ipsum.',
  //   day: 'Friday 29 July',
  //   subtitle: '20:00-23:00',
  // },
  // avalonn: {
  //   text: 'Ullamco voluptate excepteur proident est esse ipsum anim.\n\nLaboris non consequat sit cupidatat nostrud eiusmod exercitation reprehenderit amet dolor reprehenderit dolor mollit. Consequat nostrud commodo ipsum in nostrud duis anim eiusmod. Enim eu irure mollit eiusmod aliqua quis elit consectetur sit mollit sunt et. Cupidatat ex magna non culpa sunt sunt non velit aute magna. Aute voluptate esse ad laborum proident excepteur dolor minim. Tempor cillum dolore aliqua do eiusmod ipsum culpa deserunt ipsum.',
  //   day: 'Friday 29 July',
  //   subtitle: '20:00-23:00',
  // },
  // avalonn: {
  //   text: 'Ullamco voluptate excepteur proident est esse ipsum anim.\n\nLaboris non consequat sit cupidatat nostrud eiusmod exercitation reprehenderit amet dolor reprehenderit dolor mollit. Consequat nostrud commodo ipsum in nostrud duis anim eiusmod. Enim eu irure mollit eiusmod aliqua quis elit consectetur sit mollit sunt et. Cupidatat ex magna non culpa sunt sunt non velit aute magna. Aute voluptate esse ad laborum proident excepteur dolor minim. Tempor cillum dolore aliqua do eiusmod ipsum culpa deserunt ipsum.',
  //   day: 'Friday 29 July',
  //   subtitle: '20:00-23:00',
  // },
  // avalonn: {
  //   text: 'Ullamco voluptate excepteur proident est esse ipsum anim.\n\nLaboris non consequat sit cupidatat nostrud eiusmod exercitation reprehenderit amet dolor reprehenderit dolor mollit. Consequat nostrud commodo ipsum in nostrud duis anim eiusmod. Enim eu irure mollit eiusmod aliqua quis elit consectetur sit mollit sunt et. Cupidatat ex magna non culpa sunt sunt non velit aute magna. Aute voluptate esse ad laborum proident excepteur dolor minim. Tempor cillum dolore aliqua do eiusmod ipsum culpa deserunt ipsum.',
  //   day: 'Friday 29 July',
  //   subtitle: '20:00-23:00',
  // },
  // avalonn: {
  //   text: 'Ullamco voluptate excepteur proident est esse ipsum anim.\n\nLaboris non consequat sit cupidatat nostrud eiusmod exercitation reprehenderit amet dolor reprehenderit dolor mollit. Consequat nostrud commodo ipsum in nostrud duis anim eiusmod. Enim eu irure mollit eiusmod aliqua quis elit consectetur sit mollit sunt et. Cupidatat ex magna non culpa sunt sunt non velit aute magna. Aute voluptate esse ad laborum proident excepteur dolor minim. Tempor cillum dolore aliqua do eiusmod ipsum culpa deserunt ipsum.',
  //   day: 'Friday 29 July',
  //   subtitle: '20:00-23:00',
  // },
  // avalonn: {
  //   text: 'Ullamco voluptate excepteur proident est esse ipsum anim.\n\nLaboris non consequat sit cupidatat nostrud eiusmod exercitation reprehenderit amet dolor reprehenderit dolor mollit. Consequat nostrud commodo ipsum in nostrud duis anim eiusmod. Enim eu irure mollit eiusmod aliqua quis elit consectetur sit mollit sunt et. Cupidatat ex magna non culpa sunt sunt non velit aute magna. Aute voluptate esse ad laborum proident excepteur dolor minim. Tempor cillum dolore aliqua do eiusmod ipsum culpa deserunt ipsum.',
  //   day: 'Friday 29 July',
  //   subtitle: '20:00-23:00',
  // },
  // avalonn: {
  //   text: 'Ullamco voluptate excepteur proident est esse ipsum anim.\n\nLaboris non consequat sit cupidatat nostrud eiusmod exercitation reprehenderit amet dolor reprehenderit dolor mollit. Consequat nostrud commodo ipsum in nostrud duis anim eiusmod. Enim eu irure mollit eiusmod aliqua quis elit consectetur sit mollit sunt et. Cupidatat ex magna non culpa sunt sunt non velit aute magna. Aute voluptate esse ad laborum proident excepteur dolor minim. Tempor cillum dolore aliqua do eiusmod ipsum culpa deserunt ipsum.',
  //   day: 'Friday 29 July',
  //   subtitle: '20:00-23:00',
  // },
};

type Props = {
  src: StaticImageData;
  title: string;
};

export const ArtistModalView: VFC<Props> = ({ src, title }) => {
  const currentArtist = data?.avalonn;
  return (
    <div className={styles.root}>
      <div className={styles.image__container}>
        <Image className={styles.image} src={src} alt={title} />
        <picture>
          <source
            srcSet="/assets/tear-5-vertical.svg"
            media="(min-width: 1024px)"
          />
          <img src="/assets/tear-5.svg" alt="" className={styles.tear} />
        </picture>
      </div>
      <div className={styles.body}>
        <span className={styles.day}>{currentArtist.day}</span>
        <h1 className={styles.title}>{title}</h1>
        <span className={styles.subtitle}>{currentArtist.subtitle}</span>
        <p className={styles.text}>{currentArtist.text}</p>
      </div>
    </div>
  );
};
