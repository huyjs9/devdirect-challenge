const Input = ({ label, placeholder = '', onChange, value }) => {
  return (
    <div>
      <label
        htmlFor='textField'
        className='block mb-2 text-sm font-medium text-gray-900'
      >
        {label}
      </label>
      <input
        type='text'
        id='textField'
        className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5'
        placeholder={placeholder}
        onChange={onChange}
        value={value}
      />
    </div>
  );
};

const InputFile = ({ label, className, ...others }) => (
  <div className='flex items-center h-[40px]'>
    <input
      type='file'
      name='file'
      id='file'
      className='w-[0.1px] h-[0.1px] opacity-0 overflow-hidden absolute z-[-1]'
      {...others}
    />
    <label
      htmlFor='file'
      className={`text-white bg-gray-800 hover:bg-gray-900 focus:outline-none font-medium text-sm px-5 py-2.5 cursor-pointer ${className}`}
    >
      {label || 'Choose a file'}
    </label>
  </div>
);

export { Input, InputFile };
