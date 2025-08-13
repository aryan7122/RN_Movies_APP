import { View, ActivityIndicator } from "react-native";

const Loader = ({ isLoading }) => {
  if (!isLoading) return null;

  return (
    <View
      className="absolute flex justify-center items-center w-full h-full bg-primary/60 z-10"
      style={{
        height: "100%",
      }}
    >
      <ActivityIndicator animating={isLoading} color="#fff" size={50} />
    </View>
  );
};

export default Loader;
