const fn = () => {
  return (ws) => {
    ws.on('message', (msg) => {
      console.log('receive:', msg);
    });
  };
};

export default fn;
