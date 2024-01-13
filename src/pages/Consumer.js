import * as React from 'react';
import { useNavigate } from 'react-router-dom';

import { PrimaryButton } from 'components/Button';
import { Paragraph } from 'components/Typography';

import useLocalStorage from 'hooks/useLocalStorage';

const ElementButton = ({ text, message, ...others }) => {
  const handleClick = () => {
    alert(message);
  };
  return (
    <PrimaryButton onClick={handleClick} {...others}>
      {text || 'Button'}
    </PrimaryButton>
  );
};

const ElementParagraph = ({ text, ...others }) => (
  <Paragraph {...others}>{text || 'Paragraph'}</Paragraph>
);

const Components = {
  ElementButton,
  ElementParagraph,
};

export default function Consumer() {
  const navigate = useNavigate();
  const [elements] = useLocalStorage('elements', '');
  const isValidElements =
    elements &&
    Array.isArray(JSON.parse(elements)) &&
    JSON.parse(elements).length > 0;

  const parsedElements = isValidElements ? JSON.parse(elements) : null;

  return (
    <div>
      {!isValidElements ? (
        <div className='flex flex-col items-center justify-center h-screen'>
          <h1 className='text-4xl font-bold'>No elements found</h1>
          <button
            className='mt-4 px-4 py-2 bg-blue-500 text-white rounded-md'
            onClick={() => navigate('/admin')}
          >
            Go to admin
          </button>
        </div>
      ) : (
        <div className='flex flex-col items-center gap-y-4 h-screen p-4'>
          {parsedElements?.map((element) => {
            const Component = Components[element.component];
            return (
              <Component key={element.id} id={element.id} {...element.props} />
            );
          })}
        </div>
      )}
    </div>
  );
}
