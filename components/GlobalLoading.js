const GlobalLoading = ({ isLoading }) => {
  return (
    <div
      className={`fixed inset-0 z-[100] transition-opacity duration-300 ease-in-out ${
        isLoading ? 'visible opacity-100' : 'invisible opacity-0'
      }`}
    >
      <div className="absolute inset-0 bg-[#2e2257] bg-opacity-95 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-full border-4 border-accent border-t-transparent animate-spin" />
          <div className="text-sm uppercase tracking-[0.25em] text-white/90">
            Loading...
          </div>
        </div>
      </div>
    </div>
  );
};

export default GlobalLoading;
