import * as React from 'react';

import { DraggableItem, DroppableArea } from 'components/DragDrop';
import { PrimaryButton, DarkButton } from 'components/Button';
import { Paragraph } from 'components/Typography';
import { Input, InputFile } from 'components/Input';

import useLocalStorage from 'hooks/useLocalStorage';
import useHistoryState from 'hooks/useHistoryState';

const ElementButton = ({ text, ...others }) => (
  <PrimaryButton {...others}>{text || 'Button'}</PrimaryButton>
);

const ElementParagraph = ({ text, ...others }) => (
  <Paragraph {...others}>{text || 'Paragraph'}</Paragraph>
);

const Components = {
  ElementButton,
  ElementParagraph,
};

const ParagraphBuilder = ({ onChange, text = '' }) => {
  return (
    <Input
      label='Paragraph text'
      value={text}
      onChange={(e) => {
        onChange({ text: e.target.value });
      }}
    />
  );
};

const ButtonBuilder = ({ onChange, text = '', message = '' }) => {
  return (
    <div className='flex flex-col gap-y-4'>
      <Input
        label='Button text'
        value={text}
        onChange={(e) => {
          onChange({ message, text: e.target.value });
        }}
      />
      <Input
        label='Alert message'
        value={message}
        onChange={(e) => {
          onChange({ message: e.target.value, text });
        }}
      />
    </div>
  );
};

const AdminComponents = {
  ElementButton: ButtonBuilder,
  ElementParagraph: ParagraphBuilder,
};

const initialElements = [
  {
    component: 'ElementButton',
  },
  {
    component: 'ElementParagraph',
  },
];

function getUID() {
  return Date.now().toString(36);
}

export default function Admin() {
  const [, setElements] = useLocalStorage('elements', '');

  const [draggedItem, setDraggedItem] = React.useState(null);
  const [selectedId, setSelectedId] = React.useState(null);

  const {
    state: droppedItems,
    setState: setDroppedItems,
    index,
    lastIndex,
    undo,
    redo,
  } = useHistoryState([]);

  const canUndo = index > 0;
  const canRedo = index < lastIndex;

  const [localCoords, setLocalCoords] = React.useState({ x: 0, y: 0 });
  const { x, y } = localCoords;

  const handleMouseMove = (event) => {
    setLocalCoords({
      x: event.clientX - event.target.offsetLeft,
      y: event.clientY - event.target.offsetTop,
    });
  };

  const handleDragStart = (item) => {
    setDraggedItem(item);
  };

  const handleDragDrop = () => {
    setDraggedItem(null);
  };

  const handleDrop = (item) => {
    const foundedElement = initialElements.find(
      (element) => element.component === item
    );

    const id = getUID();
    const newItem = {
      ...foundedElement,
      id,
      props: {},
    };

    setDroppedItems([...droppedItems, newItem]);
    setDraggedItem(null);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleClickItem = (item) => {
    setSelectedId(item.id);
  };

  const handleSelectedItemChange = (props) => {
    const index = droppedItems.findIndex((item) => item.id === selectedId);
    const newItem = {
      ...droppedItems[index],
      props,
    };

    setDroppedItems([
      ...droppedItems.slice(0, index),
      newItem,
      ...droppedItems.slice(index + 1),
    ]);
  };

  const handleSave = () => {
    setElements(JSON.stringify(droppedItems));
  };

  const handleExport = () => {
    if (droppedItems.length === 0) {
      alert('No elements found');
      return;
    }

    const blob = new Blob([JSON.stringify(droppedItems, null, 4)], {
      type: 'application/json',
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'export.json';
    link.click();
  };

  const handleImport = (e) => {
    const file = e.target.files[0];
    const isValidFileType = file.type === 'application/json';

    if (!isValidFileType) {
      alert('Invalid file type');
      return;
    }

    const reader = new FileReader();
    reader.readAsText(file, 'UTF-8');
    reader.onload = (evt) => {
      const json = JSON.parse(evt.target.result);
      const isValidFile = json && Array.isArray(json);

      if (!isValidFile) {
        alert('Invalid file');
        return;
      }

      setDroppedItems(json);
    };
  };

  const itemsCount = droppedItems.length;

  const selectedItem = droppedItems.find((item) => item.id === selectedId);

  const AdminComponent =
    selectedItem?.component && AdminComponents[selectedItem.component];

  const config = React.useMemo(() => {
    const currentDroppedItem = droppedItems.find(
      (item) => item.id === selectedId
    );

    return selectedId ? JSON.stringify(currentDroppedItem, null, 4) : null;
  }, [droppedItems, selectedId]);

  return (
    <div>
      <div className='h-[50px] flex items-center justify-center'>
        <DarkButton onClick={handleSave} className='rounded-l-lg'>
          Save
        </DarkButton>
        <DarkButton onClick={() => undo()} disabled={!canUndo}>
          Undo
        </DarkButton>
        <DarkButton onClick={() => redo()} disabled={!canRedo}>
          Redo
        </DarkButton>
        <DarkButton onClick={handleExport}>Export</DarkButton>
        <InputFile onChange={handleImport} label='Import' accept='.json' />
        <DarkButton
          component='a'
          href='/consumer'
          target='_blank'
          className='rounded-r-lg'
        >
          View
        </DarkButton>
      </div>
      <div className='flex h-[calc(100vh-50px)]'>
        <div className='flex flex-col w-[20%]'>
          {initialElements.map((item) => (
            <DraggableItem
              key={item.component}
              item={item}
              onDragStart={handleDragStart}
              onDragDrop={handleDragDrop}
            />
          ))}
        </div>
        <div
          className='flex flex-col w-[80%] bg-violet-300'
          onMouseMove={handleMouseMove}
        >
          <DroppableArea
            className='h-[70%] relative p-4 z-[1]'
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            <div className='absolute top-4 left-4 -z-[1]'>
              <div>
                Mouse: ({x ?? 0}, {y ?? 0})
              </div>
              <div>Dragging: {draggedItem}</div>
              <div>Instances: {itemsCount}</div>
              <div className='flex gap-x-1'>
                Config: <div className='w-[40%]'>{config}</div>
              </div>
            </div>
            <div className='w-full h-full flex flex-col items-center gap-y-4'>
              {droppedItems.map((item) => {
                const { component, id } = item;
                const Component = Components[component];
                const parsedConfig = droppedItems.find(
                  (item) => item.id === id
                );

                return (
                  <Component
                    key={item.id}
                    id={item.id}
                    onClick={() => handleClickItem(item)}
                    {...parsedConfig?.props}
                  />
                );
              })}
            </div>
          </DroppableArea>
          <div className='h-[30%] bg-lime-300 p-4'>
            {selectedItem && (
              <AdminComponent
                key={selectedItem.id}
                {...selectedItem.props}
                onChange={handleSelectedItemChange}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
