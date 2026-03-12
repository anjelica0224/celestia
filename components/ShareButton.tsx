import Ionicons from "@expo/vector-icons/Ionicons";
import { Share, TouchableOpacity } from "react-native";

interface ShareButtonProps {
  event: Events;
  style?: object;
}

export default function ShareButton({ event, style }: ShareButtonProps) {
  const handleShare = async () => {
    const category =
      event.category && event.category !== "other"
        ? event.category
            .replace(/_/g, " ")
            .replace(/\b\w/g, (c) => c.toUpperCase())
        : null;

    const meta = [
      event.viewing_time,
      event.visibility,
      event.requires_equipment,
    ]
      .filter(Boolean)
      .join(" • ");

    const shareText = [
      `✨ ${event.event_name}`,
      `${event.date_display}${category ? ` • ${category}` : ""}`,
      "",
      "Look up tonight 👀",
      "",
      event.description,
      "",
      meta ? `🔭 ${meta}` : null,
      "",
      event.detail_url ? `Learn more: ${event.detail_url}` : null,
      "",
      " ",
      "Download Celestia to follow the night sky and never miss an event!",
    ]
      .filter(Boolean)
      .join("\n");

    try {
      await Share.share({
        message: shareText,
        title: event.event_name,
        url: event.detail_url ?? undefined,
      });
    } catch (error) {
      console.error("Share failed:", error);
    }
  };

  return (
    <TouchableOpacity
      className="w-11 h-11 rounded-full bg-black/50 border border-white/20 items-center justify-center"
      onPress={handleShare}
      style={style}
    >
      <Ionicons name="share-outline" size={20} color="#fff" />
    </TouchableOpacity>
  );
}