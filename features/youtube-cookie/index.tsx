import { postCookies } from '@/api/callbacks';
import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, ScrollView } from 'react-native';
import { WebView } from 'react-native-webview';
// import CookieManager, { Cookie } from '@react-native-cookies/cookies';

// Function to get all cookies for the current WebView session

const YouTubeLogin = () => {
  const [cookies, setCookies] = useState<string>(''); // Store cookies manually if required
  const [uri, setUri] = useState(
    'https://accounts.google.com/ServiceLogin?service=youtube',
  ); // WebView URI
  const [isWebViewOpen, setIsWebViewOpen] = useState(false); // Track WebView visibility
  const [key, setKey] = useState(0); // Key to force WebView reload
  const fetchCookies = async () => {
    // const cookies = await CookieManager.get('https://www.youtube.com/');
    // // console.log('Fetched cookies:', cookies);
    // const formatedCookies = formatCookiesToNetscape(cookies);
    // console.log(formatedCookies);
    // return cookies;
  };
  // Function to handle saving cookies from WebView
  const handleSaveCookies = (cookieString: string) => {
    setCookies(cookieString); // Save cookies to state
  };
  // const formatCookiesToNetscape = cookies => {
  //   let netscapeFormatCookies =
  //     '# Netscape HTTP Cookie File\n# This is a generated file! Do not edit.\n\n';

  //   // Iterate over each cookie and format it as Netscape format
  //   for (const cookieName in cookies) {
  //     if (cookies.hasOwnProperty(cookieName)) {
  //       const cookie = cookies[cookieName] as Cookie;
  //       console.log(cookie);

  //       // Example format: domain, path, secure, expiry, name, value
  //       const domain = cookie.domain || '.youtube.com'; // Default to google.com if not provided
  //       const path = cookie.path || '/'; // Default to '/' path
  //       const secure = cookie.secure ? 'TRUE' : 'FALSE';
  //       const httpOnly = cookie.httpOnly ? 'TRUE' : 'FALSE';
  //       const expires = cookie.expires || new Date('2030-01-19').getTime(); // Default to 0 if no expiry is set
  //       const name = cookie.name;
  //       const value = cookie.value;

  //       // Format as Netscape cookie line
  //       netscapeFormatCookies += `${domain}    TRUE    ${path}    ${secure}    ${expires}    ${name}    ${value}\n`;
  //     }
  //   }

  //   return netscapeFormatCookies;
  // };
  const handlePostCookies = async () => {
    try {
      // const formatedCookies = formatCookiesToNetscape(cookies);
      // console.log(formatedCookies);
      await postCookies(cookies); // Send cookies to the backend
      console.log('Cookies posted successfully.');
    } catch (error) {
      console.error('Error posting cookies:', error);
    }
  };

  // Handle WebView message event to get cookies or login state
  const handleOnMessage = event => {
    const cookieString = event.nativeEvent.data;
    if (cookieString) {
      handleSaveCookies(cookieString); // Save cookies if available
    }
  };

  // Open WebView to the login page
  const openWebView = () => {
    setIsWebViewOpen(true); // Show WebView
    setKey(prevKey => prevKey + 1); // Force WebView reload (fresh instance)
  };

  // Close WebView
  const closeWebView = () => {
    setIsWebViewOpen(false); // Hide WebView
  };

  // Fetch cookies on button click (can be used for logging in or checking cookies)
  const handleFetchCookies = async () => {
    const fetchedCookies = await fetchCookies(); // Get cookies for the given URL
    // console.log(JSON.stringify(fetchedCookies));
    // console.log(formatCookiesToNetscape(JSON.parse(JSON.stringify(fetchedCookies))));
    setCookies(JSON.stringify(fetchedCookies)); // Save cookies to state
  };

  return (
    <View style={{ flex: 1 }}>
      {!isWebViewOpen ? (
        // Show the current cookies and the Open WebView button
        <View style={styles.loggedInContainer}>
          <Text style={styles.title}>Current Cookies:</Text>
          <ScrollView style={styles.cookiesTextContainer}>
            <Text style={styles.cookiesText}>
              {cookies ? cookies : 'No cookies saved'}
            </Text>
          </ScrollView>
          <Button title="Open WebView" onPress={openWebView} />
          <Button title="Fetch Cookies" onPress={handleFetchCookies} />
          <Button title="Post Cookies" onPress={handlePostCookies} />
        </View>
      ) : (
        // WebView is open
        <WebView
          key={key} // Forces a new WebView instance on refresh
          source={{ uri }} // The WebView source URI (login page or logged-in page)
          injectedJavaScript={`window.ReactNativeWebView.postMessage(document.cookie);`} // Get cookies from WebView
          onMessage={handleOnMessage} // Receive cookies from WebView
          startInLoadingState={true} // Show loading spinner while loading
        />
      )}

      {/* Bottom buttons visible after opening WebView */}
      {isWebViewOpen && (
        <View style={styles.buttonContainer}>
          <Button title="Close WebView" onPress={closeWebView} color="red" />
          <Button
            title="Save Cookies"
            onPress={() => alert('Cookies saved: ' + cookies)}
          />
          <Button title="Post Cookies" onPress={handlePostCookies} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  loggedInContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  cookiesTextContainer: {
    maxHeight: 200,
    marginBottom: 20,
    padding: 10,
    borderColor: '#ccc',
    borderWidth: 1,
    width: '100%',
  },
  cookiesText: {
    fontSize: 14,
    color: '#fff',
    paddingBottom: 20,
  },
  buttonContainer: {
    padding: 10,
  },
  title: {
    fontSize: 18,
    marginBottom: 10,
  },
});

export default YouTubeLogin;
