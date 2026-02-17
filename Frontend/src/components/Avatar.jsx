// src/components/Avatar.jsx
export default function Avatar({ src, initials, size = 10, className = "" }) {
  const dim = `w-${size} h-${size}`;

  if (src) {
    return (
      <img
        src={src}
        alt="avatar"
        className={`${dim} rounded-full object-cover ${className}`}
      />
    );
  }

  return (
    <div className={`${dim} rounded-full bg-orange-500 text-white flex items-center justify-center font-semibold ${className}`}>
      {initials}
    </div>
  );
}