import Image from 'next/image';
import Link from 'next/link';

interface LogoProps {
  href?: string;
  alt?: string;
  className?: string;
  horizontal?: string;
  vertical?: string;
}

export default function Logo({
  href = '/dashboard',
  alt = 'Logo',
  className = 'relative w-full overflow-hidden h-28 mb-2 rounded-md bg-cover md:h-40',
  horizontal = '/logo1-horizontal.jpg',
  vertical = '/logo1.jpg'
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
