const DarkButton = ({ children, component, className, ...others }) => {
  const Component = component || 'button';

  return (
    <Component
      type='button'
      className={`text-white bg-gray-800 hover:bg-gray-900 focus:outline-none font-medium text-sm px-5 py-2.5 ${className}`}
      {...others}
    >
      {children}
    </Component>
  );
};

const PrimaryButton = ({ children, ...others }) => (
  <button
    type='button'
    className='text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 focus:outline-none'
    {...others}
  >
    {children}
  </button>
);

export { DarkButton, PrimaryButton };
