import Image, { StaticImageData } from 'next/image';
import Link from 'next/link';
import LogoImage from '../../public/logo1.jpg';
import HorizontalLogoImage from '../../public/logo1-horizontal.jpg'


interface LogoProps {
  href?: string;
  alt?: string;
  className?: string;
  horizontal?: StaticImageData;
  vertical?: StaticImageData;
}

export default function Logo({
  href = '/dashboard',
  alt = 'Logo',
  className = 'relative w-full overflow-hidden h-28 mb-2 rounded-md bg-cover md:h-40',
  horizontal = HorizontalLogoImage,
  vertical = LogoImage
}: LogoProps) {

  return (
    <Link href={href}>
      <div 
        className={`${className}`}
      >
        {/* Mobile (horizontal) */}
        <Image
          src={horizontal}
          alt={alt}
          className="object-contain md:hidden"
        />
        {/* Desktop (vertical) */}
        <Image
          src={vertical}
          alt={alt}
          className="hidden object-contain md:block"
        />
      </div>
    </Link>
  );
}
