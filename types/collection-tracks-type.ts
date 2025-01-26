import { ImageSourcePropType } from "react-native";
import { CollectionType } from "./collection-type";
import { SavedTrackType } from "./saved-track-type";

export default interface CollectionTracksType {
  tracks: SavedTrackType[];
  collections: CollectionType[];
}

// export default interface CollectionTracksType {
//   tracks: {
//     id: string;
//     collectionIds: string[];
//     spotify: {
//       spotifyId: string;
//       album: {
//         id: string;
//         name: string;
//         artists: {
//           name: string;
//           id: string;
//         }[];
//         images: ImageSourcePropType[];
//         release_date: string;
//       };
//       name: string;
//       popularity: number;
//       duration_ms: number;
//       artists: {
//         name: string;
//         id: string;
//       }[];
//     };
//     youtube?: {
//       spotifyId: string;
//       youtubeId: string;
//       title: string;
//       publish_date: string;
//       images: ImageSourcePropType[];
//       description: string;
//     }[];
//   }[];
//   collections: CollectionType[];
// }
