const Paragraph = ({ children, ...others }) => (
  <p className='text-gray-600' {...others}>
    {children}
  </p>
);

export { Paragraph };
