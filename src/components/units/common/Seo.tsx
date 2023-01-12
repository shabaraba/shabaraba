import { isNull } from 'lodash';
import { NextSeo } from 'next-seo';
import { FC } from 'react';

type Props = {
  title: string;
  coverImageUrl?: string;
}

export const Seo: FC<Props> = ({ title, coverImageUrl }) => {
  let imageUrl: string = 'https://og-image-shabaraba.vercel.app/' + title + '.png?md=1&fontSize=100px&q=85&fm=jpg&crop=entropy&cs=srgb&siteTitle=Coffee+Break+Point';
  if (coverImageUrl != null && coverImageUrl != undefined) {
    imageUrl += '&bg=' + encodeURI(coverImageUrl);
  }
  // console.log(imageUrl);
  return (
    <NextSeo
      openGraph={{
        title: title,
        images: [
          {
            url: imageUrl
          },
        ],
      }}
    />
  );
}