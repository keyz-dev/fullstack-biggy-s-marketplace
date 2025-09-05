import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  Text,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { Search, MapPin, X } from 'lucide-react-native';
import { COLORS, SIZES, FONTS } from '../../constants';

const MobileAddressInput = ({
  value,
  onChange,
  onFocus,
  onBlur,
  loading = false,
  searchLoading = false,
  suggestions = [],
  onSuggestionSelect,
  placeholder = "Search for an address...",
  style,
}) => {
  const inputRef = useRef(null);
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = () => {
    setIsFocused(true);
    if (onFocus) onFocus();
  };

  const handleBlur = () => {
    // Delay to allow suggestion selection
    setTimeout(() => {
      setIsFocused(false);
      if (onBlur) onBlur();
    }, 200);
  };

  const handleSuggestionPress = (suggestion) => {
    if (onSuggestionSelect) {
      onSuggestionSelect(suggestion);
    }
    setIsFocused(false);
  };

  const clearInput = () => {
    onChange('');
    inputRef.current?.focus();
  };

  const renderSuggestion = ({ item, index }) => (
    <TouchableOpacity
      style={styles.suggestionItem}
      onPress={() => handleSuggestionPress(item)}
      activeOpacity={0.7}
    >
      <MapPin size={16} color={COLORS.gray} style={styles.suggestionIcon} />
      <View style={styles.suggestionContent}>
        <Text style={styles.suggestionTitle} numberOfLines={1}>
          {item.display_name}
        </Text>
        {item.address && (
          <Text style={styles.suggestionSubtitle} numberOfLines={1}>
            {item.address.city || item.address.town || item.address.village || ''}
            {item.address.state && `, ${item.address.state}`}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );

  const showSuggestions = isFocused && suggestions.length > 0 && value.length >= 3;

  return (
    <View style={[styles.container, style]}>
      <View style={[styles.inputContainer, isFocused && styles.inputFocused]}>
        {/* Search Icon or Loading Spinner */}
        <View style={styles.iconContainer}>
          {loading ? (
            <ActivityIndicator size="small" color={COLORS.primary} />
          ) : (
            <Search
              size={20}
              color={searchLoading ? COLORS.primary : COLORS.gray}
            />
          )}
        </View>

        {/* Text Input */}
        <TextInput
          ref={inputRef}
          style={styles.input}
          value={value}
          onChangeText={onChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={loading ? "Getting your location..." : placeholder}
          placeholderTextColor={COLORS.gray}
          editable={!loading}
          autoCorrect={false}
          autoCapitalize="none"
          returnKeyType="search"
        />

        {/* Clear Button */}
        {value.length > 0 && !loading && (
          <TouchableOpacity
            style={styles.clearButton}
            onPress={clearInput}
            activeOpacity={0.7}
          >
            <X size={16} color={COLORS.gray} />
          </TouchableOpacity>
        )}
      </View>

      {/* Suggestions List */}
      {showSuggestions && (
        <View style={styles.suggestionsContainer}>
          <FlatList
            data={suggestions}
            renderItem={renderSuggestion}
            keyExtractor={(item, index) => `${item.lat}-${item.lon}-${index}`}
            style={styles.suggestionsList}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          />
        </View>
      )}

      {/* Loading Overlay for Suggestions */}
      {isFocused && searchLoading && value.length >= 3 && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="small" color={COLORS.primary} />
          <Text style={styles.loadingText}>Searching addresses...</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    zIndex: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    paddingHorizontal: SIZES.padding,
    paddingVertical: SIZES.padding * 0.8,
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  inputFocused: {
    borderColor: COLORS.primary,
    shadowOpacity: 0.2,
  },
  iconContainer: {
    marginRight: SIZES.padding * 0.5,
    width: 20,
    alignItems: 'center',
  },
  input: {
    flex: 1,
    fontSize: SIZES.font,
    fontFamily: FONTS.regular,
    color: COLORS.black,
    paddingVertical: 0,
  },
  clearButton: {
    marginLeft: SIZES.padding * 0.5,
    padding: 4,
  },
  suggestionsContainer: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    borderTopWidth: 0,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    maxHeight: 200,
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 1000,
  },
  suggestionsList: {
    maxHeight: 200,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SIZES.padding,
    paddingVertical: SIZES.padding * 0.8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  suggestionIcon: {
    marginRight: SIZES.padding * 0.5,
  },
  suggestionContent: {
    flex: 1,
  },
  suggestionTitle: {
    fontSize: SIZES.font,
    fontFamily: FONTS.medium,
    color: COLORS.black,
    marginBottom: 2,
  },
  suggestionSubtitle: {
    fontSize: SIZES.font * 0.9,
    fontFamily: FONTS.regular,
    color: COLORS.gray,
  },
  loadingOverlay: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    borderTopWidth: 0,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    padding: SIZES.padding,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 1000,
  },
  loadingText: {
    marginLeft: SIZES.padding * 0.5,
    fontSize: SIZES.font,
    fontFamily: FONTS.regular,
    color: COLORS.gray,
  },
});

export default MobileAddressInput;

