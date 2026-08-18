'use client';
import Image from 'next/image';

export default function FloatingSpiderman() {
  return (
    <div className="fixed-spiderman-layer" aria-hidden="true">
      {/* Mid Left Spiderman */}
      <div className="spiderman-item spiderman-mid-left">
        <Image
          src="/flaoting_svg/mid-left.svg"
          alt="Spider-Man doodle"
          width={52}
          height={72}
          className="spiderman-img"
          priority
        />
      </div>

      {/* Bottom Left Spiderman */}
      <div className="spiderman-item spiderman-bottom-left">
        <Image
          src="/flaoting_svg/bottom-left.svg"
          alt="Spider-Man doodle"
          width={50}
          height={68}
          className="spiderman-img"
          priority
        />
      </div>

      {/* Mid Right Spiderman */}
      <div className="spiderman-item spiderman-mid-right">
        <Image
          src="/flaoting_svg/mid-right.svg"
          alt="Spider-Man doodle"
          width={54}
          height={72}
          className="spiderman-img"
          priority
        />
      </div>

      {/* Right Bottom Spiderman */}
      <div className="spiderman-item spiderman-right-bottom">
        <Image
          src="/flaoting_svg/right-bottom.svg"
          alt="Spider-Man doodle"
          width={56}
          height={66}
          className="spiderman-img"
          priority
        />
      </div>
    </div>
  );
}
