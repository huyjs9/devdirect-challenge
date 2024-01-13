const DraggableItem = ({ onDragStart, onDragDrop, item, className }) => {
  const handleDragStart = (e) => {
    e.dataTransfer.setData('text/plain', item.component);
    onDragStart(item.component);
  };

  const handleDragDrop = () => {
    onDragDrop();
  };

  const label = item.component.replace('Element', '');

  return (
    <div
      className={`${
        className ?? ''
      } cursor-pointer hover:bg-gray-400 transition-colors p-4 flex flex-col items-center justify-center`}
      draggable
      onDragStart={handleDragStart}
      onMouseLeave={handleDragDrop}
    >
      <div className='w-[48px] h-[48px] border' />
      <div className='mt-2'>{label}</div>
    </div>
  );
};

const DroppableArea = ({ onDrop, onDragOver, className, children }) => {
  const handleDrop = (e) => {
    e.preventDefault();
    const data = e.dataTransfer.getData('text/plain');
    onDrop(data);
  };

  return (
    <div className={className} onDrop={handleDrop} onDragOver={onDragOver}>
      {children}
    </div>
  );
};

export { DraggableItem, DroppableArea };
