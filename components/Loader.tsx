import React from 'react';

export const Loader: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center">
      <div className="relative w-24 h-24 mb-8">
        <div className="absolute top-0 left-0 w-full h-full border-4 border-emerald-100 rounded-full"></div>
        <div className="absolute top-0 left-0 w-full h-full border-4 border-emerald-600 rounded-full border-t-transparent animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10 text-emerald-600 animate-pulse">
            <path fillRule="evenodd" d="M12.22 2.22a.75.75 0 011.06 0 8.676 8.676 0 012.518 6.211c.045 1.588.567 3.111 1.526 4.39l1.618 2.157a.75.75 0 01-.6 1.201c-.857.015-1.657.36-2.263.973a.75.75 0 01-1.113-.998c.306-.341.658-.594 1.02-.772l-1.135-1.514a9.675 9.675 0 00-1.71-2.368 5.958 5.958 0 00-4.28-1.879 2.98 2.98 0 01-2.84-1.894.75.75 0 011.288-.653 1.48 1.48 0 001.415.947c1.968 0 3.822.87 5.088 2.385.36.43.678.89.95 1.366a7.216 7.216 0 00-1.468-4.55z" clipRule="evenodd" />
          </svg>
        </div>
      </div>
      <h2 className="text-2xl font-semibold text-gray-800 mb-2">Analyzing your plant...</h2>
      <p className="text-gray-500 max-w-md">Our AI botanist is examining the leaves, stems, and patterns to identify this species and generate care instructions.</p>
    </div>
  );
};