export default function LoadingSpinner() {
  return (
    <div className='fixed inset-0 bg-[#1E1F20] bg-opacity-75 flex items-center justify-center z-50 animate-fade-in'>
      <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500' />
    </div>
  );
}
