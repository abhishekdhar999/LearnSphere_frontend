import React, { useRef, useState, useEffect } from 'react';

export default function Whiteboard({community}) {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [context, setContext] = useState(null);
  const [textMode, setTextMode] = useState(false);
  const [texts, setTexts] = useState([]);
  const [currentText, setCurrentText] = useState('');

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    setContext(ctx);
  }, []);

  const startDrawing = (e) => {
    setIsDrawing(true);
    context.beginPath();
    context.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    context.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    context.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    context.closePath();
  };

  const handleTextClick = (e) => {
    if (textMode) {
      const text = prompt("Enter your text:");
      const newText = {
        text,
        x: e.nativeEvent.offsetX,
        y: e.nativeEvent.offsetY,
      };
      setTexts((prevTexts) => [...prevTexts, newText]);
    }
  };

  const renderText = () => {
    texts.forEach((textItem) => {
      context.font = "20px Arial";
      context.fillText(textItem.text, textItem.x, textItem.y);
    });
  };

  useEffect(() => {
    if (context) {
      renderText();
    }
  }, [texts, context]);

  return (
<>



    <div className='my-12 text-white'>
      <h2 className='text-6xl my-12  text text-center'>Collaborative Whiteboard :  </h2>

      <h2 className='text-6xl my-12  text text-center'>
      [ {community?.title} ]
      </h2>
      {/* <h2>{community?.groupChatId}</h2> */}
      <div className='flex justify-center flex-col my-12'>
        <p className='text-2xl text text-center my-6 mx-4'>Change your mode from here</p>
        <button className='text-2xl bg-sky-400 p-2 md:mx-24 mx-4 rounded-3xl' onClick={() => setTextMode(!textMode)}>
          {textMode ? 'Draw Mode' : 'Text Mode'}
        </button>
      </div>

      <div className='flex justify-center'>
        <h1 className='text text-xl'>Whiteboard</h1>
      </div>
      <canvas
      className='bg-white'
        ref={canvasRef}
        width={1000}
        height={500}
        style={{ border: "1px solid black" }}
        onMouseDown={textMode ? handleTextClick : startDrawing}
        onMouseUp={stopDrawing}
        onMouseMove={draw}
      />
    </div>
    </>
  );
}
