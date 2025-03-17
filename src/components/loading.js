// Loading animation component
if (isLoading) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center"
        >
          <div className="text-3xl font-serif tracking-widest text-stone-800">DELICIAE</div>
          <div className="mt-8 w-8 h-8 border-2 border-stone-200 border-t-stone-800 rounded-full animate-spin"></div>
        </motion.div>
      </div>
    );
  }