import { ImageWithAspectRatio } from "@components/ui/image-with-aspect-ratio";

type Props = {
  alt: string;
  src: string;
};

export function TexturedImage({ alt, src }: Props) {
  return (
    <ImageWithAspectRatio
      wrapperClassName={
        // brand-blue background + dotted texture overlay (mix-blend luminosity)
        'bg-blue-500 before:absolute before:inset-0 before:z-[1] before:bg-[image:radial-gradient(rgba(255,255,255,0.2)_1px,rgba(0,0,0,0.25)_1px),radial-gradient(rgba(255,255,255,0.1)_1px,rgba(0,0,0,0.5)_1px)] before:[background-size:3px_3px] before:[background-position:0_0,2px_2px] before:mix-blend-luminosity before:content-[""]'
      }
      aspectRatio="1/1"
      alt={alt}
      src={src}
    />
  );
}
