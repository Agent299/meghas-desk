const VIDEO_SRC =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260809_012548_ef22562c-c0ae-4816-ad9d-f8922af4e6a7.mp4";

export function BackgroundVideo() {
  return (
    <div aria-hidden="true" className="absolute inset-0 overflow-hidden bg-black">
      <video
        className="pointer-events-none absolute inset-0 size-full object-cover"
        autoPlay
        muted
        loop
        playsInline
      >
        <source src={VIDEO_SRC} type="video/mp4" />
      </video>
      {/* Scrim: keeps white type legible over the bright parts of the video */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_45%_at_50%_45%,rgb(0_0_0/0.45),transparent_75%)]" />
    </div>
  );
}
