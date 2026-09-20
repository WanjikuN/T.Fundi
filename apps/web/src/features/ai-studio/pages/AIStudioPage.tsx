import { useNavigate } from "react-router-dom";
import AIStudioLanding from "../components/AIStudioLanding";

const AIStudioPage = () => {
  const navigate = useNavigate();

  return (
    <AIStudioLanding
      onProductIntelligence={() =>
        navigate("/ai-studio/product-intelligence")
      }
      onRoomVisualizer={() =>
        navigate("/ai-studio/room-visualizer")
      }
    />
  );
};

export default AIStudioPage;