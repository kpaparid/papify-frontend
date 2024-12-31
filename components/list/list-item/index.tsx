import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { ReactElement, useState } from 'react';
import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  ImageSourcePropType,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function ListItem({
  onSave,
  onClick,
  isSaved,
  id,
  title,
  descriptions,
  imageUrl,
  labels,
  isDownloaded,
  onDownload,
  onDelete,
}: {
  isDownloaded?: boolean;
  onDownload?: (id: string) => Promise<void> | void;
  onSave?: (id: string) => Promise<void> | void;
  onClick?: (id: string) => Promise<void> | void;
  onDelete?: (id: string) => Promise<void> | void;
  isSaved?: boolean;
  id: string;
  title: string;
  descriptions?: {
    icon?: string;
    text: string;
  }[];
  imageUrl?: ImageSourcePropType;
  labels?: {
    text: string;
    isActive: boolean;
    onClick: ({
      id,
      category,
      value,
    }: {
      id: string;
      category: string;
      value: boolean;
    }) => void;
  }[];
}) {
  const [status, setStatus] = useState({ error: false, loading: false });

  const handleSaveTrack = async () => {
    setStatus({ error: false, loading: true });
    try {
      await onSave?.(id);
      setStatus({ error: false, loading: false });
    } catch {
      setStatus({ error: true, loading: false });
    }
  };

  const handleDownloadTrack = async () => {
    setStatus({ error: false, loading: true });
    try {
      await onDownload?.(id);
      setStatus({ error: false, loading: false });
    } catch {
      setStatus({ error: true, loading: false });
    }
  };

  const handleDeleteTrack = async () => {
    setStatus({ error: false, loading: true });
    try {
      await onDelete?.(id);
      setStatus({ error: false, loading: false });
    } catch {
      setStatus({ error: true, loading: false });
    }
  };
  return (
    <TouchableOpacity style={styles.container} onPress={() => onClick?.(id)}>
      <View style={styles.horizontalItem}>
        {imageUrl && (
          <Image source={{ uri: imageUrl }} style={styles.horizontalImage} />
        )}
        <View style={styles.trackContainer}>
          <View style={styles.trackInfo}>
            <Text style={styles.trackTitle} numberOfLines={1}>
              {title}
            </Text>
            <Text
              style={[styles.trackArtist, { marginBottom: 2 }]}
              numberOfLines={1}
            >
              <View style={styles.horizontalDetails}>
                {descriptions?.map(({ icon, text }) => (
                  <View key={text} style={styles.tracksInfo}>
                    {icon && <Ionicons name={icon} size={16} />}
                    <Text style={styles.trackText}>{text}</Text>
                  </View>
                ))}
              </View>
            </Text>
            {labels && (
              <Text style={styles.trackArtist}>
                <View style={styles.labelContainer}>
                  {labels.map(({ text, isActive, onClick }) => (
                    <TouchableOpacity
                      key={text}
                      onPress={() =>
                        onClick({ id, category: text, value: !isActive })
                      }
                    >
                      <Text
                        style={[styles.label, isActive && styles.activeLabel]}
                      >
                        {text}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </Text>
            )}
          </View>

          {onSave && typeof onSave !== 'undefined' && (
            <View style={styles.trackActions}>
              <TouchableOpacity
                onPress={handleSaveTrack}
                style={styles.saveButton}
                disabled={status.loading}
              >
                {status.loading ? (
                  <ActivityIndicator color="rgba(255, 255, 255, 0.3)" />
                ) : (
                  <Ionicons
                    name={isSaved ? 'heart' : 'heart-outline'}
                    size={20}
                    color={
                      isSaved
                        ? 'rgba(255, 255, 255, 0.8)'
                        : 'rgba(255, 255, 255, 0.3)'
                    }
                  />
                )}
              </TouchableOpacity>
            </View>
          )}
          {!isDownloaded && onDownload && typeof onDownload !== 'undefined' && (
            <View style={styles.trackActions}>
              <TouchableOpacity
                onPress={handleDownloadTrack}
                style={styles.saveButton}
                disabled={status.loading}
              >
                <Ionicons
                  // name={'cloud-download-outline'}
                  name="download-outline"
                  size={20}
                  color={
                    isSaved
                      ? 'rgba(255, 255, 255, 0.8)'
                      : 'rgba(255, 255, 255, 0.3)'
                  }
                />
              </TouchableOpacity>
            </View>
          )}
          {onDelete && typeof onDelete !== 'undefined' && (
            <View style={styles.trackActions}>
              <TouchableOpacity
                onPress={handleDeleteTrack}
                style={styles.saveButton}
                disabled={status.loading}
              >
                {status.loading ? (
                  <ActivityIndicator color="rgba(255, 255, 255, 0.3)" />
                ) : (
                  <Ionicons
                    name={'trash-outline'}
                    // name={'cloud-download-outline'}
                    size={20}
                    color={
                      isSaved
                        ? 'rgba(255, 255, 255, 0.8)'
                        : 'rgba(255, 255, 255, 0.3)'
                    }
                  />
                )}
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
    paddingHorizontal: 0,
    marginHorizontal: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  labelContainer: {
    marginTop: 3,
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 5,
    maxWidth: '100%',
  },
  label: {
    borderRadius: 6,
    // borderWidth: 1,
    // borderStyle: 'solid',
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    color: 'rgba(0, 0, 0, 0.4)',
    // color: '#000',
    // backgroundColor: 'rgba(0, 0, 0, 0.25)',
    // opacity: 0.5,
    lineHeight: 14,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: 500,
  },
  activeLabel: {
    backgroundColor: 'rgba(255, 255, 255, 1)',
    // backgroundColor: 'rgba(255, 255, 255, 0.1)',
    opacity: 1,
    // borderColor: 'rgba(255, 255, 255, 0.1)',
    color: '#000',
  },
  tracksInfo: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 15,
    gap: 5,
    // color: 'rgba(255, 255, 255, 0.5)',
    color: '#fff',
  },
  trackText: {
    color: 'rgba(255, 255, 255, 0.5)',
    lineHeight: 14,
  },
  horizontalDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  horizontalDetailText: {
    // fontSize: 12,
    // color: Colors.dark.mutedForeground,
    marginLeft: 5,
    marginRight: 10,
  },
  trackImageContainer: {
    width: 40,
    height: 40,
    borderRadius: 5,
    overflow: 'hidden',
    marginRight: 16,
  },
  trackImage: {
    width: '100%',
    height: '100%',
  },
  horizontalItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  horizontalImage: {
    width: 45,
    height: 45,
    borderRadius: 8,
    marginRight: 15,
  },
  trackContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  trackInfo: {
    flex: 1,
    marginRight: 16,
  },
  trackTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 500,
  },
  trackArtist: {
    // color: Colors.dark.mutedForeground,
    color: '#fff',
    opacity: 0.6,
    fontSize: 14,
    marginTop: 4,
  },
  trackActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trackDuration: {
    color: '#b3b3b3',
    fontSize: 14,
    marginRight: 16,
  },
  saveButton: {
    padding: 8,
  },
  saveIcon: {
    color: '#fff',
    opacity: 0.6,
  },
  savedIcon: {
    color: Colors.dark.primary,
    opacity: 1,
  },
});
