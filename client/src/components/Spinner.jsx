

function Spinner() {
  return (
    <div className='fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-100 bg-opacity-75 z-50'>
      <div className='animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-purple-400'></div>
    </div>
  );
}

export default Spinner;
