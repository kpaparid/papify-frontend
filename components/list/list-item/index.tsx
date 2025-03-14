import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Image,
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
  loadingDownload,
  downloadDisabled,
  onDownload,
  onDelete,
}: {
  isDownloaded?: boolean;
  onDownload?: (id: string) => Promise<void> | void;
  onSave?: (id: string) => Promise<void> | void;
  onClick?: (id: string) => Promise<void> | void;
  onDelete?: (id: string) => Promise<void> | void;
  loadingDownload?: boolean;
  downloadDisabled?: boolean;
  isSaved?: boolean;
  id: string;
  title: string;
  descriptions?: {
    icon?: keyof typeof Ionicons.glyphMap;
    text: string;
  }[];
  imageUrl?: string;
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
  const [status, setStatus] = useState<
    { error: boolean; loading: boolean; action?: string }[]
  >([]);
  // console.log('status', status);

  const updateStatus = (
    action: string,
    newStatus: { error: boolean; loading: boolean },
  ) => {
    setStatus(prevStatus => {
      const updatedStatus = prevStatus.filter(s => s.action !== action);
      return [...updatedStatus, { ...newStatus, action }];
    });
  };
  // console.log(status);

  const handleClick = async () => {
    updateStatus('click', { error: false, loading: true });
    try {
      await onClick?.(id);
      updateStatus('click', { error: false, loading: false });
    } catch {
      updateStatus('click', { error: true, loading: false });
    }
  };

  const handleSave = async () => {
    updateStatus('save', { error: false, loading: true });
    try {
      await onSave?.(id);
      updateStatus('save', { error: false, loading: false });
    } catch {
      updateStatus('save', { error: true, loading: false });
    }
  };

  const handleDownload = async () => {
    updateStatus('download', { error: false, loading: true });
    try {
      await onDownload?.(id);
      updateStatus('download', { error: false, loading: false });
    } catch {
      updateStatus('download', { error: true, loading: false });
    }
  };

  const handleDelete = async () => {
    updateStatus('delete', { error: false, loading: true });
    try {
      await onDelete?.(id);
      updateStatus('delete', { error: false, loading: false });
    } catch {
      updateStatus('delete', { error: true, loading: false });
    }
  };
  const handleLabelToggle = async (
    labelId: string,
    toggleClickFn: () => Promise<void> | void,
  ) => {
    // console.log('toggle label', labelId);
    updateStatus(`labelToggle-${labelId}`, { error: false, loading: true });
    try {
      await toggleClickFn?.();
      updateStatus(`labelToggle-${labelId}`, { error: false, loading: false });
    } catch (error) {
      console.error(error);
      updateStatus(`labelToggle-${labelId}`, { error: true, loading: false });
    }
  };

  const getStatus = (action: string) =>
    status.find(s => s.action === action) || { error: false, loading: false };
  return (
    <TouchableOpacity style={styles.container} onPress={handleClick}>
      <View style={styles.horizontalItem}>
        {imageUrl && <Image source={{ uri: imageUrl }} style={styles.horizontalImage} />}
        <View style={styles.trackContainer}>
          <View style={styles.trackInfo}>
            <Text
              style={[styles.trackTitle, !isDownloaded && { opacity: 0.35 }]}
              numberOfLines={1}
            >
              {title}
            </Text>
            <Text style={[styles.trackArtist, { marginBottom: 2 }]} numberOfLines={1}>
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
                  {labels.map(({ text, isActive, onClick }, index) => (
                    <TouchableOpacity
                      key={text}
                      disabled={loadingDownload}
                      onPress={() =>
                        handleLabelToggle(`label_${text}_${index}`, () =>
                          onClick({ id, category: text, value: !isActive }),
                        )
                      }
                    >
                      <Text
                        style={[
                          styles.label,
                          (isActive || getStatus(`label_${text}_${index}`).loading) &&
                            styles.activeLabel,
                          loadingDownload && { opacity: 0.35 },
                          // (isActive || getStatus(`labelToggle-${id}`).loading === true) && styles.activeLabel,
                        ]}
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
                onPress={handleSave}
                style={styles.saveButton}
                disabled={getStatus('save').loading}
              >
                {getStatus('save').loading ? (
                  <ActivityIndicator color="rgba(255, 255, 255, 0.3)" />
                ) : (
                  <Ionicons
                    name={isSaved ? 'heart' : 'heart-outline'}
                    size={20}
                    color={
                      isSaved ? 'rgba(255, 255, 255, 0.8)' : 'rgba(255, 255, 255, 0.3)'
                    }
                  />
                )}
              </TouchableOpacity>
            </View>
          )}
          {onDownload && typeof onDownload !== 'undefined' && (
            <View style={styles.trackActions}>
              <TouchableOpacity
                onPress={handleDownload}
                style={[styles.saveButton, downloadDisabled && { opacity: 0.4 }]}
                disabled={getStatus('download').loading || downloadDisabled}
              >
                {getStatus('download').loading ? (
                  <ActivityIndicator color="rgba(255, 255, 255, 0.3)" />
                ) : (
                  <Ionicons
                    name="download-outline"
                    size={20}
                    color={
                      isSaved ? 'rgba(255, 255, 255, 0.8)' : 'rgba(255, 255, 255, 0.3)'
                    }
                  />
                )}
              </TouchableOpacity>
            </View>
          )}
          {!loadingDownload && onDelete && typeof onDelete !== 'undefined' && (
            <View style={styles.trackActions}>
              <TouchableOpacity
                onPress={handleDelete}
                style={styles.saveButton}
                disabled={getStatus('delete').loading}
              >
                {getStatus('delete').loading ? (
                  <ActivityIndicator color="rgba(255, 255, 255, 0.3)" />
                ) : (
                  <Ionicons
                    name={'trash-outline'}
                    size={20}
                    color={
                      isSaved ? 'rgba(255, 255, 255, 0.8)' : 'rgba(255, 255, 255, 0.3)'
                    }
                  />
                )}
              </TouchableOpacity>
            </View>
          )}
          {loadingDownload && (
            <View style={styles.trackActions}>
              <TouchableOpacity
                onPress={handleDownload}
                style={styles.saveButton}
                disabled={true}
              >
                <ActivityIndicator color="rgba(255, 255, 255, 0.3)" />
              </TouchableOpacity>
            </View>
          )}
          {getStatus('click').loading ? (
            <ActivityIndicator color="rgba(255, 255, 255, 0.3)" />
          ) : null}
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
    overflow: 'scroll',
    marginTop: 3,
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 5,
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
    width: '100%',
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
