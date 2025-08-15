export function InputField({
  icon,
  name,
  label,
  register,
  errors,
  type = "text",
  rules = {},
}: any) {
  const hasError = !!errors[name];
  return (
    <div className="relative">
      <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
        {icon}
      </span>
      <input
        id={name}
        type={type}
        {...register(name, rules)}
        className={`peer w-full rounded-xl border pl-12 pr-4 py-3 text-sm text-gray-900 placeholder-transparent bg-white/70 shadow-sm focus:outline-none focus:ring-2
          ${
            hasError
              ? "border-red-500 focus:border-red-500 focus:ring-red-200"
              : "border-gray-200 focus:border-blue-500 focus:ring-blue-200"
          }`}
        placeholder={label}
      />
      <label
        htmlFor={name}
        className="absolute left-12 -top-2 text-xs text-gray-500 bg-white/90 px-1 peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400 peer-focus:-top-2 peer-focus:text-xs peer-focus:text-blue-600"
      >
        {label}
      </label>
    </div>
  );
}
