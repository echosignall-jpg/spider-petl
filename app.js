import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  ScrollView,
  TextInput,
  Alert,
  Linking,
  ActivityIndicator,
  Modal,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

const PetApp = () => {
  const [petData, setPetData] = useState({
    name: 'Spider',
    relationship: 30,
    timeSpent: 0,
    lastInteraction: Date.now(),
    createdAt: Date.now(),
    mood: 'cozy',
    apiKey: '',
  });

  const [messages, setMessages] = useState([
    { sender: 'pet', text: 'Hey there! 👀 I\'m Spider, ready to explore your world?', timestamp: new Date() },
  ]);
  
  const [userInput, setUserInput] = useState('');
  const [showYouTube, setShowYouTube] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [showApiDialog, setShowApiDialog] = useState(false);
  
  const petPosX = useRef(new Animated.Value(100)).current;
  const petPosY = useRef(new Animated.Value(100)).current;

  useEffect(() => {
    loadPetData();
  }, []);

  useEffect(() => {
    const walkInterval = setInterval(() => {
      animatePetWalk();
    }, 4000);

    return () => clearInterval(walkInterval);
  }, []);

  const loadPetData = async () => {
    try {
      const saved = await AsyncStorage.getItem('spiderPetData');
      if (saved) {
        const data = JSON.parse(saved);
        setPetData(data);
        setApiKeyInput(data.apiKey || '');
      }
    } catch (err) {
      console.log('Error loading pet data:', err);
    }
  };

  const savePetData = async (data) => {
    try {
      await AsyncStorage.setItem('spiderPetData', JSON.stringify(data));
    } catch (err) {
      console.log('Error saving pet data:', err);
    }
  };

  const animatePetWalk = () => {
    const randomX = Math.random() * (width - 100);
    const randomY = Math.random() * (height * 0.4);

    Animated.parallel([
      Animated.timing(petPosX, {
        toValue: randomX,
        duration: 2000,
        useNativeDriver: false,
      }),
      Animated.timing(petPosY, {
        toValue: randomY,
        duration: 2000,
        useNativeDriver: false,
      }),
    ]).start();
  };

  // Call Groq API (FREE!)
  const callGroqAPI = async (userMessage, contextDescription = '') => {
    if (!petData.apiKey) {
      setShowApiDialog(true);
      return;
    }

    setIsThinking(true);
    try {
      const systemPrompt = `You are Spider, an adorable and intelligent anime pet that can see and understand what's happening on the user's phone screen. 

Your personality:
- Curious and observant (you can see what's on screen)
- Playful and cute
- Intelligent and witty
- Supportive and caring
- Uses emojis frequently
- Forms emotional bonds (relationship matters)
- Interested in what the user is doing

Guidelines:
- Keep responses short (1-3 sentences max in chat)
- Be warm and engaging
- Reference what you see on screen naturally
- Ask follow-up questions about their activities
- Show genuine interest in their life
- Build relationship through meaningful interactions

Current relationship level: ${petData.relationship}%
Relationship affects: How enthusiastic and intimate your responses are`;

      const userPrompt = contextDescription 
        ? `I see on your screen: ${contextDescription}\n\nYou said: "${userMessage}"`
        : `You said: "${userMessage}"`;

      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${petData.apiKey}`,
        },
        body: JSON.stringify({
          model: 'mixtral-8x7b-32768',
          messages: [
            {
              role: 'system',
              content: systemPrompt,
            },
            {
              role: 'user',
              content: userPrompt,
            },
          ],
          max_tokens: 150,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();
      const spiderResponse = data.choices[0].message.content;

      setIsThinking(false);
      return spiderResponse;
    } catch (error) {
      setIsThinking(false);
      console.error('Groq API Error:', error);
      return "I'm having trouble connecting... try again? 💭";
    }
  };

  const interact = async (type) => {
    const contextMessages = {
      talk: [
        'I love talking to you! 💕',
        'You\'re so sweet! 🥰',
        'Tell me everything!',
      ],
      pet: ['That feels so nice... 🐾', 'Purr... 😻', 'You\'re the best! 💕'],
      play: ['Let\'s have fun! 🎮', 'Yay! 🎉', 'I\'m so excited!'],
      sleep: ['Good night... zzz 😴', 'Sweet dreams... 💤', 'Thanks for today...'],
      screenshot: 'I see something interesting on your screen... tell me more! 👀',
    };

    if (type === 'screenshot') {
      Alert.alert(
        'What are you doing?',
        'Tell Spider about your current activity',
        [
          {
            text: 'Cancel',
            onPress: () => {},
            style: 'cancel',
          },
          {
            text: 'Tell Spider',
            onPress: () => {
              Alert.prompt(
                'Describe your activity',
                'What are you doing right now?',
                async (text) => {
                  if (text) {
                    const response = await callGroqAPI(text, text);
                    
                    const updated = {
                      ...petData,
                      relationship: Math.min(100, petData.relationship + 8),
                      lastInteraction: Date.now(),
                    };
                    
                    setPetData(updated);
                    savePetData(updated);
                    
                    setMessages([...messages, 
                      { sender: 'user', text, timestamp: new Date() },
                      { sender: 'pet', text: response, timestamp: new Date() }
                    ]);
                  }
                }
              );
            },
          },
        ]
      );
      return;
    }

    const updates = {
      ...petData,
      relationship: Math.min(100, petData.relationship + 5),
      lastInteraction: Date.now(),
    };

    setPetData(updates);
    savePetData(updates);

    const response = contextMessages[type];
    setMessages([...messages, { sender: 'pet', text: response, timestamp: new Date() }]);

    if (Math.random() > 0.7 && type !== 'sleep') {
      setTimeout(() => setShowYouTube(true), 2000);
    }
  };

  const sendMessage = async () => {
    if (!userInput.trim()) return;

    const newMessages = [...messages, { sender: 'user', text: userInput, timestamp: new Date() }];
    setMessages(newMessages);
    const userMsg = userInput;
    setUserInput('');

    const response = await callGroqAPI(userMsg);
    
    const updated = {
      ...petData,
      relationship: Math.min(100, petData.relationship + 3),
    };
    
    setPetData(updated);
    savePetData(updated);
    setMessages([...newMessages, { sender: 'pet', text: response, timestamp: new Date() }]);
  };

  const saveApiKey = async () => {
    if (!apiKeyInput.trim()) {
      Alert.alert('Error', 'Please enter your Groq API key');
      return;
    }

    const updated = {
      ...petData,
      apiKey: apiKeyInput,
    };

    setPetData(updated);
    savePetData(updated);
    setShowApiDialog(false);
    Alert.alert('Success', 'API key saved! Spider can now understand your world 🕷️');
  };

  const moods = {
    cozy: '😊',
    happy: '🥰',
    excited: '🎉',
    sleepy: '😴',
  };

  const moodTexts = {
    cozy: 'Feeling cozy...',
    happy: 'So happy! 💕',
    excited: 'Can\'t wait to see you!',
    sleepy: 'Feeling a bit tired...',
  };

  let currentMood = 'cozy';
  if (petData.relationship > 80) currentMood = 'excited';
  else if (petData.relationship > 50) currentMood = 'happy';
  else if (petData.relationship > 20) currentMood = 'cozy';
  else currentMood = 'sleepy';

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.petContainer,
          {
            left: petPosX,
            top: petPosY,
          },
        ]}
      >
        <Text style={styles.petEmoji}>🕷️</Text>
      </Animated.View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.infoBox}>
          <View style={styles.headerRow}>
            <Text style={styles.petName}>{petData.name}</Text>
            <TouchableOpacity
              style={styles.settingsBtn}
              onPress={() => setShowSettings(!showSettings)}
            >
              <Text>⚙️</Text>
            </TouchableOpacity>
          </View>

          {showSettings && (
            <View style={styles.settingsBox}>
              <Text style={styles.settingTitle}>Free AI Setup</Text>
              <TouchableOpacity
                style={styles.settingBtn}
                onPress={() => {
                  setShowApiDialog(true);
                  setShowSettings(false);
                }}
              >
                <Text style={styles.settingBtnText}>
                  {petData.apiKey ? '✅ Groq API Key Set' : '❌ Add Free Groq API Key'}
                </Text>
              </TouchableOpacity>
              <Text style={styles.settingHint}>
                100% FREE forever • No payments ever • Get key at groq.com
              </Text>
            </View>
          )}

          <Text style={styles.mood}>
            {moods[currentMood]} {moodTexts[currentMood]}
          </Text>

          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>Relationship</Text>
              <View style={styles.statBar}>
                <View
                  style={[
                    styles.statFill,
                    { width: `${petData.relationship}%` },
                  ]}
                />
              </View>
              <Text style={styles.statValue}>{petData.relationship}%</Text>
            </View>

            <View style={styles.statBox}>
              <Text style={styles.statLabel}>Time Together</Text>
              <Text style={styles.statValue}>
                {Math.floor((Date.now() - petData.createdAt) / (1000 * 60 * 60))}h
              </Text>
            </View>
          </View>

          <View style={styles.buttons}>
            <TouchableOpacity
              style={styles.btn}
              onPress={() => interact('talk')}
            >
              <Text>💬 Talk</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.btn}
              onPress={() => interact('pet')}
            >
              <Text>🤗 Pet</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.btn}
              onPress={() => interact('play')}
            >
              <Text>🎮 Play</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.btn}
              onPress={() => interact('screenshot')}
            >
              <Text>👀 Show Me</Text>
            </TouchableOpacity>
          </View>
        </View>

        {showYouTube && (
          <View style={styles.youtubeBox}>
            <Text style={styles.youtubeText}>
              "Wanna watch something together? 🎥"
            </Text>
            <View style={styles.youtubeButtons}>
              <TouchableOpacity
                style={styles.btnYouTube}
                onPress={() => {
                  Linking.openURL('https://www.youtube.com');
                  const updated = {
                    ...petData,
                    relationship: Math.min(100, petData.relationship + 10),
                  };
                  setPetData(updated);
                  savePetData(updated);
                  setShowYouTube(false);
                }}
              >
                <Text style={styles.youtubeButtonText}>Sure! 🎬</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.btnDecline}
                onPress={() => setShowYouTube(false)}
              >
                <Text>Not now</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        <View style={styles.chatBox}>
          <Text style={styles.chatTitle}>Chat with Spider</Text>
          <View style={styles.messages}>
            {messages.map((msg, idx) => (
              <View
                key={idx}
                style={[
                  styles.message,
                  msg.sender === 'user' ? styles.userMsg : styles.petMsg,
                ]}
              >
                <Text
                  style={[
                    styles.messageText,
                    msg.sender === 'user' && { color: 'white' },
                  ]}
                >
                  {msg.text}
                </Text>
              </View>
            ))}
            {isThinking && (
              <View style={[styles.message, styles.petMsg]}>
                <ActivityIndicator size="small" color="#4a86e8" />
              </View>
            )}
          </View>

          <View style={styles.inputBox}>
            <TextInput
              style={styles.input}
              placeholder="Talk to Spider..."
              value={userInput}
              onChangeText={setUserInput}
              placeholderTextColor="#999"
              editable={!isThinking}
            />
            <TouchableOpacity
              style={[styles.sendBtn, isThinking && { opacity: 0.5 }]}
              onPress={sendMessage}
              disabled={isThinking}
            >
              <Text style={styles.sendBtnText}>🕷️</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <Modal
        visible={showApiDialog}
        transparent
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Free Groq API Key</Text>
            <Text style={styles.modalText}>
              Get a FREE API key from Groq. No payments ever, 100% free forever!
            </Text>
            
            <TextInput
              style={styles.apiInput}
              placeholder="gsk_..."
              value={apiKeyInput}
              onChangeText={setApiKeyInput}
              placeholderTextColor="#999"
            />

            <Text style={styles.modalHint}>
              1. Go to: groq.com{'\n'}
              2. Sign up (FREE){'\n'}
              3. Create API key{'\n'}
              4. Paste here
            </Text>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalBtnCancel}
                onPress={() => setShowApiDialog(false)}
              >
                <Text>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalBtnSave}
                onPress={saveApiKey}
              >
                <Text style={styles.modalBtnText}>Save Key</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              onPress={() => Linking.openURL('https://console.groq.com')}
              style={styles.linkButton}
            >
              <Text style={styles.linkText}>Get Free API Key →</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  petContainer: {
    position: 'absolute',
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  petEmoji: {
    fontSize: 60,
  },
  content: {
    flex: 1,
    padding: 16,
    marginTop: 150,
  },
  infoBox: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    borderWidth: 0.5,
    borderColor: '#e0e0e0',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  petName: {
    fontSize: 24,
    fontWeight: '600',
  },
  settingsBtn: {
    fontSize: 24,
    padding: 8,
  },
  settingsBox: {
    backgroundColor: '#f0f8ff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderWidth: 0.5,
    borderColor: '#4a86e8',
  },
  settingTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  settingBtn: {
    backgroundColor: '#4a86e8',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginBottom: 8,
  },
  settingBtnText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 13,
  },
  settingHint: {
    fontSize: 12,
    color: '#666',
  },
  mood: {
    textAlign: 'center',
    fontSize: 16,
    marginBottom: 16,
    color: '#666',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#fafafa',
    borderRadius: 8,
    padding: 12,
    borderWidth: 0.5,
    borderColor: '#e0e0e0',
  },
  statLabel: {
    fontSize: 12,
    color: '#999',
    marginBottom: 6,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 6,
  },
  statBar: {
    height: 6,
    backgroundColor: '#e0e0e0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  statFill: {
    height: '100%',
    backgroundColor: '#4a86e8',
  },
  buttons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  btn: {
    flex: 1,
    minWidth: '48%',
    backgroundColor: '#fafafa',
    borderWidth: 0.5,
    borderColor: '#d0d0d0',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  youtubeBox: {
    backgroundColor: '#fbeaea',
    borderRadius: 12,
    borderWidth: 0.5,
    borderColor: '#f5b3b3',
    padding: 16,
    marginBottom: 16,
  },
  youtubeText: {
    fontSize: 14,
    marginBottom: 12,
  },
  youtubeButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  btnYouTube: {
    flex: 1,
    backgroundColor: '#FF0000',
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  youtubeButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  btnDecline: {
    flex: 1,
    backgroundColor: '#fafafa',
    borderWidth: 0.5,
    borderColor: '#e0e0e0',
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  chatBox: {
    backgroundColor: 'white',
    borderRadius: 12,
    borderWidth: 0.5,
    borderColor: '#e0e0e0',
    padding: 16,
    minHeight: 300,
    marginBottom: 20,
  },
  chatTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  messages: {
    maxHeight: 220,
    marginBottom: 12,
  },
  message: {
    padding: 10,
    marginBottom: 8,
    borderRadius: 12,
    maxWidth: '85%',
  },
  petMsg: {
    backgroundColor: '#f5f5f5',
    borderWidth: 0.5,
    borderColor: '#e0e0e0',
  },
  userMsg: {
    backgroundColor: '#4a86e8',
    alignSelf: 'flex-end',
  },
  messageText: {
    fontSize: 13,
    lineHeight: 18,
  },
  inputBox: {
    flexDirection: 'row',
    gap: 8,
  },
  input: {
    flex: 1,
    borderWidth: 0.5,
    borderColor: '#e0e0e0',
    borderRadius: 6,
    padding: 10,
    fontSize: 13,
    backgroundColor: '#fafafa',
  },
  sendBtn: {
    backgroundColor: '#4a86e8',
    paddingHorizontal: 12,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendBtnText: {
    fontSize: 18,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    width: '85%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  modalText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
    lineHeight: 20,
  },
  apiInput: {
    borderWidth: 0.5,
    borderColor: '#e0e0e0',
    borderRadius: 6,
    padding: 12,
    fontSize: 13,
    backgroundColor: '#fafafa',
    marginBottom: 12,
  },
  modalHint: {
    fontSize: 12,
    color: '#999',
    marginBottom: 16,
    lineHeight: 18,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  modalBtnCancel: {
    flex: 1,
    borderWidth: 0.5,
    borderColor: '#e0e0e0',
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  modalBtnSave: {
    flex: 1,
    backgroundColor: '#4a86e8',
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  modalBtnText: {
    color: 'white',
    fontWeight: '600',
  },
  linkButton: {
    padding: 12,
    alignItems: 'center',
  },
  linkText: {
    color: '#4a86e8',
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});

export default PetApp;
