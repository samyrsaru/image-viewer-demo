export const Loader = ({ fullScreen = false }: { fullScreen?: boolean }) => {
  return (
    <div
      className={
        "flex justify-center items-center h-full w-full " +
        (fullScreen ? "absolute" : "")
      }
      style={{
        backgroundColor: `rgba(0, 0, 0, ${fullScreen ? "0.3" : "0"})`,
      }}
    >
      <span
        className="
        w-16 h-16
        border-4
        border-orange-500
        border-b-white
        animate-spin
        rounded-full
        "
      ></span>
    </div>
  );
};
